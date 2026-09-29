import React, { useState } from 'react';
import { Currency, AiTipsResponse } from '../types/finance';
import { formatCurrency, formatPercent } from '../utils/financeMath';
import {
  Sparkles,
  Send,
  MessageSquare,
  HelpCircle,
  PiggyBank,
  CheckCircle2,
  TrendingDown,
  Percent,
} from 'lucide-react';

interface AiFinancialTipsProps {
  currency: Currency;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingEmi: number;
  totalSavings: number;
  emergencyFundMonths: number;
}

export const AiFinancialTips: React.FC<AiFinancialTipsProps> = ({
  currency,
  monthlyIncome,
  monthlyExpenses,
  existingEmi,
  totalSavings,
  emergencyFundMonths,
}) => {
  const [loadingTips, setLoadingTips] = useState(false);
  const [tipsData, setTipsData] = useState<AiTipsResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive Advisor Chat
  const [userQuery, setUserQuery] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'advisor'; text: string }>>([
    {
      sender: 'advisor',
      text: `Hello! I am your BFSI Personal Finance Advisor. Based on your current monthly inflow of ${formatCurrency(
        monthlyIncome,
        currency
      )} and debt obligations of ${formatCurrency(
        existingEmi,
        currency
      )}, feel free to ask me anything regarding debt optimization, pre-payment strategies, credit score repair, or lowering your FOIR ratio.`,
    },
  ]);

  const netFreeCashflow = Math.max(0, monthlyIncome - monthlyExpenses - existingEmi);
  const savingsRate = monthlyIncome > 0 ? (netFreeCashflow / monthlyIncome) * 100 : 0;

  const handleFetchTips = async () => {
    setLoadingTips(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/gemini/financial-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome,
          monthlyExpenses,
          existingEmi,
          totalSavings,
          emergencyFundMonths,
        }),
      });

      if (!res.ok) {
        throw new Error(`Tips service returned status ${res.status}`);
      }

      const data = await res.json();
      setTipsData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to retrieve AI financial strategies');
    } finally {
      setLoadingTips(false);
    }
  };

  const handleAskAdvisor = async (queryText?: string) => {
    const q = queryText || userQuery;
    if (!q.trim() || loadingChat) return;

    setChatHistory((prev) => [...prev, { sender: 'user', text: q }]);
    if (!queryText) setUserQuery('');
    setLoadingChat(true);

    try {
      const res = await fetch('/api/gemini/ask-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          userContext: {
            monthlyIncome,
            existingEmi,
            monthlyExpenses,
            totalSavings,
            emergencyFundMonths,
          },
        }),
      });

      if (!res.ok) throw new Error('Advisor service offline');
      const data = await res.json();
      setChatHistory((prev) => [...prev, { sender: 'advisor', text: data.answer }]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'advisor',
          text: 'Apologies, I encountered an issue connecting to the underwriting intelligence engine. Please ensure your query is formulated clearly or retry.',
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const sampleQuestions = [
    'Should I prepay my home loan or invest in equity index funds?',
    'What is the quickest method to reduce my FOIR from 52% to below 40%?',
    'How should I allocate my monthly free cashflow between debt & emergency fund?',
    'Will paying off my credit cards before statement date boost my score?',
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Wealth & Debt Strategy</span>
            <span aria-hidden="true">·</span>
            <span>Cashflow Optimization</span>
            <span aria-hidden="true">·</span>
            <span>Gemini Reasoning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI Financial Tips & Underwriter Advisory
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Custom-tailored financial strategies synthesized from your cashflow ledger, designed to optimize debt burden, protect emergency liquidity, and accelerate net worth.
          </p>
        </div>

        <button
          onClick={handleFetchTips}
          disabled={loadingTips}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          <span>{loadingTips ? 'Synthesizing Advisory...' : 'Generate AI Financial Strategies'}</span>
        </button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-xl">
          <div className="text-[11px] text-slate-400">Monthly Net Inflow</div>
          <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
            {formatCurrency(monthlyIncome, currency)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Base take-home income</div>
        </div>

        <div className="glass-panel p-4 rounded-xl">
          <div className="text-[11px] text-slate-400">Total Debt Burden</div>
          <div className="text-lg font-bold font-mono text-amber-400 tabular-nums mt-0.5">
            {formatCurrency(existingEmi, currency)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {monthlyIncome > 0 ? ((existingEmi / monthlyIncome) * 100).toFixed(1) : 0}% DTI
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl">
          <div className="text-[11px] text-slate-400">Free Monthly Surplus</div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
            {formatCurrency(netFreeCashflow, currency)}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            {savingsRate.toFixed(1)}% savings rate
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl">
          <div className="text-[11px] text-slate-400">Emergency Reserve</div>
          <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
            {emergencyFundMonths} Months
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {formatCurrency(totalSavings, currency)} liquid
          </div>
        </div>
      </div>

      {/* AI Strategies Section */}
      {loadingTips && (
        <div className="glass-panel p-8 rounded-xl text-center space-y-4 border border-cyan-500/20">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <h4 className="text-base font-semibold text-white">Synthesizing Personal Wealth Advisory...</h4>
            <p className="text-xs text-slate-400 mt-1">
              Analyzing debt snowball economics, emergency reserve buffers, and cashflow optimization rules.
            </p>
          </div>
        </div>
      )}

      {tipsData && !loadingTips && (
        <div className="glass-panel p-6 sm:p-7 rounded-xl space-y-6 border border-cyan-500/20">
          {/* Header of Tips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Financial Health Diagnostic
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Executive Strategy Blueprint
              </h3>
              <p className="text-xs text-slate-300 mt-1">{tipsData.overallVerdict}</p>
            </div>

            <div className="text-right sm:self-center">
              <div className="text-[11px] text-slate-400">Health Index</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {tipsData.financialHealthScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Strategy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tipsData.strategies.map((strat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-mono text-[11px] font-semibold uppercase">
                      {strat.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        strat.priority === 'High'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : strat.priority === 'Medium'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {strat.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                    {strat.headline}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {strat.rationale}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.04] space-y-2">
                  <div className="text-[11px] text-slate-300">
                    <span className="text-cyan-300 font-semibold">Action Step: </span>
                    {strat.actionStep}
                  </div>
                  {strat.estimatedMonthlySavings > 0 && (
                    <div className="text-[11px] font-mono text-emerald-400 font-medium">
                      Est. Value: +{formatCurrency(strat.estimatedMonthlySavings, currency)} / mo
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Golden Rule Banner */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/20 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-xs text-slate-200">
              <span className="font-semibold text-cyan-300 font-mono uppercase tracking-wide mr-1.5">
                Golden Axiom:
              </span>
              {tipsData.goldenRuleSummary}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Advisor Q&A Console */}
      <div className="glass-panel p-5 sm:p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <img
            src="/src/assets/images/avatar_advisor_sarah_1790653999866.jpg"
            alt="Advisor Sarah"
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover border border-cyan-500/30 shrink-0"
          />
          <div>
            <h3 className="text-base font-semibold text-white">Ask Senior Financial Underwriter</h3>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>BFSI Credit & Mortgage Specialist</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Online & Ready</span>
            </div>
          </div>
        </div>

        {/* Chat History Container */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl p-3.5 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600/30 border border-cyan-500/40 text-cyan-100'
                    : 'bg-slate-900/80 border border-white/[0.08] text-slate-200'
                }`}
              >
                <div className="font-semibold text-[10px] text-slate-400 font-mono mb-1">
                  {msg.sender === 'user' ? 'You' : 'Advisor Underwriter'}
                </div>
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}

          {loadingChat && (
            <div className="flex justify-start">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.08] text-xs text-slate-400 flex items-center gap-2 font-mono">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Formulating institutional financial guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskAdvisor(q)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-white/[0.06] transition-colors cursor-pointer text-left"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            placeholder="Ask any mortgage, loan restructuring, or personal finance question..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskAdvisor();
            }}
            className="flex-1 glass-input rounded-lg px-3.5 py-2.5 text-xs"
          />
          <button
            onClick={() => handleAskAdvisor()}
            disabled={loadingChat || !userQuery.trim()}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
