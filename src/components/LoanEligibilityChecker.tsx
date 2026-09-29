import React, { useState, useId } from 'react';
import {
  Currency,
  LoanEligibilityInput,
  AiEligibilityAssessment,
} from '../types/finance';
import {
  calculateEmi,
  calculateMaxEligibleLoan,
  formatCurrency,
  formatPercent,
} from '../utils/financeMath';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  HelpCircle,
  Building2,
  Users,
  Briefcase,
} from 'lucide-react';

interface LoanEligibilityCheckerProps {
  currency: Currency;
  input: LoanEligibilityInput;
  setInput: React.Dispatch<React.SetStateAction<LoanEligibilityInput>>;
  onSyncToLedger?: () => void;
}

export const LoanEligibilityChecker: React.FC<LoanEligibilityCheckerProps> = ({
  currency,
  input,
  setInput,
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAssessment, setAiAssessment] = useState<AiEligibilityAssessment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate unique IDs for accessibility
  const incomeSliderId = useId();
  const emiSliderId = useId();
  const loanAmountSliderId = useId();
  const tenureSliderId = useId();
  const interestRateSliderId = useId();
  const creditScoreSliderId = useId();
  const coApplicantId = useId();
  const collateralId = useId();

  // Instant Mathematical calculations
  const proposedEmi = calculateEmi(
    input.loanAmountRequested,
    input.interestRateAnnual,
    input.loanTenorMonths
  );

  const totalMonthlyDebt = input.existingEmi + proposedEmi;
  const foirPercent = input.monthlyIncome > 0
    ? Number(((totalMonthlyDebt / input.monthlyIncome) * 100).toFixed(1))
    : 0;

  const maxEligibleLoan = calculateMaxEligibleLoan(
    input.monthlyIncome,
    input.existingEmi,
    input.interestRateAnnual,
    input.loanTenorMonths,
    50
  );

  const isEligibleRuleBased = foirPercent <= 50 && input.creditScore >= 650;

  const handleRunAiUnderwriting = async () => {
    setLoadingAi(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/analyze-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          calculatedEmi: proposedEmi,
          calculatedFoir: foirPercent,
          maxEligibleAmount: maxEligibleLoan,
        }),
      });

      if (!res.ok) {
        throw new Error(`Underwriting server returned code ${res.status}`);
      }

      const data = await res.json();
      setAiAssessment(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to connect to AI Underwriting service');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>BFSI Credit Engine</span>
            <span aria-hidden="true">·</span>
            <span>FOIR / DTI Underwriting</span>
            <span aria-hidden="true">·</span>
            <span>Gemini Reasoning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI Loan Eligibility Checker
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate institutional debt-service capacity benchmarks, calculate your Fixed Obligation to Income Ratio (FOIR), and receive AI credit risk underwriting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAiUnderwriting}
            disabled={loadingAi}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>{loadingAi ? 'Underwriting Application...' : 'Run AI Credit Underwriter'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Left (60%), Financial Diagnostics Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Parameters */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-5">
            <h3 className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>Financial Capacity Parameters</span>
              <span className="text-xs text-slate-400 font-mono">Step 1 of 2</span>
            </h3>

            {/* Monthly Income Slider + Input */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={incomeSliderId} className="text-slate-300 font-medium">Net Monthly Inflow</label>
                <span className="text-cyan-400 font-mono font-semibold tabular-nums text-sm">
                  {formatCurrency(input.monthlyIncome, currency)}
                </span>
              </div>
              <input
                id={incomeSliderId}
                type="range"
                min="1000"
                max="30000"
                step="250"
                value={input.monthlyIncome}
                onChange={(e) => setInput({ ...input, monthlyIncome: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>{formatCurrency(1000, currency)}</span>
                <span>{formatCurrency(15000, currency)}</span>
                <span>{formatCurrency(30000, currency)}</span>
              </div>
            </div>

            {/* Existing Debts / EMIs */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={emiSliderId} className="text-slate-300 font-medium">Existing Recurring EMIs & Debt</label>
                <span className="text-amber-400 font-mono font-semibold tabular-nums text-sm">
                  {formatCurrency(input.existingEmi, currency)}
                </span>
              </div>
              <input
                id={emiSliderId}
                type="range"
                min="0"
                max="15000"
                step="100"
                value={input.existingEmi}
                onChange={(e) => setInput({ ...input, existingEmi: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>{formatCurrency(0, currency)}</span>
                <span>{formatCurrency(7500, currency)}</span>
                <span>{formatCurrency(15000, currency)}</span>
              </div>
            </div>

            {/* Requested Loan Amount */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={loanAmountSliderId} className="text-slate-300 font-medium">Requested Loan Principal</label>
                <span className="text-emerald-400 font-mono font-semibold tabular-nums text-sm">
                  {formatCurrency(input.loanAmountRequested, currency)}
                </span>
              </div>
              <input
                id={loanAmountSliderId}
                type="range"
                min="5000"
                max="500000"
                step="2500"
                value={input.loanAmountRequested}
                onChange={(e) => setInput({ ...input, loanAmountRequested: Number(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>{formatCurrency(5000, currency)}</span>
                <span>{formatCurrency(250000, currency)}</span>
                <span>{formatCurrency(500000, currency)}</span>
              </div>
            </div>

            {/* Loan Tenure & Interest Rate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label htmlFor={tenureSliderId} className="text-slate-300 font-medium">Tenor Length</label>
                  <span className="text-slate-200 font-mono font-medium">
                    {input.loanTenorMonths} mos ({(input.loanTenorMonths / 12).toFixed(1)} yrs)
                  </span>
                </div>
                <input
                  id={tenureSliderId}
                  type="range"
                  min="6"
                  max="360"
                  step="6"
                  value={input.loanTenorMonths}
                  onChange={(e) => setInput({ ...input, loanTenorMonths: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex gap-1.5 mt-2">
                  {[12, 36, 60, 120, 240, 360].map((m) => (
                    <button
                      key={m}
                      onClick={() => setInput({ ...input, loanTenorMonths: m })}
                      className={`text-[10px] px-2 py-1 rounded font-mono transition-colors ${
                        input.loanTenorMonths === m
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m / 12}y
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label htmlFor={interestRateSliderId} className="text-slate-300 font-medium">Annual Interest Rate</label>
                  <span className="text-slate-200 font-mono font-medium">
                    {formatPercent(input.interestRateAnnual, 2)}
                  </span>
                </div>
                <input
                  id={interestRateSliderId}
                  type="range"
                  min="3"
                  max="24"
                  step="0.25"
                  value={input.interestRateAnnual}
                  onChange={(e) => setInput({ ...input, interestRateAnnual: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex gap-1.5 mt-2">
                  {[6.5, 8.5, 10.5, 12.0, 15.0].map((r) => (
                    <button
                      key={r}
                      onClick={() => setInput({ ...input, interestRateAnnual: r })}
                      className={`text-[10px] px-2 py-1 rounded font-mono transition-colors ${
                        input.interestRateAnnual === r
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Credit Score Slider */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={creditScoreSliderId} className="text-slate-300 font-medium">Credit Score (Bureau Tier)</label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold ${
                      input.creditScore >= 750
                        ? 'text-emerald-400'
                        : input.creditScore >= 670
                        ? 'text-cyan-400'
                        : input.creditScore >= 580
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {input.creditScore} ·{' '}
                    {input.creditScore >= 750
                      ? 'Prime'
                      : input.creditScore >= 670
                      ? 'Good'
                      : input.creditScore >= 580
                      ? 'Fair'
                      : 'Subprime'}
                  </span>
                </div>
              </div>
              <input
                id={creditScoreSliderId}
                type="range"
                min="300"
                max="900"
                step="5"
                value={input.creditScore}
                onChange={(e) => setInput({ ...input, creditScore: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Employment and Purpose Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Employment Type</label>
                <select
                  value={input.employmentType}
                  onChange={(e) => setInput({ ...input, employmentType: e.target.value as any })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Salaried">Salaried (Corporate / Govt)</option>
                  <option value="Self-Employed">Self-Employed Professional</option>
                  <option value="Business Owner">Business Owner / Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Loan Category / Purpose</label>
                <select
                  value={input.loanPurpose}
                  onChange={(e) => setInput({ ...input, loanPurpose: e.target.value as any })}
                  className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Home / Mortgage">Home Loan / Mortgage</option>
                  <option value="Personal">Personal Unsecured Loan</option>
                  <option value="Auto / Vehicle">Auto / Vehicle Finance</option>
                  <option value="Business Expansion">Business Working Capital</option>
                  <option value="Education">Higher Education Loan</option>
                </select>
              </div>
            </div>

            {/* Additional Risk Mitigants */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label htmlFor={coApplicantId} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  id={coApplicantId}
                  type="checkbox"
                  checked={input.hasCoApplicant}
                  onChange={(e) => setInput({ ...input, hasCoApplicant: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Co-Applicant with Secondary Income</span>
                </span>
              </label>

              <label htmlFor={collateralId} className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  id={collateralId}
                  type="checkbox"
                  checked={input.hasCollateral}
                  onChange={(e) => setInput({ ...input, hasCollateral: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Property / Asset Collateral Backed</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Banking Metrics & Rule Diagnostics */}
        <div className="lg:col-span-5 space-y-5">
          {/* Institutional Metric Gauges */}
          <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-5">
            <h3 className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>Underwriting Assessment</span>
              <span className="text-xs text-slate-400 font-mono">Real-time Model</span>
            </h3>

            {/* Big FOIR Ratio Meter */}
            <div className="p-4 rounded-lg bg-slate-900/60 border border-white/[0.06] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Debt-to-Income / FOIR Ratio</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    foirPercent <= 40
                      ? 'text-emerald-400'
                      : foirPercent <= 50
                      ? 'text-cyan-400'
                      : foirPercent <= 60
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {foirPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(100, foirPercent)}%` }}
                  className={`h-full transition-all duration-300 ${
                    foirPercent <= 40
                      ? 'bg-emerald-500'
                      : foirPercent <= 50
                      ? 'bg-cyan-500'
                      : foirPercent <= 60
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Safe &lt;40%</span>
                <span className="text-cyan-300">Bank Cap 50%</span>
                <span>Exceeded &gt;50%</span>
              </div>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-white/[0.05]">
                <div className="text-[11px] text-slate-400 mb-0.5">Proposed Monthly EMI</div>
                <div className="text-lg font-bold font-mono text-white tabular-nums">
                  {formatCurrency(proposedEmi, currency)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  @ {input.interestRateAnnual}% for {input.loanTenorMonths}m
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-white/[0.05]">
                <div className="text-[11px] text-slate-400 mb-0.5">Max Sanction Ceiling</div>
                <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                  {formatCurrency(maxEligibleLoan, currency)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Standard 50% FOIR cap
                </div>
              </div>
            </div>

            {/* Total Financial Commitment Breakdown */}
            <div className="space-y-2 text-xs border-t border-white/[0.06] pt-3 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Monthly Debt Service</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {formatCurrency(totalMonthlyDebt, currency)} / mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net Uncommitted Free Surplus</span>
                <span
                  className={`font-mono tabular-nums ${
                    input.monthlyIncome - totalMonthlyDebt > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(Math.max(0, input.monthlyIncome - totalMonthlyDebt), currency)} / mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Principal + Interest Outgo</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {formatCurrency(proposedEmi * input.loanTenorMonths, currency)}
                </span>
              </div>
            </div>

            {/* Instant Baseline Status */}
            <div
              className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                isEligibleRuleBased
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              }`}
            >
              {isEligibleRuleBased ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs">
                <div className="font-semibold text-slate-100">
                  {isEligibleRuleBased ? 'Institutional Rule Check: Eligible' : 'Rule Check: Restructuring Recommended'}
                </div>
                <div className="text-slate-300 mt-0.5 leading-relaxed">
                  {isEligibleRuleBased
                    ? `Your aggregate debt commitment is within the 50% limit and your credit score (${input.creditScore}) qualifies for standard bank approval.`
                    : foirPercent > 50
                    ? `Your proposed debt obligations (${foirPercent}%) exceed the standard 50% income ceiling. Consider extending tenure or reducing the requested principal.`
                    : `Credit score (${input.creditScore}) is below prime underwriting tier (650+). Higher interest margins may apply.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Detailed Assessment Card (When executed or loading) */}
      {loadingAi && (
        <div className="glass-panel p-8 rounded-xl text-center space-y-4 border border-cyan-500/20">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h4 className="text-base font-semibold text-white">Synthesizing Institutional Underwriting File...</h4>
            <p className="text-xs text-slate-400 mt-1">
              Evaluating credit risk vectors, FOIR headroom, tenor stress tests, and co-applicant buffers with Gemini AI.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {aiAssessment && !loadingAi && (
        <div className="glass-panel p-6 sm:p-7 rounded-xl space-y-6 border border-cyan-500/20">
          {/* Header of AI Analysis */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  aiAssessment.verdict === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : aiAssessment.verdict === 'CONDITIONALLY_APPROVED'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {aiAssessment.verdict === 'APPROVED' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : aiAssessment.verdict === 'CONDITIONALLY_APPROVED' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white tracking-tight">
                    {aiAssessment.verdict === 'APPROVED'
                      ? 'Sanction Recommendation: Approved'
                      : aiAssessment.verdict === 'CONDITIONALLY_APPROVED'
                      ? 'Sanction Recommendation: Conditional Approval'
                      : 'Sanction Recommendation: High Risk / Restructure'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span>Risk Classification: {aiAssessment.riskTier}</span>
                  <span aria-hidden="true">·</span>
                  <span>Approval Probability: {aiAssessment.approvalProbability}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Institutional Confidence</div>
                <div className="text-base font-bold font-mono text-cyan-400">
                  {aiAssessment.approvalProbability}%
                </div>
              </div>
            </div>
          </div>

          {/* Underwriter Executive Summary */}
          <div className="p-4 rounded-lg bg-slate-900/60 border border-white/[0.05]">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-1">
              Underwriting Officer Summary
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {aiAssessment.underwriterSummary}
            </p>
          </div>

          {/* Strengths & Vulnerabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 uppercase font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Credit Strengths</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {aiAssessment.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-2">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 uppercase font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>Underwriting Concerns / Red Flags</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {aiAssessment.vulnerabilities.map((vuln, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Action Items */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Action Plan to Accelerate Sanction
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiAssessment.recommendedActionItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-900/50 border border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-100">{item.title}</span>
                    <span className="text-[11px] font-mono text-cyan-400">{item.impact} Impact</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Optimal Loan Structure & Bank Negotiation Tip */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider font-mono">
                Recommended Loan Architecture
              </span>
              <span className="text-xs text-slate-400">Institutional Structuring</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400">Target Sanction:</span>{' '}
                <span className="font-mono text-white font-semibold">
                  {formatCurrency(aiAssessment.optimalLoanStructure.recommendedAmount, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Tenure:</span>{' '}
                <span className="font-mono text-white font-semibold">
                  {aiAssessment.optimalLoanStructure.recommendedTenureMonths} months
                </span>
              </div>
              <div>
                <span className="text-slate-400">Target EMI:</span>{' '}
                <span className="font-mono text-white font-semibold">
                  {formatCurrency(aiAssessment.optimalLoanStructure.targetEmi, currency)} / mo
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-300 pt-2 border-t border-white/[0.05]">
              <span className="text-cyan-400 font-semibold">Negotiation Strategy: </span>
              {aiAssessment.optimalLoanStructure.negotiationTip}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
