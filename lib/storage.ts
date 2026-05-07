import type { AppState, Block, Loan, PurchaseOrder, Supplier, Transaction, UserProfile } from "./types";

const STORAGE_KEY = "msme-chain-state-v2";

const transactions: Transaction[] = [
  { id: "tx-1", date: "2026-01-04", type: "sale", counterparty: "Sharma Traders", amount: 42000, category: "retail" },
  { id: "tx-2", date: "2026-01-11", type: "purchase", counterparty: "Gupta Raw Materials", amount: 18000, category: "raw_materials" },
  { id: "tx-3", date: "2026-02-06", type: "sale", counterparty: "Ahmed Exports", amount: 61250, category: "export" },
  { id: "tx-4", date: "2026-02-21", type: "purchase", counterparty: "Delhi Packaging", amount: 26400, category: "packaging" },
  { id: "tx-5", date: "2026-03-20", type: "sale", counterparty: "Kumar Logistics", amount: 57202, category: "consulting" },
  { id: "tx-6", date: "2026-03-26", type: "sale", counterparty: "Reddy Suppliers", amount: 71431, category: "retail" },
  { id: "tx-7", date: "2026-04-07", type: "expense", counterparty: "Workshop Rent", amount: 23481, category: "operations" },
  { id: "tx-8", date: "2026-04-19", type: "sale", counterparty: "Patel Retail", amount: 70678, category: "consulting" },
  { id: "tx-9", date: "2026-04-25", type: "sale", counterparty: "Ahmed Exports", amount: 89230, category: "raw_materials" },
  { id: "tx-10", date: "2026-05-07", type: "sale", counterparty: "PQRS", amount: 20000, category: "general" }
];

const suppliers: Supplier[] = [
  { id: "sup-1", name: "Gupta Raw Materials", city: "Delhi", category: "raw_materials" },
  { id: "sup-2", name: "Ahmed Exports", city: "Mumbai", category: "export" },
  { id: "sup-3", name: "Reddy Suppliers", city: "Hyderabad", category: "retail" }
];

const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    supplierId: "sup-1",
    supplierName: "Gupta Raw Materials",
    amount: 35000,
    items: "Cotton Yarn x100, Dye x20",
    status: "in_transit",
    createdAt: "2026-05-04T00:32:19.000Z",
    events: [
      { id: "se-1", status: "created", location: "Delhi", note: "PO generated", timestamp: "2026-05-04T00:32:19.000Z" },
      { id: "se-2", status: "dispatched", location: "Delhi Warehouse", note: "Picked up by carrier", timestamp: "2026-05-05T00:32:19.000Z" },
      { id: "se-3", status: "in_transit", location: "Agra Hub", note: "Crossed checkpoint", timestamp: "2026-05-06T00:32:19.000Z" }
    ]
  }
];

const loans: Loan[] = [
  { id: "loan-1", amount: 200000, approvedAmount: 200000, interestRate: 10, termMonths: 12, repaid: 10000, status: "partially_repaid", requestedAt: "2026-05-07T00:32:19.000Z" }
];

export const emptyUser: UserProfile = {
  id: "user-demo",
  businessName: "xyz",
  email: "abcde@gmail.com",
  password: "password123",
  businessType: "retail",
  signedIn: false
};

export const initialState: AppState = {
  user: emptyUser,
  transactions,
  blocks: [],
  loans,
  suppliers,
  purchaseOrders
};

export function loadState(): AppState {
  if (typeof window === "undefined") return initialState;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) as AppState : initialState;
}

export function saveState(state: AppState): void {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    const state = loadState();
    saveState({ ...state, user: state.user ? { ...state.user, signedIn: false } : null });
  }
}

export type StorageCollections = {
  users: UserProfile[];
  transactions: Transaction[];
  blocks: Block[];
  loans: Loan[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
};
