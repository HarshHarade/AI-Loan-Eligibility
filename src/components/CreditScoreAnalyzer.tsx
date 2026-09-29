import React, { useState, useId } from 'react';
import { Currency, CreditBureauProfile, AiCreditDiagnosis } from '../types/finance';
import { formatCurrency } from '../utils/financeMath';
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Clock,
  PieChart,
  Calendar,
  CheckCircle,
  MinusCircle,
} from 'lucide-react';

interface CreditScoreAnalyzerProps {
  currency: Currency;
  creditProfile: CreditBureauProfile;
  setCreditProfile: React.Dispatch<React.SetStateAction<CreditBureauProfile>>;
}

export const CreditScoreAnalyzer: React.FC<CreditScoreAnalyzerProps> = ({
  currency,
  creditProfile,
  setCreditProfile,
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<AiCreditDiagnosis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate unique IDs for accessibility
  const scoreSliderId = useId();
  const paymentSliderId = useId();
  const limitInputId = useId();
  const balanceInputId = useId();
  const historySliderId = useId();
  const inquiriesSliderId = useId();

  // Simulation controls state
  const [simulatedPayoff, setSimulatedPayoff] = useState<number>(0);
  const [simulatedMissedPayment, setSimulatedMissedPayment] = useState<boolean>(false);
  const [simulatedNewInquiries, setSimulatedNewInquiries] = useState<number>(0);
  const [simulatedLimitIncrease, setSimulatedLimitIncrease] = useState<number>(0);

  // Derived calculations
  const effectiveLimit = creditProfile.totalCreditLimit + simulatedLimitIncrease;
  const effectiveBalance = Math.max(0, creditProfile.totalCurrentBalance - simulatedPayoff);
  const calculatedUtilization = effectiveLimit > 0
    ? Number(((effectiveBalance / effectiveLimit) * 100).toFixed(1))
    : 0;

  // Simulator projected score delta
  let scoreDelta = 0;
  // Utilization improvement
  const baseUtilization = creditProfile.totalCreditLimit > 0
    ? (creditProfile.totalCurrentBalance / creditProfile.totalCreditLimit) * 100
    : 30;
  const utilDiff = baseUtilization - calculatedUtilization;
  if (utilDiff > 0) {
    scoreDelta += Math.round(utilDiff * 0.9);
  }

  // Missed payment severe penalty
  if (simulatedMissedPayment) {
    scoreDelta -= 75;
  }

  // Hard inquiries penalty
  if (simulatedNewInquiries > 0) {
    scoreDelta -= simulatedNewInquiries * 8;
  }

  const simulatedScore = Math.min(900, Math.max(300, creditProfile.creditScore + scoreDelta));

  const getScoreTier = (score: number) => {
    if (score >= 800) return { label: 'Exceptional (Tier 1)', color: 'text-emerald-400', stroke: '#10B981' };
    if (score >= 740) return { label: 'Very Good (Prime)', color: 'text-cyan-400', stroke: '#06B6D4' };
    if (score >= 670) return { label: 'Good (Standard)', color: 'text-blue-400', stroke: '#3B82F6' };
    if (score >= 580) return { label: 'Fair (Subprime)', color: 'text-amber-400', stroke: '#F59E0B' };
    return { label: 'Poor (High Risk)', color: 'text-rose-400', stroke: '#EF4444' };
  };

  const currentTier = getScoreTier(simulatedScore);

  const handleRunAiDiagnosis = async () => {
    setLoadingAi(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/analyze-credit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditScore: simulatedScore,
          paymentHistoryScore: creditProfile.paymentHistoryScore,
          creditUtilization: calculatedUtilization,
          averageAccountAgeYears: creditProfile.averageAccountAgeYears,
          hardInquiriesLast6Months: creditProfile.hardInquiriesLast6Months + simulatedNewInquiries,
          totalCreditLimit: effectiveLimit,
          totalCurrentBalance: effectiveBalance,
        }),
      });

      if (!res.ok) {
        throw new Error(`Credit diagnosis server returned code ${res.status}`);
      }

      const data = await res.json();
      setAiDiagnosis(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to connect to Credit AI service');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Bureau Scoring Simulator</span>
            <span aria-hidden="true">·</span>
            <span>FICO / CIBIL Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Pillar Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Credit Score Bureau Analyzer
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Audit your credit health across the 5 bureau pillars. Simulate how paying down balances, requesting limit hikes, or avoiding late marks impacts your rate.
          </p>
        </div>

        <button
          onClick={handleRunAiDiagnosis}
          disabled={loadingAi}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          <span>{loadingAi ? 'Analyzing Bureau Record...' : 'Run Bureau AI Diagnostics'}</span>
        </button>
      </div>

      {/* Main Bureau Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Gauge & 5 Pillars (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Bureau Score Overview & SVG Arc */}
          <div className="glass-panel p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider font-mono text-slate-400">
                Official Bureau Standing
              </div>
              <div className="flex items-baseline gap-3 justify-center sm:justify-start">
                <span className="text-5xl font-black font-mono text-white tracking-tight tabular-nums">
                  {simulatedScore}
                </span>
                <span className="text-sm text-slate-400 font-mono">/ 900</span>
              </div>
              <div className={`text-sm font-semibold font-mono ${currentTier.color}`}>
                {currentTier.label}
              </div>
              {scoreDelta !== 0 && (
                <div className="text-xs font-mono">
                  Simulation Delta:{' '}
                  <span className={scoreDelta > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} points
                  </span>
                </div>
              )}
            </div>

            {/* Score Radial Visual */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke={currentTier.stroke}
                  strokeWidth="8"
                  strokeDasharray="301"
                  strokeDashoffset={301 - (301 * ((simulatedScore - 300) / 600))}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 font-mono">Tier Score</span>
                <span className="text-lg font-bold font-mono text-white">{simulatedScore}</span>
              </div>
            </div>
          </div>

          {/* Interactive Credit Report Inputs */}
          <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-5">
            <h3 className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>Bureau Metric Calibration</span>
              <span className="text-xs text-slate-400 font-mono">Base Profile</span>
            </h3>

            {/* Score Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={scoreSliderId} className="text-slate-300 font-medium">Base Bureau Score</label>
                <span className="font-mono text-cyan-400 font-semibold">{creditProfile.creditScore}</span>
              </div>
              <input
                id={scoreSliderId}
                type="range"
                min="300"
                max="900"
                step="5"
                value={creditProfile.creditScore}
                onChange={(e) => setCreditProfile({ ...creditProfile, creditScore: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>300 (Poor)</span>
                <span>650 (Prime Entry)</span>
                <span>900 (Perfect)</span>
              </div>
            </div>

            {/* Payment History */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label htmlFor={paymentSliderId} className="text-slate-300 font-medium">On-Time Repayment Track Record</label>
                <span className="font-mono text-emerald-400 font-semibold">{creditProfile.paymentHistoryScore}%</span>
              </div>
              <input
                id={paymentSliderId}
                type="range"
                min="70"
                max="100"
                step="1"
                value={creditProfile.paymentHistoryScore}
                onChange={(e) => setCreditProfile({ ...creditProfile, paymentHistoryScore: Number(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Credit Limit & Balance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={limitInputId} className="block text-xs font-medium text-slate-300 mb-1.5">
                  Aggregate Credit Card Limit
                </label>
                <div className="relative">
                  <input
                    id={limitInputId}
                    type="number"
                    value={creditProfile.totalCreditLimit}
                    onChange={(e) => setCreditProfile({ ...creditProfile, totalCreditLimit: Math.max(100, Number(e.target.value)) })}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
                  />
                  <div className="absolute right-3 top-2 text-xs text-slate-400 font-mono">
                    {currency}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor={balanceInputId} className="block text-xs font-medium text-slate-300 mb-1.5">
                  Current Revolving Balance
                </label>
                <div className="relative">
                  <input
                    id={balanceInputId}
                    type="number"
                    value={creditProfile.totalCurrentBalance}
                    onChange={(e) => setCreditProfile({ ...creditProfile, totalCurrentBalance: Math.max(0, Number(e.target.value)) })}
                    className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
                  />
                  <div className="absolute right-3 top-2 text-xs text-slate-400 font-mono">
                    {currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Age & Inquiries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label htmlFor={historySliderId} className="text-slate-300 font-medium">Average Credit Age</label>
                  <span className="font-mono text-slate-200">{creditProfile.averageAccountAgeYears} years</span>
                </div>
                <input
                  id={historySliderId}
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={creditProfile.averageAccountAgeYears}
                  onChange={(e) => setCreditProfile({ ...creditProfile, averageAccountAgeYears: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label htmlFor={inquiriesSliderId} className="text-slate-300 font-medium">Hard Inquiries (Last 6 Mos)</label>
                  <span className="font-mono text-slate-200">{creditProfile.hardInquiriesLast6Months}</span>
                </div>
                <input
                  id={inquiriesSliderId}
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={creditProfile.hardInquiriesLast6Months}
                  onChange={(e) => setCreditProfile({ ...creditProfile, hardInquiriesLast6Months: Number(e.target.value) })}
                  className="w-full accent-slate-300 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: 5 Bureau Pillars & Interactive Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* The 5 Pillars Card */}
          <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-4">
            <h3 className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>The 5 Bureau Pillars</span>
              <span className="text-xs text-slate-400 font-mono">FICO Model</span>
            </h3>

            {/* Pillar 1: Payment History */}
            <div className="p-3 rounded-lg bg-slate-900/50 border border-white/[0.05] space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payment History (35% weight)</span>
                </span>
                <span className="font-mono text-emerald-400 font-medium">
                  {creditProfile.paymentHistoryScore}% On-time
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Single most influential pillar. Never miss a billing cycle cutoff.
              </p>
            </div>

            {/* Pillar 2: Credit Utilization */}
            <div className="p-3 rounded-lg bg-slate-900/50 border border-white/[0.05] space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Credit Utilization (30% weight)</span>
                </span>
                <span
                  className={`font-mono font-medium ${
                    calculatedUtilization <= 10
                      ? 'text-emerald-400'
                      : calculatedUtilization <= 30
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  }`}
                >
                  {calculatedUtilization}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, calculatedUtilization)}%` }}
                  className={`h-full ${
                    calculatedUtilization <= 30 ? 'bg-cyan-500' : 'bg-amber-500'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Optimal: &lt;10%</span>
                <span>Cap: 30%</span>
                <span>Used: {formatCurrency(effectiveBalance, currency)}</span>
              </div>
            </div>

            {/* Pillar 3: Length of Credit History */}
            <div className="p-3 rounded-lg bg-slate-900/50 border border-white/[0.05] space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Credit Age (15% weight)</span>
                </span>
                <span className="font-mono text-slate-300">
                  {creditProfile.averageAccountAgeYears} Years
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Keep oldest credit accounts open even if dormant to preserve longevity.
              </p>
            </div>

            {/* Pillar 4 & 5 */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-white/[0.04]">
                <div className="text-[10px] text-slate-400">Credit Mix (10%)</div>
                <div className="font-semibold text-slate-200 mt-0.5">Revolving + Loans</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/40 border border-white/[0.04]">
                <div className="text-[10px] text-slate-400">Recent Inquiries (10%)</div>
                <div className="font-semibold text-slate-200 mt-0.5">
                  {creditProfile.hardInquiriesLast6Months + simulatedNewInquiries} Hard Pulls
                </div>
              </div>
            </div>
          </div>

          {/* Interactive What-If Simulator Card */}
          <div className="glass-panel p-5 rounded-xl space-y-4 border border-cyan-500/20">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center justify-between">
              <span>Scenario Simulator ("What-If")</span>
              <span className="text-[11px] text-slate-400 font-mono">Real-time Impact</span>
            </h3>

            {/* What if I pay off debt */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300">Pay down credit card debt</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {formatCurrency(simulatedPayoff, currency)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={creditProfile.totalCurrentBalance || 5000}
                step="250"
                value={simulatedPayoff}
                onChange={(e) => setSimulatedPayoff(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* What if I get a limit increase */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300">Request credit limit increase</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  +{formatCurrency(simulatedLimitIncrease, currency)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20000"
                step="1000"
                value={simulatedLimitIncrease}
                onChange={(e) => setSimulatedLimitIncrease(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* What if I miss a payment or apply for 3 cards */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulatedMissedPayment}
                  onChange={(e) => setSimulatedMissedPayment(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500 w-4 h-4"
                />
                <span>Simulate 30-day Late Mark</span>
              </label>

              {simulatedMissedPayment && (
                <span className="text-xs font-mono text-rose-400 font-bold">-75 pts</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Bureau Diagnosis Report Card */}
      {loadingAi && (
        <div className="glass-panel p-8 rounded-xl text-center space-y-4 border border-cyan-500/20">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h4 className="text-base font-semibold text-white">Generating AI Bureau Factor Diagnosis...</h4>
            <p className="text-xs text-slate-400 mt-1">
              Cross-analyzing utilization tape cycles, inquiry vintage, and loan pricing tiers with Gemini AI.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {aiDiagnosis && !loadingAi && (
        <div className="glass-panel p-6 sm:p-7 rounded-xl space-y-6 border border-cyan-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                AI Bureau Risk Diagnosis
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Score Tier: {aiDiagnosis.scoreTier}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {aiDiagnosis.interestRateImpact}
              </p>
            </div>

            <div className="text-right sm:self-center">
              <div className="text-[11px] text-slate-400">90-Day Target Potential</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {aiDiagnosis.potentialScoreGain}
              </div>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Pillar Evaluation & Bureau Red Flags
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {aiDiagnosis.factorBreakdown.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-900/50 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{f.factor}</span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                        f.status === 'Good'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : f.status === 'Warning'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {f.status} · {f.impactWeight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 30 / 60 / 90 Day Improvement Roadmap */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Actionable Bureau Optimization Roadmap
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Day 30 */}
              <div className="p-4 rounded-lg bg-slate-900/60 border border-cyan-500/20 space-y-2">
                <div className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Day 1–30: Quick Wins</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {aiDiagnosis.roadmap.day30?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Day 60 */}
              <div className="p-4 rounded-lg bg-slate-900/60 border border-blue-500/20 space-y-2">
                <div className="text-xs font-bold text-blue-400 font-mono uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Day 31–60: Limit Expansion</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {aiDiagnosis.roadmap.day60?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-400">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Day 90 */}
              <div className="p-4 rounded-lg bg-slate-900/60 border border-emerald-500/20 space-y-2">
                <div className="text-xs font-bold text-emerald-400 font-mono uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Day 61–90: Prime Stabilization</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {aiDiagnosis.roadmap.day90?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
