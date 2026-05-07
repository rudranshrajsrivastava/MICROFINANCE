import type { Loan, Transaction } from "./types";

export type CreditResult = {
  creditScore: number;
  tier: "Poor" | "Fair" | "Good" | "Excellent" | "Elite";
  totalVolume: number;
  transactionCount: number;
  activeMonths: number;
  netCashFlow: number;
  onTimeRepayments: number;
  totalRepayments: number;
  defaults: number;
  factors: {
    transactionVolumeScore: number;
    transactionCountScore: number;
    activeMonthsScore: number;
    cashFlowScore: number;
    repaymentScore: number;
    defaultPenalty: number;
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function calculateCreditScore(transactions: Transaction[], loans: Loan[]): CreditResult {
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const transactionCount = transactions.length;
  const months = new Set(transactions.map((tx) => tx.date.slice(0, 7)));
  const activeMonths = months.size;
  const sales = transactions.filter((tx) => tx.type === "sale").reduce((sum, tx) => sum + tx.amount, 0);
  const outflows = transactions.filter((tx) => tx.type !== "sale").reduce((sum, tx) => sum + tx.amount, 0);
  const netCashFlow = sales - outflows;
  const totalRepayments = loans.filter((loan) => loan.repaid > 0 || loan.status === "repaid" || loan.status === "partially_repaid").length;
  const onTimeRepayments = loans.filter((loan) => loan.repaid > 0 || loan.status === "repaid").length;
  const defaults = loans.filter((loan) => loan.status === "rejected").length;

  const transactionVolumeScore = Math.min(totalVolume / 1000000, 1) * 180;
  const transactionCountScore = Math.min(transactionCount / 100, 1) * 120;
  const activeMonthsScore = Math.min(activeMonths / 12, 1) * 100;
  const cashFlowScore = netCashFlow > 0 ? Math.min(netCashFlow / 500000, 1) * 150 : 0;
  const repaymentScore = (onTimeRepayments / Math.max(totalRepayments, 1)) * 150;
  const defaultPenalty = defaults * 80;
  const creditScore = Math.round(clamp(300 + transactionVolumeScore + transactionCountScore + activeMonthsScore + cashFlowScore + repaymentScore - defaultPenalty, 300, 900));

  const tier = creditScore >= 850 ? "Elite" : creditScore >= 750 ? "Excellent" : creditScore >= 650 ? "Good" : creditScore >= 550 ? "Fair" : "Poor";

  return {
    creditScore,
    tier,
    totalVolume,
    transactionCount,
    activeMonths,
    netCashFlow,
    onTimeRepayments,
    totalRepayments,
    defaults,
    factors: { transactionVolumeScore, transactionCountScore, activeMonthsScore, cashFlowScore, repaymentScore, defaultPenalty }
  };
}

export function loanLimit(score: number, monthlyNetCashFlow: number): { approved: boolean; multiplier: number; limit: number } {
  const safeCashFlow = Math.max(0, monthlyNetCashFlow);
  if (score >= 750) return { approved: true, multiplier: 5, limit: Math.round(safeCashFlow * 5) };
  if (score >= 650) return { approved: true, multiplier: 3, limit: Math.round(safeCashFlow * 3) };
  if (score >= 550) return { approved: true, multiplier: 1, limit: Math.round(safeCashFlow) };
  return { approved: false, multiplier: 0, limit: 0 };
}
