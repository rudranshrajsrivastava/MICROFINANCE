import { Prisma } from "@prisma/client";
import { initialState } from "./storage";
import type { AppState, Block, Loan, PurchaseOrder, ShipmentEvent, Supplier, Transaction, UserProfile } from "./types";
import { hasDatabaseUrl, prisma } from "./prisma";

function toDate(value: string) {
  return new Date(value);
}

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

export async function getDatabaseState(): Promise<AppState | null> {
  if (!hasDatabaseUrl()) return null;

  const [users, transactions, blocks, loans, suppliers, purchaseOrders] = await Promise.all([
    prisma.userProfile.findMany({ orderBy: { updatedAt: "desc" }, take: 1 }),
    prisma.transaction.findMany({ orderBy: { date: "desc" } }),
    prisma.block.findMany({ orderBy: { blockIndex: "asc" } }),
    prisma.loan.findMany({ orderBy: { requestedAt: "desc" } }),
    prisma.supplier.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.purchaseOrder.findMany({ include: { events: { orderBy: { timestamp: "asc" } } }, orderBy: { createdAt: "desc" } })
  ]);

  const empty = transactions.length === 0 && loans.length === 0 && suppliers.length === 0 && purchaseOrders.length === 0 && blocks.length === 0 && users.length === 0;
  if (empty) return initialState;

  return {
    user: users[0] ? {
      id: users[0].id,
      businessName: users[0].businessName,
      email: users[0].email,
      password: users[0].password,
      businessType: users[0].businessType,
      signedIn: users[0].signedIn
    } : null,
    transactions: transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      counterparty: tx.counterparty,
      amount: tx.amount,
      category: tx.category,
      date: dateOnly(tx.date)
    })),
    blocks: blocks.map((block) => ({
      id: block.id,
      index: block.blockIndex,
      timestamp: block.timestamp.toISOString(),
      eventType: block.eventType,
      payload: block.payload as Record<string, unknown>,
      previousHash: block.previousHash,
      currentHash: block.currentHash
    })),
    loans: loans.map((loan) => ({
      id: loan.id,
      bankId: loan.bankId ?? undefined,
      bankName: loan.bankName ?? undefined,
      amount: loan.amount,
      approvedAmount: loan.approvedAmount,
      interestRate: loan.interestRate,
      termMonths: loan.termMonths,
      repaid: loan.repaid,
      status: loan.status,
      requestedAt: loan.requestedAt.toISOString()
    })),
    suppliers: suppliers.map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
      city: supplier.city,
      category: supplier.category
    })),
    purchaseOrders: purchaseOrders.map((order) => ({
      id: order.id,
      supplierId: order.supplierId,
      supplierName: order.supplierName,
      amount: order.amount,
      items: order.items,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      events: order.events.map((event) => ({
        id: event.id,
        status: event.status,
        location: event.location,
        note: event.note,
        timestamp: event.timestamp.toISOString()
      }))
    }))
  };
}

export async function saveDatabaseState(state: AppState): Promise<void> {
  if (!hasDatabaseUrl()) return;

  await prisma.$transaction(async (tx) => {
    await tx.shipmentEvent.deleteMany();
    await tx.purchaseOrder.deleteMany();
    await tx.supplier.deleteMany();
    await tx.loan.deleteMany();
    await tx.block.deleteMany();
    await tx.transaction.deleteMany();

    if (state.user) {
      await tx.userProfile.upsert({
        where: { id: state.user.id },
        create: state.user,
        update: state.user
      });
    }

    if (state.transactions.length) {
      await tx.transaction.createMany({
        data: state.transactions.map((item: Transaction) => ({
          id: item.id,
          type: item.type,
          counterparty: item.counterparty,
          amount: item.amount,
          category: item.category,
          date: toDate(item.date)
        }))
      });
    }

    if (state.blocks.length) {
      await tx.block.createMany({
        data: state.blocks.map((item: Block) => ({
          id: item.id,
          blockIndex: item.index,
          timestamp: toDate(item.timestamp),
          eventType: item.eventType,
          payload: item.payload as Prisma.InputJsonValue,
          previousHash: item.previousHash,
          currentHash: item.currentHash
        }))
      });
    }

    if (state.loans.length) {
      await tx.loan.createMany({
        data: state.loans.map((item: Loan) => ({
          id: item.id,
          bankId: item.bankId,
          bankName: item.bankName,
          amount: item.amount,
          approvedAmount: item.approvedAmount,
          interestRate: item.interestRate,
          termMonths: item.termMonths,
          repaid: item.repaid,
          status: item.status,
          requestedAt: toDate(item.requestedAt)
        }))
      });
    }

    if (state.suppliers.length) {
      await tx.supplier.createMany({
        data: state.suppliers.map((item: Supplier) => item)
      });
    }

    for (const order of state.purchaseOrders) {
      await tx.purchaseOrder.create({
        data: {
          id: order.id,
          supplierId: order.supplierId,
          supplierName: order.supplierName,
          amount: order.amount,
          items: order.items,
          status: order.status,
          createdAt: toDate(order.createdAt),
          events: {
            create: order.events.map((event: ShipmentEvent) => ({
              id: event.id,
              status: event.status,
              location: event.location,
              note: event.note,
              timestamp: toDate(event.timestamp)
            }))
          }
        }
      });
    }
  });
}
