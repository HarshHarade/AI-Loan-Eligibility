import React, { useState, useId } from 'react';
import { Currency } from '../types/finance';
import {
  calculateEmi,
  generateAmortizationSchedule,
  generateAnnualSummary,
  calculatePrepaymentImpact,
  formatCurrency,
  formatPercent,
  generateAmortizationCsv,
  downloadCsvFile,
} from '../utils/financeMath';
import {
  Download,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EmiCalculatorProps {
  currency: Currency;
  initialPrincipal?: number;
  initialRate?: number;
  initialTenureMonths?: number;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({
  currency,
  initialPrincipal = 50000,
  initialRate = 8.5,
  initialTenureMonths = 60,
}) => {
  const [principal, setPrincipal] = useState<number>(initialPrincipal);
  const [rate, setRate] = useState<number>(initialRate);
  const [tenureMonths, setTenureMonths] = useState<number>(initialTenureMonths);
  const [isYearsMode, setIsYearsMode] = useState<boolean>(true);

  // Prepayment state
  const [extraMonthly, setExtraMonthly] = useState<number>(0);
  const [lumpSum, setLumpSum] = useState<number>(0);
  const [showPrepayment, setShowPrepayment] = useState<boolean>(false);

  // Schedule view mode
  const [scheduleView, setScheduleView] = useState<'annual' | 'monthly'>('annual');
  const [rowsToShow, setRowsToShow] = useState<number>(24);

  // Generate unique IDs for accessibility
  const principalSliderId = useId();
  const rateSliderId = useId();
  const tenureSliderId = useId();
  const extraMonthlySliderId = useId();
  const lumpSumSliderId = useId();

  // Core Math
  const monthlyEmi = calculateEmi(principal, rate, tenureMonths);
  const totalPayment = monthlyEmi * tenureMonths;
  const totalInterest = Math.max(0, totalPayment - principal);
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalRatio = 100 - interestRatio;

  // Schedules
  const fullMonthlySchedule = generateAmortizationSchedule(principal, rate, tenureMonths);
  const annualSchedule = generateAnnualSummary(fullMonthlySchedule);

  // Prepayment simulation
  const prepaymentResult = calculatePrepaymentImpact(
    principal,
    rate,
    tenureMonths,
    extraMonthly,
    lumpSum
  );

  const handleExportSchedule = () => {
    const csv = generateAmortizationCsv(fullMonthlySchedule, currency);
    downloadCsvFile(csv, `Credex_Amortization_Schedule_${principal}_${rate}pct.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Amortization Engine</span>
            <span aria-hidden="true">·</span>
            <span>Mathematical Precision</span>
            <span aria-hidden="true">·</span>
            <span>Prepayment Savings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dynamic EMI Calculator & Amortizer
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate exact reducing-balance interest formulas, evaluate principal-to-interest equity progression, and forecast interest saved via prepayment.
          </p>
        </div>

        <button
          onClick={handleExportSchedule}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-xs font-medium text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Amortization (CSV)</span>
        </button>
      </div>

      {/* Main Grid: Inputs Left (55%), Summary & Donut Right (45%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-5">
            <h3 className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>Loan Parameters</span>
              <span className="text-xs text-slate-400 font-mono">Reducing Balance</span>
            </h3>

            {/* Principal Amount */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={principalSliderId} className="text-slate-300 font-medium">Loan Principal Amount</label>
                <span className="text-cyan-400 font-mono font-bold tabular-nums text-base">
                  {formatCurrency(principal, currency)}
                </span>
              </div>
              <input
                id={principalSliderId}
                type="range"
                min="2000"
                max="500000"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>{formatCurrency(2000, currency)}</span>
                <span>{formatCurrency(250000, currency)}</span>
                <span>{formatCurrency(500000, currency)}</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={rateSliderId} className="text-slate-300 font-medium">Annual Interest Rate (p.a.)</label>
                <span className="text-emerald-400 font-mono font-bold tabular-nums text-base">
                  {formatPercent(rate, 2)}
                </span>
              </div>
              <input
                id={rateSliderId}
                type="range"
                min="1"
                max="24"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>1.0% (Prime Sovereign)</span>
                <span>8.5% (Benchmark)</span>
                <span>24.0% (Unsecured)</span>
              </div>
            </div>

            {/* Tenure with Years / Months Switch */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={tenureSliderId} className="text-slate-300 font-medium">Loan Duration</label>
                <div className="flex items-center gap-3">
                  <span className="text-slate-200 font-mono font-bold text-sm">
                    {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} Years)
                  </span>
                  <div className="flex rounded-md p-0.5 bg-slate-900 border border-white/10 text-[10px]">
                    <button
                      onClick={() => setIsYearsMode(false)}
                      className={`px-2 py-0.5 rounded ${
                        !isYearsMode ? 'bg-cyan-500/30 text-cyan-300 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      Mo
                    </button>
                    <button
                      onClick={() => setIsYearsMode(true)}
                      className={`px-2 py-0.5 rounded ${
                        isYearsMode ? 'bg-cyan-500/30 text-cyan-300 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      Yr
                    </button>
                  </div>
                </div>
              </div>
              <input
                id={tenureSliderId}
                type="range"
                min={isYearsMode ? 1 : 6}
                max={isYearsMode ? 30 : 360}
                step={isYearsMode ? 1 : 6}
                value={isYearsMode ? Math.round(tenureMonths / 12) : tenureMonths}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTenureMonths(isYearsMode ? val * 12 : val);
                }}
                className="w-full accent-slate-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex gap-1.5 mt-2">
                {[12, 36, 60, 120, 180, 240, 360].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTenureMonths(m)}
                    className={`text-[10px] px-2.5 py-1 rounded font-mono transition-colors ${
                      tenureMonths === m
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m / 12}y
                  </button>
                ))}
              </div>
            </div>

            {/* Prepayment Foreclosure Simulator Accordion */}
            <div className="border-t border-white/[0.06] pt-4">
              <button
                onClick={() => setShowPrepayment(!showPrepayment)}
                className="w-full flex items-center justify-between text-xs text-cyan-300 font-semibold hover:text-cyan-200 transition-colors"
              >
                <span>Interactive Prepayment & Foreclosure Simulator</span>
                {showPrepayment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showPrepayment && (
                <div className="mt-3 p-4 rounded-lg bg-slate-900/60 border border-cyan-500/20 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <label htmlFor={extraMonthlySliderId} className="text-slate-300">Extra Monthly Payment</label>
                      <span className="font-mono text-emerald-400 font-bold">
                        +{formatCurrency(extraMonthly, currency)} / mo
                      </span>
                    </div>
                    <input
                      id={extraMonthlySliderId}
                      type="range"
                      min="0"
                      max={monthlyEmi || 2000}
                      step="25"
                      value={extraMonthly}
                      onChange={(e) => setExtraMonthly(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <label htmlFor={lumpSumSliderId} className="text-slate-300">Upfront Lump-Sum Prepayment</label>
                      <span className="font-mono text-cyan-400 font-bold">
                        {formatCurrency(lumpSum, currency)}
                      </span>
                    </div>
                    <input
                      id={lumpSumSliderId}
                      type="range"
                      min="0"
                      max={principal * 0.5}
                      step="500"
                      value={lumpSum}
                      onChange={(e) => setLumpSum(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Prepayment Savings Result */}
                  {(extraMonthly > 0 || lumpSum > 0) && (
                    <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                      <div className="font-semibold text-emerald-300">
                        Prepayment Savings Forecast:
                      </div>
                      <div className="grid grid-cols-2 gap-2 font-mono text-slate-200 text-[11px] pt-1">
                        <div>
                          Interest Saved:{' '}
                          <span className="text-emerald-400 font-bold">
                            {formatCurrency(prepaymentResult.interestSaved, currency)}
                          </span>
                        </div>
                        <div>
                          Tenure Shaved Off:{' '}
                          <span className="text-cyan-400 font-bold">
                            {prepaymentResult.monthsSaved} Months (
                            {(prepaymentResult.monthsSaved / 12).toFixed(1)} yrs)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Key Figures & Equity Bar */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-5">
            <h3 className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>Amortization Breakdown</span>
              <span className="text-xs text-slate-400 font-mono">Financial Schedule</span>
            </h3>

            {/* Big Monthly EMI Display */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-white/[0.08] text-center space-y-1">
              <div className="text-xs uppercase tracking-wider font-mono text-slate-400">
                Monthly Loan Repayment (EMI)
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight tabular-nums">
                {formatCurrency(monthlyEmi, currency)}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Principal + Interest per month
              </div>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-white/[0.05]">
                <div className="text-[11px] text-slate-400">Total Interest Outgo</div>
                <div className="text-base font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                  {formatCurrency(totalInterest, currency)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  {interestRatio.toFixed(1)}% of total payment
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/50 border border-white/[0.05]">
                <div className="text-[11px] text-slate-400">Total Capital Repaid</div>
                <div className="text-base font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
                  {formatCurrency(totalPayment, currency)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Principal + Total Interest
                </div>
              </div>
            </div>

            {/* Visual Ratio Bar: Principal vs Interest */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-cyan-400">Principal: {principalRatio.toFixed(1)}%</span>
                <span className="text-amber-400">Interest: {interestRatio.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${principalRatio}%` }}
                  className="bg-cyan-500 h-full transition-all duration-300"
                />
                <div
                  style={{ width: `${interestRatio}%` }}
                  className="bg-amber-500 h-full transition-all duration-300"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>Borrowed Capital: {formatCurrency(principal, currency)}</span>
                <span>Interest Cost: {formatCurrency(totalInterest, currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Data Table */}
      <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Repayment Amortization Ledger</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg p-0.5 bg-slate-900 border border-white/10 text-xs">
              <button
                onClick={() => setScheduleView('annual')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  scheduleView === 'annual'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Annual Summary
              </button>
              <button
                onClick={() => setScheduleView('monthly')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  scheduleView === 'monthly'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly Schedule
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          {scheduleView === 'annual' ? (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Opening Balance</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3">Total Annual Outgo</th>
                  <th className="py-2.5 px-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono">
                {annualSchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-slate-300">{formatCurrency(row.openingBalance, currency)}</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-medium">{formatCurrency(row.principalPaid, currency)}</td>
                    <td className="py-2.5 px-3 text-amber-400 font-medium">{formatCurrency(row.interestPaid, currency)}</td>
                    <td className="py-2.5 px-3 text-slate-200">{formatCurrency(row.totalPaid, currency)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-medium">
                      {formatCurrency(row.closingBalance, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Opening Balance</th>
                  <th className="py-2.5 px-3">EMI</th>
                  <th className="py-2.5 px-3">Principal</th>
                  <th className="py-2.5 px-3">Interest</th>
                  <th className="py-2.5 px-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono">
                {fullMonthlySchedule.slice(0, rowsToShow).map((row) => (
                  <tr key={row.month} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-3 text-slate-300">Month {row.month}</td>
                    <td className="py-2 px-3 text-slate-400">{formatCurrency(row.openingBalance, currency)}</td>
                    <td className="py-2 px-3 text-slate-200 font-medium">{formatCurrency(row.emi, currency)}</td>
                    <td className="py-2 px-3 text-cyan-400">{formatCurrency(row.principal, currency)}</td>
                    <td className="py-2 px-3 text-amber-400">{formatCurrency(row.interest, currency)}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{formatCurrency(row.closingBalance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {scheduleView === 'monthly' && rowsToShow < fullMonthlySchedule.length && (
          <div className="text-center pt-2">
            <button
              onClick={() => setRowsToShow((prev) => prev + 48)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium font-mono"
            >
              Show next 48 months (Total: {fullMonthlySchedule.length}) ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
