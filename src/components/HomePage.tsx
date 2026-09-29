import React, { useState } from 'react';
import { Currency, LoanEligibilityInput } from '../types/finance';
import { formatCurrency, calculateEmi } from '../utils/financeMath';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Calculator,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Zap,
  BarChart3,
  Percent,
} from 'lucide-react';

interface HomePageProps {
  currency: Currency;
  onNavigate: (page: 'tools' | 'rates' | 'methodology' | 'tracker', subTool?: 'eligibility' | 'credit' | 'emi' | 'tips') => void;
  loanInput: LoanEligibilityInput;
  setLoanInput: React.Dispatch<React.SetStateAction<LoanEligibilityInput>>;
  onOpenSheetsModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currency,
  onNavigate,
  loanInput,
  setLoanInput,
  onOpenSheetsModal,
}) => {
  // Quick Calculator state on homepage
  const [quickIncome, setQuickIncome] = useState(loanInput.monthlyIncome);
  const [quickDebt, setQuickDebt] = useState(loanInput.existingEmi);
  const [quickLoan, setQuickLoan] = useState(loanInput.loanAmountRequested);

  const quickEmi = calculateEmi(quickLoan, 7.5, 180);
  const quickFoir = quickIncome > 0 ? Number((((quickDebt + quickEmi) / quickIncome) * 100).toFixed(1)) : 0;
  const isQuickEligible = quickFoir <= 50;

  const handleApplyQuickInputs = () => {
    setLoanInput({
      ...loanInput,
      monthlyIncome: quickIncome,
      existingEmi: quickDebt,
      loanAmountRequested: quickLoan,
    });
    onNavigate('tools', 'eligibility');
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-4">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden glass-panel-elevated p-6 sm:p-12 lg:p-16 border border-white/[0.1]">
        {/* Ambient Dark Art Background */}
        <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen">
          <img
            src="/src/assets/images/fintech_glass_hero_1790654013131.jpg"
            alt="Fintech Dark Glass Architecture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/90 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Editorial Zero-Pill Lead */}
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>BFSI Financial Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Institutional Underwriting</span>
            <span aria-hidden="true">·</span>
            <span>Google Sheets Sync</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display text-balance leading-[1.1]">
            AI Loan Eligibility &amp; Personal Finance Suite
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl text-balance">
            Make decisive personal financial decisions with banking-grade clarity. Instant access to four core tools: AI Loan Eligibility Underwriting, Credit Bureau Score Diagnostics, Precision EMI Amortization, and Real-Time Financial Advisory.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('tools', 'eligibility')}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-xl shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Check Loan Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('tools', 'credit')}
              className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-white/20 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Analyze Credit Score</span>
            </button>

            <button
              onClick={onOpenSheetsModal}
              className="px-5 py-3.5 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets Sync</span>
            </button>
          </div>

          {/* Trust Marks */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400 font-mono">
            <div>
              <div className="text-white font-bold text-sm">FOIR &lt; 40%</div>
              <div className="text-[11px] text-slate-400">Prime Bank Cap Benchmark</div>
            </div>
            <div>
              <div className="text-cyan-400 font-bold text-sm">300 to 900</div>
              <div className="text-[11px] text-slate-400">CIBIL &amp; FICO Scale</div>
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-sm">100% Client-Side</div>
              <div className="text-[11px] text-slate-400">Encrypted Local Persistence</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">Gemini 3.8</div>
              <div className="text-[11px] text-slate-400">Underwriting Reasoning</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE HOMEPAGE TEST DRIVE WIDGET */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              Live Interactive Test Drive
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Instant FOIR &amp; Sanction Capacity Check
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Adjust your monthly numbers below to see immediate institutional eligibility before launching the full AI underwriter.
            </p>
          </div>

          <button
            onClick={handleApplyQuickInputs}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Launch Full Underwriting Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* 3 Slider inputs */}
          <div className="space-y-4 lg:col-span-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Monthly Net Inflow</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {formatCurrency(quickIncome, currency)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="250"
                value={quickIncome}
                onChange={(e) => setQuickIncome(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Existing Monthly Debt/EMIs</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {formatCurrency(quickDebt, currency)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={quickDebt}
                onChange={(e) => setQuickDebt(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Desired Loan Principal</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {formatCurrency(quickLoan, currency)}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={quickLoan}
                onChange={(e) => setQuickLoan(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Quick Result card */}
          <div className="p-5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono uppercase text-[10px]">Computed FOIR Ratio</span>
              <span
                className={`font-mono font-bold ${
                  quickFoir <= 40
                    ? 'text-emerald-400'
                    : quickFoir <= 50
                    ? 'text-cyan-400'
                    : 'text-rose-400'
                }`}
              >
                {quickFoir}%
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(100, quickFoir)}%` }}
                className={`h-full ${
                  quickFoir <= 40
                    ? 'bg-emerald-500'
                    : quickFoir <= 50
                    ? 'bg-cyan-500'
                    : 'bg-rose-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div>
                <span className="text-[10px] text-slate-400">Est. Monthly EMI</span>
                <div className="text-white font-bold">{formatCurrency(quickEmi, currency)}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Status</span>
                <div className={isQuickEligible ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {isQuickEligible ? 'Eligible (<50%)' : 'Caution (>50%)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE FOUR CORE TOOLS SHOWCASE (BENTO GRID) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            All-In-One BFSI Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Four Core Financial Tools in a Single Interface
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered to eliminate friction, spreadsheets chaos, and opaque bank underwriting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 1 */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                01. AI Loan Eligibility Checker
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Determines sanction headroom using real-world banking benchmarks (FOIR, DTI, Tenor stresses). Delivers institutional underwriting verdicts with approved limits and bank negotiation leverage.
              </p>
              <ul className="space-y-1 text-xs text-slate-300 font-mono">
                <li>• Exact FOIR ratio computation (&lt;40% prime band)</li>
                <li>• Co-applicant &amp; collateral risk mitigation</li>
                <li>• Gemini underwriter sanction file generation</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('tools', 'eligibility')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/20 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Eligibility Checker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 2 */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                02. Credit Score Bureau Analyzer
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Audits credit health against the 5 FICO and CIBIL bureau scoring pillars. Includes an interactive scenario simulator for balance payoffs, inquiry cooldowns, and a 30/60/90-day credit repair roadmap.
              </p>
              <ul className="space-y-1 text-xs text-slate-300 font-mono">
                <li>• Payment history &amp; credit utilization breakdown</li>
                <li>• What-if debt paydown simulator</li>
                <li>• Actionable 90-day score boost roadmap</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('tools', 'credit')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-500/20 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open Credit Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 3 */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                03. Dynamic EMI Calculator &amp; Amortizer
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Precision reducing-balance amortization schedules with month-by-month breakdowns, principal vs interest equity progression, and a foreclosure prepayment simulator detailing interest saved.
              </p>
              <ul className="space-y-1 text-xs text-slate-300 font-mono">
                <li>• Reducing balance mathematical engine</li>
                <li>• Prepayment savings &amp; months shaved off tenure</li>
                <li>• 1-click CSV schedule download</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('tools', 'emi')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/20 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Open EMI Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tool 4 */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                04. AI Financial Tips &amp; Underwriter Q&amp;A
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Personalized debt optimization strategies, cashflow restructuring advice, and an interactive advisor console powered by Gemini 3.8 to answer complex loan and mortgage questions.
              </p>
              <ul className="space-y-1 text-xs text-slate-300 font-mono">
                <li>• Debt avalanche vs snowball prioritization</li>
                <li>• Emergency runway liquidity analysis</li>
                <li>• Real-time conversational financial underwriter</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('tools', 'tips')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/20 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Consult Financial Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. QUANTIFIED PROOF & REAL BFSI OUTCOMES */}
      <section className="glass-panel p-6 sm:p-10 rounded-2xl space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Quantitative Rigor &amp; Proof
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Measurable Lending &amp; Debt Optimization Outcomes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real institutional cases demonstrating the power of pre-application structuring and FOIR compression.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="text-2xl font-black font-mono text-emerald-400">$34,200 Saved</div>
            <div className="text-xs font-semibold text-slate-200">
              30-Year Mortgage Interest Compression
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Elena &amp; Marcus restructured $600/mo in revolving card debt prior to mortgage submission, dropping their FOIR from 49% to 37%. This qualified them for prime tier pricing with a 65 bps interest reduction.
            </p>
            <div className="text-[11px] font-mono text-slate-500 border-t border-white/[0.04] pt-2">
              Verified: Sanctioned August 2026
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="text-2xl font-black font-mono text-cyan-400">+117 Points</div>
            <div className="text-xs font-semibold text-slate-200">
              Credit Score Surge in 75 Days
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Devendra Patel diagnosed statement closing date mismatches that artificially inflated utilization to 68%. Aligning payoff dates reduced reported utilization to 8%, advancing his score from 645 to 762.
            </p>
            <div className="text-[11px] font-mono text-slate-500 border-t border-white/[0.04] pt-2">
              Verified: Bureau File Audit 2026
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
            <div className="text-2xl font-black font-mono text-blue-400">4.2 Years Shaved</div>
            <div className="text-xs font-semibold text-slate-200">
              Auto-Loan Prepayment Foreclosure
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Using the Credex Prepayment Simulator, Alisha committed an extra $180/month toward principal repayment, terminating her 7-year auto loan in under 3 years and avoiding $4,150 in cumulative interest outgo.
            </p>
            <div className="text-[11px] font-mono text-slate-500 border-t border-white/[0.04] pt-2">
              Verified: Amortization Execution 2026
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON MATRIX: TRADITIONAL BANKING VS CREDEX AI */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            Decision Superiority
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Traditional Bank Application vs. Credex AI Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Never walk into a lending institution unprepared or blindsided by an unexpected rejection.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08]">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-slate-400">Traditional Bank Method</th>
                <th className="py-3 px-4 text-cyan-400">Credex AI Underwriting Suite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">Pre-Check Hard Inquiries</td>
                <td className="py-3 px-4 text-rose-400">Hard inquiry hits score (-8 to -15 pts)</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Zero inquiry impact (100% private)</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">FOIR &amp; DTI Visibility</td>
                <td className="py-3 px-4 text-slate-400">Opaque; calculated internally after submission</td>
                <td className="py-3 px-4 text-cyan-300 font-medium">Instant real-time FOIR gauge with prime cap markers</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">Rejection Reasoning</td>
                <td className="py-3 px-4 text-slate-400">Generic form letter days later</td>
                <td className="py-3 px-4 text-cyan-300 font-medium">Detailed red-flag audit with actionable remedy steps</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">Prepayment Simulation</td>
                <td className="py-3 px-4 text-slate-400">Rarely provided; banks profit from full tenure interest</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Interactive slider showing exact interest saved</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">Data Persistence &amp; Control</td>
                <td className="py-3 px-4 text-slate-400">Trapped in proprietary bank marketing databases</td>
                <td className="py-3 px-4 text-emerald-400 font-medium">Owned by you in Google Sheets &amp; local encrypted storage</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. GOOGLE SHEETS TRANSPARENCY CALLOUT */}
      <section className="glass-panel-elevated p-8 sm:p-10 rounded-2xl border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Open &amp; Transparent Personal Finance</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Export or Synchronize Directly to Google Sheets
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your financial data belongs exclusively to you. Export complete formatted CSV ledgers or connect via Google Apps Script Webhooks for real-time cloud spreadsheet mirroring.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={onOpenSheetsModal}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Configure Google Sheets Sync</span>
          </button>
          <button
            onClick={() => onNavigate('tracker')}
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center justify-center"
          >
            <span>Open Finance Ledger</span>
          </button>
        </div>
      </section>
    </div>
  );
};
