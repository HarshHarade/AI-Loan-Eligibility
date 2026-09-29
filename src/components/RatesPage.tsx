import React, { useState } from 'react';
import { Currency } from '../types/finance';
import { formatCurrency, calculateEmi } from '../utils/financeMath';
import {
  TrendingDown,
  Info,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface RatesPageProps {
  currency: Currency;
  onNavigateToTool: (tool: 'eligibility' | 'credit' | 'emi') => void;
}

interface BenchmarkCategory {
  category: string;
  nationalAverage: number;
  tiers: {
    exceptional: { apr: number; approvalOdds: string };
    prime: { apr: number; approvalOdds: string };
    standard: { apr: number; approvalOdds: string };
    subprime: { apr: number; approvalOdds: string };
  };
  recommendedTenorMonths: number;
  typicalAmount: number;
}

const LENDING_BENCHMARKS: BenchmarkCategory[] = [
  {
    category: '30-Year Fixed Residential Mortgage',
    nationalAverage: 6.85,
    recommendedTenorMonths: 360,
    typicalAmount: 350000,
    tiers: {
      exceptional: { apr: 6.15, approvalOdds: 'Guaranteed Prime' },
      prime: { apr: 6.55, approvalOdds: 'High' },
      standard: { apr: 7.15, approvalOdds: 'Moderate' },
      subprime: { apr: 8.45, approvalOdds: 'Conditional / High PMI' },
    },
  },
  {
    category: '15-Year Fixed Residential Mortgage',
    nationalAverage: 6.10,
    recommendedTenorMonths: 180,
    typicalAmount: 280000,
    tiers: {
      exceptional: { apr: 5.45, approvalOdds: 'Guaranteed Prime' },
      prime: { apr: 5.85, approvalOdds: 'High' },
      standard: { apr: 6.40, approvalOdds: 'Moderate' },
      subprime: { apr: 7.60, approvalOdds: 'Conditional' },
    },
  },
  {
    category: '60-Month New Vehicle Auto Loan',
    nationalAverage: 7.20,
    recommendedTenorMonths: 60,
    typicalAmount: 38000,
    tiers: {
      exceptional: { apr: 5.25, approvalOdds: 'Guaranteed Prime' },
      prime: { apr: 6.45, approvalOdds: 'High' },
      standard: { apr: 8.85, approvalOdds: 'Moderate' },
      subprime: { apr: 14.20, approvalOdds: 'Elevated Down Payment' },
    },
  },
  {
    category: '36-Month Unsecured Personal Loan',
    nationalAverage: 11.80,
    recommendedTenorMonths: 36,
    typicalAmount: 20000,
    tiers: {
      exceptional: { apr: 7.99, approvalOdds: 'Guaranteed Prime' },
      prime: { apr: 10.45, approvalOdds: 'High' },
      standard: { apr: 14.80, approvalOdds: 'Moderate' },
      subprime: { apr: 22.50, approvalOdds: 'High Risk / Co-signer' },
    },
  },
  {
    category: 'Commercial & Small Business Term Loan',
    nationalAverage: 9.40,
    recommendedTenorMonths: 84,
    typicalAmount: 150000,
    tiers: {
      exceptional: { apr: 7.20, approvalOdds: 'Guaranteed Prime' },
      prime: { apr: 8.75, approvalOdds: 'High' },
      standard: { apr: 11.50, approvalOdds: 'Collateral Required' },
      subprime: { apr: 16.80, approvalOdds: 'SBA Guarantee Only' },
    },
  },
];

export const RatesPage: React.FC<RatesPageProps> = ({
  currency,
  onNavigateToTool,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BenchmarkCategory>(LENDING_BENCHMARKS[0]);
  const [sampleAmount, setSampleAmount] = useState<number>(selectedCategory.typicalAmount);

  // Compute interest spread between Exceptional (800+) and Subprime (580-669)
  const exceptionalEmi = calculateEmi(sampleAmount, selectedCategory.tiers.exceptional.apr, selectedCategory.recommendedTenorMonths);
  const subprimeEmi = calculateEmi(sampleAmount, selectedCategory.tiers.subprime.apr, selectedCategory.recommendedTenorMonths);

  const exceptionalTotal = exceptionalEmi * selectedCategory.recommendedTenorMonths;
  const subprimeTotal = subprimeEmi * selectedCategory.recommendedTenorMonths;
  const lifetimeInterestDiff = Math.max(0, subprimeTotal - exceptionalTotal);

  return (
    <div className="space-y-10 py-4">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <span>BFSI Institutional Market Intel</span>
          <span aria-hidden="true">·</span>
          <span>Interbank Lending Rates</span>
          <span aria-hidden="true">·</span>
          <span>Updated March 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Current Loan Rates &amp; Credit Spread Benchmarks
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Compare commercial bank lending rates across credit bureau score tiers. Discover the exact quantitative cost of a lower credit score and where institutional interest spreads widen.
        </p>
      </div>

      {/* Main Table: All Categories by Tier */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            2026 National Lending APR Benchmarks by Bureau Tier
          </h2>
          <span className="text-xs text-slate-400 font-mono">SOFR + Spread Benchmarks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Loan Instrument</th>
                <th className="py-3 px-4 text-emerald-400">Tier 1 (800+)</th>
                <th className="py-3 px-4 text-cyan-400">Tier 2 (740–799)</th>
                <th className="py-3 px-4 text-blue-400">Tier 3 (670–739)</th>
                <th className="py-3 px-4 text-amber-400">Tier 4 (580–669)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {LENDING_BENCHMARKS.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(item);
                    setSampleAmount(item.typicalAmount);
                  }}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory.category === item.category
                      ? 'bg-cyan-950/30'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    <div>{item.category}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      National Avg: {item.nationalAverage}% p.a.
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {item.tiers.exceptional.apr}%
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-cyan-300">
                    {item.tiers.prime.apr}%
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {item.tiers.standard.apr}%
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-400 font-medium">
                    {item.tiers.subprime.apr}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Credit Spread Cost Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl space-y-6 border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              The Real Cost of Credit
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Tier 1 (800+) vs. Subprime (580–669) Spread Analysis
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Evaluating: <strong className="text-white">{selectedCategory.category}</strong>
            </p>
          </div>

          <div className="text-right sm:self-center">
            <div className="text-[11px] text-slate-400">Total Interest Difference</div>
            <div className="text-2xl font-black font-mono text-rose-400">
              +{formatCurrency(lifetimeInterestDiff, currency)}
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Loan Type
            </label>
            <select
              value={selectedCategory.category}
              onChange={(e) => {
                const found = LENDING_BENCHMARKS.find((b) => b.category === e.target.value)!;
                setSelectedCategory(found);
                setSampleAmount(found.typicalAmount);
              }}
              className="w-full glass-input rounded-lg px-3 py-2 text-xs"
            >
              {LENDING_BENCHMARKS.map((b) => (
                <option key={b.category} value={b.category}>
                  {b.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Loan Amount ({currency})
            </label>
            <input
              type="number"
              value={sampleAmount}
              onChange={(e) => setSampleAmount(Math.max(1000, Number(e.target.value)))}
              className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
            />
          </div>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Exceptional */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono uppercase">
                Tier 1 (Exceptional 800+)
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {selectedCategory.tiers.exceptional.apr}% APR
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
              {formatCurrency(exceptionalEmi, currency)} <span className="text-xs font-normal text-slate-400">/ mo</span>
            </div>
            <div className="text-xs text-slate-300 border-t border-white/[0.04] pt-2">
              Total Lifetime Interest:{' '}
              <strong className="text-white font-mono">
                {formatCurrency(exceptionalTotal - sampleAmount, currency)}
              </strong>
            </div>
          </div>

          {/* Subprime */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase">
                Tier 4 (Subprime 580–669)
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {selectedCategory.tiers.subprime.apr}% APR
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-rose-400 tabular-nums">
              {formatCurrency(subprimeEmi, currency)} <span className="text-xs font-normal text-slate-400">/ mo</span>
            </div>
            <div className="text-xs text-slate-300 border-t border-white/[0.04] pt-2">
              Total Lifetime Interest:{' '}
              <strong className="text-rose-300 font-mono">
                {formatCurrency(subprimeTotal - sampleAmount, currency)}
              </strong>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            Boosting your score from 650 to 750 can save you thousands in avoided interest penalties.
          </span>
          <button
            onClick={() => onNavigateToTool('credit')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Launch Credit Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
