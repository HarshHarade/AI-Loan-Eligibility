export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
}

export interface LoanEligibilityInput {
  monthlyIncome: number;
  existingEmi: number;
  loanAmountRequested: number;
  loanTenorMonths: number;
  interestRateAnnual: number;
  creditScore: number;
  employmentType: 'Salaried' | 'Self-Employed' | 'Business Owner';
  loanPurpose: 'Home / Mortgage' | 'Personal' | 'Auto / Vehicle' | 'Business Expansion' | 'Education';
  hasCoApplicant: boolean;
  hasCollateral: boolean;
}

export interface LoanEligibilityResult {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
  foirPercent: number;
  maxEligibleAmount: number;
  isEligibleRuleBased: boolean;
}

export interface AiEligibilityAssessment {
  verdict: 'APPROVED' | 'CONDITIONALLY_APPROVED' | 'HIGH_RISK_REJECTED';
  underwriterSummary: string;
  riskTier: 'Low' | 'Moderate' | 'Elevated' | 'High';
  approvalProbability: number;
  strengths: string[];
  vulnerabilities: string[];
  recommendedActionItems: Array<{
    title: string;
    impact: 'High' | 'Medium' | 'Low';
    description: string;
  }>;
  optimalLoanStructure: {
    recommendedAmount: number;
    recommendedTenureMonths: number;
    targetEmi: number;
    negotiationTip: string;
  };
}

export interface CreditBureauProfile {
  creditScore: number;
  paymentHistoryScore: number; // e.g. 99%
  creditUtilization: number; // e.g. 24%
  averageAccountAgeYears: number; // e.g. 4.2
  hardInquiriesLast6Months: number;
  totalCreditLimit: number;
  totalCurrentBalance: number;
  activeAccounts: number;
  delinquentAccounts: number;
}

export interface AiCreditDiagnosis {
  scoreTier: string;
  interestRateImpact: string;
  primaryHurdle: string;
  factorBreakdown: Array<{
    factor: string;
    impactWeight: string;
    status: 'Good' | 'Warning' | 'Critical';
    insight: string;
  }>;
  potentialScoreGain: string;
  roadmap: {
    day30: string[];
    day60: string[];
    day90: string[];
  };
}

export interface AmortizationRow {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
}

export interface AmortizationAnnualSummary {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}

export interface PrepaymentAnalysis {
  originalMonths: number;
  newMonths: number;
  monthsSaved: number;
  originalTotalInterest: number;
  newTotalInterest: number;
  interestSaved: number;
}

export interface FinancialRecord {
  id: string;
  date: string;
  category: 'Income' | 'Debt / EMI' | 'Living Expense' | 'Investment' | 'Savings';
  title: string;
  amount: number;
  notes?: string;
}

export interface AiStrategyItem {
  category: 'Debt Optimization' | 'Emergency Cushion' | 'Cashflow Engineering' | 'Investment & Growth' | 'Tax & Insurance';
  headline: string;
  estimatedMonthlySavings: number;
  priority: 'High' | 'Medium' | 'Low';
  rationale: string;
  actionStep: string;
}

export interface AiTipsResponse {
  financialHealthScore: number;
  overallVerdict: string;
  strategies: AiStrategyItem[];
  goldenRuleSummary: string;
}
