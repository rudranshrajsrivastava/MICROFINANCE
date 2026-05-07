const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const partnerBanks = [
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

async function main() {
  for (const bank of partnerBanks) {
    await prisma.partnerBank.upsert({
      where: { id: bank.id },
      update: bank,
      create: bank
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
