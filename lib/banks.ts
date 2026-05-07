export type PartnerBank = {
  id: string;
  name: string;
  city: string;
  focus: string;
  minScore: number;
  maxTicket: number;
  interestRate: number;
  processingTime: string;
};

export const partnerBanks: PartnerBank[] = [
  {
    id: "BANK-001",
    name: "Saathi Bank",
    city: "Mumbai",
    focus: "Working capital for retail and trade",
    minScore: 650,
    maxTicket: 500000,
    interestRate: 10,
    processingTime: "24 hours"
  },
  {
    id: "BANK-002",
    name: "Udyam Credit Co-op",
    city: "Ahmedabad",
    focus: "Textile, manufacturing, and supplier invoices",
    minScore: 700,
    maxTicket: 750000,
    interestRate: 12,
    processingTime: "48 hours"
  },
  {
    id: "BANK-003",
    name: "Bharat Growth Finance",
    city: "Bengaluru",
    focus: "Digital services and export MSMEs",
    minScore: 750,
    maxTicket: 1000000,
    interestRate: 9,
    processingTime: "Same day"
  }
];
