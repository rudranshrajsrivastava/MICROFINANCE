export type TransactionType = "sale" | "purchase" | "expense";
export type ShipmentStatus = "created" | "dispatched" | "in_transit" | "delivered";
export type LoanStatus = "approved" | "rejected" | "active" | "partially_repaid" | "repaid";

export type UserProfile = {
  id: string;
  businessName: string;
  email: string;
  password: string;
  businessType: string;
  signedIn: boolean;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  counterparty: string;
  amount: number;
  category: string;
  date: string;
};

export type Block = {
  id: string;
  index: number;
  timestamp: string;
  eventType: string;
  payload: Record<string, unknown>;
  previousHash: string;
  currentHash: string;
};

export type Loan = {
  id: string;
  bankId?: string;
  bankName?: string;
  amount: number;
  approvedAmount: number;
  interestRate: number;
  termMonths: number;
  repaid: number;
  status: LoanStatus;
  requestedAt: string;
};

export type Supplier = {
  id: string;
  name: string;
  city: string;
  category: string;
};

export type ShipmentEvent = {
  id: string;
  status: ShipmentStatus;
  location: string;
  note: string;
  timestamp: string;
};

export type PurchaseOrder = {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  items: string;
  status: ShipmentStatus;
  events: ShipmentEvent[];
  createdAt: string;
};

export type AppState = {
  user: UserProfile | null;
  transactions: Transaction[];
  blocks: Block[];
  loans: Loan[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
};
