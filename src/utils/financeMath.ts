import {
  Currency,
  AmortizationRow,
  AmortizationAnnualSummary,
  PrepaymentAnalysis,
  FinancialRecord,
} from '../types/finance';

export const CURRENCY_CONFIGS: Record<Currency, { symbol: string; label: string }> = {
  USD: { symbol: '$', label: 'USD ($)' },
  INR: { symbol: '₹', label: 'INR (₹)' },
  EUR: { symbol: '€', label: 'EUR (€)' },
  GBP: { symbol: '£', label: 'GBP (£)' },
};

/**
 * Standard EMI formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
 * r = monthly interest rate = annualRate / 12 / 100
 * n = tenure in months
 */
export function calculateEmi(principal: number, annualRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate <= 0) return principal / tenureMonths;

  const r = annualRate / 12 / 100;
  const numerator = principal * r * Math.pow(1 + r, tenureMonths);
  const denominator = Math.pow(1 + r, tenureMonths) - 1;

  if (denominator === 0) return 0;
  return Math.round(numerator / denominator);
}

/**
 * Maximum eligible loan calculation based on 50% FOIR banking benchmark
 */
export function calculateMaxEligibleLoan(
  monthlyIncome: number,
  existingEmi: number,
  annualRate: number,
  tenureMonths: number,
  foirCapPercent: number = 50
): number {
  if (monthlyIncome <= 0 || tenureMonths <= 0) return 0;

  const maxAllowedTotalEmi = (monthlyIncome * foirCapPercent) / 100;
  const availableEmiForNewLoan = Math.max(0, maxAllowedTotalEmi - existingEmi);

  if (availableEmiForNewLoan <= 0) return 0;
  if (annualRate <= 0) return availableEmiForNewLoan * tenureMonths;

  const r = annualRate / 12 / 100;
  const factor = Math.pow(1 + r, tenureMonths);
  const principal = (availableEmiForNewLoan * (factor - 1)) / (r * factor);

  return Math.max(0, Math.round(principal));
}

/**
 * Generates month-by-month amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  if (principal <= 0 || tenureMonths <= 0) return schedule;

  const r = annualRate / 12 / 100;
  const emi = calculateEmi(principal, annualRate, tenureMonths);

  let currentBalance = principal;

  for (let m = 1; m <= tenureMonths; m++) {
    const openingBalance = currentBalance;
    const interest = r > 0 ? Math.round(openingBalance * r) : 0;
    let principalPaid = emi - interest;

    if (m === tenureMonths || principalPaid > openingBalance) {
      principalPaid = openingBalance;
    }

    const closingBalance = Math.max(0, openingBalance - principalPaid);
    currentBalance = closingBalance;

    schedule.push({
      month: m,
      year: Math.ceil(m / 12),
      openingBalance,
      emi: principalPaid + interest,
      principal: principalPaid,
      interest,
      closingBalance,
    });

    if (currentBalance <= 0) break;
  }

  return schedule;
}

/**
 * Generates annual aggregated amortization summary
 */
export function generateAnnualSummary(schedule: AmortizationRow[]): AmortizationAnnualSummary[] {
  const annualMap = new Map<number, AmortizationAnnualSummary>();

  schedule.forEach((row) => {
    if (!annualMap.has(row.year)) {
      annualMap.set(row.year, {
        year: row.year,
        openingBalance: row.openingBalance,
        principalPaid: 0,
        interestPaid: 0,
        totalPaid: 0,
        closingBalance: row.closingBalance,
      });
    }

    const item = annualMap.get(row.year)!;
    item.principalPaid += row.principal;
    item.interestPaid += row.interest;
    item.totalPaid += row.emi;
    item.closingBalance = row.closingBalance;
  });

  return Array.from(annualMap.values());
}

/**
 * Calculates prepayment impact (extra monthly payment or upfront lump sum)
 */
export function calculatePrepaymentImpact(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  extraMonthlyPayment: number,
  oneTimeLumpSum: number
): PrepaymentAnalysis {
  const originalEmi = calculateEmi(principal, annualRate, tenureMonths);
  const r = annualRate / 12 / 100;

  // Original total interest
  let originalInterest = 0;
  let bal = principal;
  for (let i = 0; i < tenureMonths; i++) {
    const int = bal * r;
    originalInterest += int;
    const prn = Math.min(bal, originalEmi - int);
    bal -= prn;
    if (bal <= 0) break;
  }

  // With prepayment
  let newBal = Math.max(0, principal - oneTimeLumpSum);
  let newInterest = 0;
  let newMonths = 0;

  while (newBal > 0 && newMonths < tenureMonths * 2) {
    newMonths++;
    const int = newBal * r;
    newInterest += int;
    const totalPay = originalEmi + extraMonthlyPayment;
    const prn = Math.min(newBal, totalPay - int);
    newBal -= prn;
    if (newBal <= 0) break;
  }

  return {
    originalMonths: tenureMonths,
    newMonths: Math.max(1, newMonths),
    monthsSaved: Math.max(0, tenureMonths - newMonths),
    originalTotalInterest: Math.round(originalInterest),
    newTotalInterest: Math.round(newInterest),
    interestSaved: Math.max(0, Math.round(originalInterest - newInterest)),
  };
}

/**
 * Currency formatter
 */
export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));

  return `${config.symbol}${formatted}`;
}

/**
 * Format standard percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value || 0).toFixed(decimals)}%`;
}

/**
 * Generates Google Sheets compatible CSV string
 */
export function generateGoogleSheetsCsv(records: FinancialRecord[], currency: Currency): string {
  const headers = ['Date', 'Category', 'Description / Title', `Amount (${currency})`, 'Notes', 'Logged Timestamp'];
  const rows = records.map((r) => [
    `"${r.date}"`,
    `"${r.category}"`,
    `"${r.title.replace(/"/g, '""')}"`,
    r.amount,
    `"${(r.notes || '').replace(/"/g, '""')}"`,
    `"${new Date().toISOString()}"`,
  ]);

  return [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
}

/**
 * Generates Amortization CSV for Google Sheets
 */
export function generateAmortizationCsv(schedule: AmortizationRow[], currency: Currency): string {
  const headers = [
    'Month',
    'Year',
    `Opening Balance (${currency})`,
    `Monthly EMI (${currency})`,
    `Principal Paid (${currency})`,
    `Interest Paid (${currency})`,
    `Closing Balance (${currency})`,
  ];

  const rows = schedule.map((s) => [
    s.month,
    s.year,
    s.openingBalance,
    s.emi,
    s.principal,
    s.interest,
    s.closingBalance,
  ]);

  return [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
}

/**
 * Triggers browser download of generated CSV
 */
export function downloadCsvFile(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
