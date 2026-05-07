import type { AppState } from "./types";
import { calculateCreditScore, loanLimit } from "./credit-score";

export type InsightCard = {
  title: string;
  body: string;
};

export function generateInsights(state: AppState, prompt: string): InsightCard[] {
  const credit = calculateCreditScore(state.transactions, state.loans);
  const monthlyNetCashFlow = credit.netCashFlow / Math.max(credit.activeMonths, 1);
  const limit = loanLimit(credit.creditScore, monthlyNetCashFlow);
  const inTransit = state.purchaseOrders.filter((po) => po.status !== "delivered").length;
  const lowCount = credit.transactionCount < 30;

  return [
    {
      title: "Credit improvement plan",
      body: lowCount
        ? `Your ${credit.tier} score can improve fastest by recording weekly sales and purchases. Add at least ${30 - credit.transactionCount} more ledger entries to strengthen the transaction count factor.`
        : `Your ${credit.tier} score is supported by steady ledger activity. Preserve it by recording all repayments and avoiding missing shipment proofs.`
    },
    {
      title: "Supply chain risks",
      body: inTransit > 0
        ? `${inTransit} purchase order is still open. Update shipment status to delivered when goods arrive so inventory and credit evidence stay fresh.`
        : "No open shipment risk detected. Supplier records are clean and purchase orders are closed."
    },
    {
      title: "Working capital suggestions",
      body: credit.netCashFlow > 0
        ? `Net cash flow is positive. Keep a reserve of 20% of monthly net cash flow before taking fresh working capital.`
        : "Cash flow is negative. Prioritize collections, reduce non-essential expenses, and delay new purchase orders until sales recover."
    },
    {
      title: "Loan readiness",
      body: limit.approved
        ? `Based on the local policy, the business is loan-ready up to approximately ₹${limit.limit.toLocaleString("en-IN")} (${limit.multiplier}x monthly net cash flow). Prompt considered: "${prompt.slice(0, 90)}".`
        : "The current score is below 550, so new loans should be rejected until transaction volume, cash flow, or repayment history improves."
    }
  ];
}
