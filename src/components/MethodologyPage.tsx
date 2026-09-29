import React from 'react';
import {
  Compass,
  CreditCard,
  Calculator,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

interface MethodologyPageProps {
  onNavigateToTool: (tool: 'eligibility' | 'credit' | 'emi' | 'tips') => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({
  onNavigateToTool,
}) => {
  return (
    <div className="space-y-12 py-4">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <span>Institutional Underwriting Science</span>
          <span aria-hidden="true">·</span>
          <span>BFSI Regulatory Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Deterministic Mathematics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Lending Methodology &amp; Mathematical Rigor
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          How commercial banking institutions and credit rating agencies evaluate debt capacity. Explore the exact formulas governing FOIR, amortization, and bureau scoring weights.
        </p>
      </div>

      {/* 4 Deep-Dive Methodology Cards */}
      <div className="space-y-8">
        {/* Pillar 1: FOIR */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                01. Fixed Obligation to Income Ratio (FOIR / DTI)
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Primary Measure of Repayment Solvency
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The Fixed Obligation to Income Ratio measures the percentage of an applicant's net take-home salary consumed by recurring debt commitments. Unlike raw income, FOIR evaluates post-obligation cashflow viability under economic stress.
          </p>

          {/* Formula Display Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-white/[0.08] font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
            <code>
              FOIR (%) = [ ( Existing Recurring EMIs + Proposed New Loan EMI ) / Net Verified Monthly Income ] × 100
            </code>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs">
              <div className="font-bold text-emerald-400 font-mono">Prime Band: &lt; 40%</div>
              <div className="text-slate-300 mt-1">Guaranteed access to top-tier benchmark interest rates and expedited processing.</div>
            </div>
            <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs">
              <div className="font-bold text-cyan-300 font-mono">Institutional Benchmark: 40%–50%</div>
              <div className="text-slate-300 mt-1">Standard commercial bank approval threshold. Minimal risk premium applied.</div>
            </div>
            <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs">
              <div className="font-bold text-rose-400 font-mono">High Risk / Rejection: &gt; 50%</div>
              <div className="text-slate-300 mt-1">Requires tenure extension, debt consolidation, or adding a secondary co-applicant.</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToTool('eligibility')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>Test your profile in the FOIR Underwriting Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Pillar 2: Credit Score Architecture */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                02. Credit Bureau Scoring Architecture (FICO &amp; CIBIL)
              </h2>
              <div className="text-xs font-mono text-slate-400">
                The 5 Mathematical Pillars of Consumer Credit
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Credit bureaus synthesize historical repayment tapes using strict regression models weighted across five objective dimensions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.06] space-y-1">
              <div className="font-bold text-emerald-400 font-mono text-sm">35% Weight</div>
              <div className="font-semibold text-white">Payment History</div>
              <div className="text-slate-400 text-[11px]">Track record of 0 days past due (DPD) across all active accounts.</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.06] space-y-1">
              <div className="font-bold text-cyan-400 font-mono text-sm">30% Weight</div>
              <div className="font-semibold text-white">Credit Utilization</div>
              <div className="text-slate-400 text-[11px]">Outstanding balance divided by total limit. Optimal threshold is &lt; 10%.</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.06] space-y-1">
              <div className="font-bold text-blue-400 font-mono text-sm">15% Weight</div>
              <div className="font-semibold text-white">Credit Age</div>
              <div className="text-slate-400 text-[11px]">Vintage of oldest active account and average maturity.</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.06] space-y-1">
              <div className="font-bold text-purple-400 font-mono text-sm">10% Weight</div>
              <div className="font-semibold text-white">Credit Diversity</div>
              <div className="text-slate-400 text-[11px]">Healthy mix of revolving credit cards and installment loans.</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-white/[0.06] space-y-1">
              <div className="font-bold text-amber-400 font-mono text-sm">10% Weight</div>
              <div className="font-semibold text-white">Inquiry Vintage</div>
              <div className="text-slate-400 text-[11px]">Number of hard pulls within the preceding 6 to 12 months.</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToTool('credit')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>Launch Bureau Analyzer &amp; 90-Day Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Pillar 3: Reducing-Balance Amortization */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                03. Reducing-Balance Amortization Dynamics
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Compound Monthly Rest Interest Calculation
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In standard commercial amortizing loans, monthly interest is calculated strictly on the opening reducing principal balance of each cycle, rather than the initial borrowed capital. Early tenure payments are heavily interest-weighted.
          </p>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-white/[0.08] font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto">
            <code>
              EMI = [ P × r × (1 + r)^n ] / [ (1 + r)^n - 1 ]
              <br />
              <span className="text-slate-400 text-[11px]">
                where P = Principal, r = Annual Rate / 12 / 100, n = Tenure in Months
              </span>
            </code>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToTool('emi')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>Open Precision Amortization Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Pillar 4: AI Underwriting Reasoning */}
        <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                04. Gemini 3.8 Risk Underwriting Reasoning
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Non-Linear Financial Risk Stress Tests
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            While rule engines evaluate strict numeric caps, Credex integrates Gemini 3.8 to simulate the analytical decision-making of a senior institutional credit officer. The model evaluates:
          </p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Cashflow Shock Absorbers:</strong> Tests whether disposable surplus survives unexpected cost-of-living or interest rate spikes.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Debt Restructuring Strategies:</strong> Recommends whether consolidating high-APR revolving cards or lengthening loan tenor yields a superior debt-service ratio.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Institutional Negotiation Leverage:</strong> Formulates specific concession requests (waived processing fees, zero prepayment penalty riders) based on profile strength.</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToTool('tips')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>Consult the Senior Underwriter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
