import React from 'react';
import { Currency, LoanEligibilityInput, CreditBureauProfile, FinancialRecord } from '../types/finance';
import { LoanEligibilityChecker } from './LoanEligibilityChecker';
import { CreditScoreAnalyzer } from './CreditScoreAnalyzer';
import { EmiCalculator } from './EmiCalculator';
import { AiFinancialTips } from './AiFinancialTips';
import { Compass, CreditCard, Calculator, Sparkles } from 'lucide-react';

export type SubTool = 'eligibility' | 'credit' | 'emi' | 'tips';

interface ToolsHubProps {
  activeTool: SubTool;
  setActiveTool: (tool: SubTool) => void;
  currency: Currency;
  loanInput: LoanEligibilityInput;
  setLoanInput: React.Dispatch<React.SetStateAction<LoanEligibilityInput>>;
  creditProfile: CreditBureauProfile;
  setCreditProfile: React.Dispatch<React.SetStateAction<CreditBureauProfile>>;
  records: FinancialRecord[];
}

export const ToolsHub: React.FC<ToolsHubProps> = ({
  activeTool,
  setActiveTool,
  currency,
  loanInput,
  setLoanInput,
  creditProfile,
  setCreditProfile,
  records,
}) => {
  const computedLivingExpenses = records
    .filter((r) => r.category === 'Living Expense')
    .reduce((a, b) => a + b.amount, 0);

  const computedTotalSavings = records
    .filter((r) => r.category === 'Savings' || r.category === 'Investment')
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6 py-4">
      {/* Tools Hub Segmented Bar */}
      <div className="glass-panel p-2 rounded-2xl flex flex-wrap items-center gap-2 border border-white/[0.08]">
        <button
          onClick={() => setActiveTool('eligibility')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTool === 'eligibility'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span>1. Loan Eligibility</span>
        </button>

        <button
          onClick={() => setActiveTool('credit')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTool === 'credit'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>2. Credit Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTool('emi')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTool === 'emi'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span>3. EMI Calculator</span>
        </button>

        <button
          onClick={() => setActiveTool('tips')}
          className={`flex-1 min-w-[160px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTool === 'tips'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>4. AI Financial Tips</span>
        </button>
      </div>

      {/* Render Active Tool */}
      <div>
        {activeTool === 'eligibility' && (
          <LoanEligibilityChecker
            currency={currency}
            input={loanInput}
            setInput={setLoanInput}
          />
        )}

        {activeTool === 'credit' && (
          <CreditScoreAnalyzer
            currency={currency}
            creditProfile={creditProfile}
            setCreditProfile={setCreditProfile}
          />
        )}

        {activeTool === 'emi' && (
          <EmiCalculator
            currency={currency}
            initialPrincipal={loanInput.loanAmountRequested}
            initialRate={loanInput.interestRateAnnual}
            initialTenureMonths={loanInput.loanTenorMonths}
          />
        )}

        {activeTool === 'tips' && (
          <AiFinancialTips
            currency={currency}
            monthlyIncome={loanInput.monthlyIncome}
            monthlyExpenses={computedLivingExpenses || 2200}
            existingEmi={loanInput.existingEmi}
            totalSavings={computedTotalSavings || 15000}
            emergencyFundMonths={
              computedLivingExpenses > 0
                ? Math.round((computedTotalSavings || 15000) / computedLivingExpenses)
                : 6
            }
          />
        )}
      </div>
    </div>
  );
};
