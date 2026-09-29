import React, { useState, useEffect } from 'react';
import {
  Currency,
  LoanEligibilityInput,
  CreditBureauProfile,
  FinancialRecord,
} from './types/finance';
import { Navbar, WebsitePage } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ToolsHub, SubTool } from './components/ToolsHub';
import { RatesPage } from './components/RatesPage';
import { MethodologyPage } from './components/MethodologyPage';
import { PersonalFinanceTracker } from './components/PersonalFinanceTracker';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { Footer } from './components/Footer';

const STORAGE_KEY_PREFIX = 'credex_bfsi_';

const DEFAULT_LOAN_INPUT: LoanEligibilityInput = {
  monthlyIncome: 7500,
  existingEmi: 1200,
  loanAmountRequested: 150000,
  loanTenorMonths: 180,
  interestRateAnnual: 7.5,
  creditScore: 745,
  employmentType: 'Salaried',
  loanPurpose: 'Home / Mortgage',
  hasCoApplicant: false,
  hasCollateral: true,
};

const DEFAULT_CREDIT_PROFILE: CreditBureauProfile = {
  creditScore: 745,
  paymentHistoryScore: 99,
  creditUtilization: 22,
  averageAccountAgeYears: 5.4,
  hardInquiriesLast6Months: 1,
  totalCreditLimit: 35000,
  totalCurrentBalance: 7700,
  activeAccounts: 6,
  delinquentAccounts: 0,
};

const DEFAULT_RECORDS: FinancialRecord[] = [
  {
    id: 'rec_init_1',
    date: '2026-03-01',
    category: 'Income',
    title: 'Primary Corporate Salary',
    amount: 7500,
    notes: 'Direct deposit',
  },
  {
    id: 'rec_init_2',
    date: '2026-03-03',
    category: 'Debt / EMI',
    title: 'Chase Auto Vehicle Loan',
    amount: 450,
    notes: 'Auto-debit 3rd of month',
  },
  {
    id: 'rec_init_3',
    date: '2026-03-04',
    category: 'Debt / EMI',
    title: 'Student Loan Consolidation',
    amount: 350,
    notes: 'Fixed rate 4.8%',
  },
  {
    id: 'rec_init_4',
    date: '2026-03-05',
    category: 'Debt / EMI',
    title: 'Credit Card Revolving Minimum',
    amount: 400,
    notes: 'Revolving card balance',
  },
  {
    id: 'rec_init_5',
    date: '2026-03-06',
    category: 'Living Expense',
    title: 'Residential Rent & Utilities',
    amount: 2200,
    notes: 'Apartment lease & electricity',
  },
  {
    id: 'rec_init_6',
    date: '2026-03-08',
    category: 'Investment',
    title: 'Vanguard S&P 500 Index Fund',
    amount: 1000,
    notes: 'Automated sweep',
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<WebsitePage>('home');
  const [activeSubTool, setActiveSubTool] = useState<SubTool>('eligibility');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>('');

  // Persisted state
  const [loanInput, setLoanInput] = useState<LoanEligibilityInput>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}loan_input`);
      return saved ? JSON.parse(saved) : DEFAULT_LOAN_INPUT;
    } catch {
      return DEFAULT_LOAN_INPUT;
    }
  });

  const [creditProfile, setCreditProfile] = useState<CreditBureauProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}credit_profile`);
      return saved ? JSON.parse(saved) : DEFAULT_CREDIT_PROFILE;
    } catch {
      return DEFAULT_CREDIT_PROFILE;
    }
  });

  const [records, setRecords] = useState<FinancialRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}records`);
      return saved ? JSON.parse(saved) : DEFAULT_RECORDS;
    } catch {
      return DEFAULT_RECORDS;
    }
  });

  // URL Hash Linking & Deep Links Support
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash || hash === 'home') {
        setCurrentPage('home');
      } else if (hash === 'rates') {
        setCurrentPage('rates');
      } else if (hash === 'methodology') {
        setCurrentPage('methodology');
      } else if (hash === 'tracker' || hash === 'ledger') {
        setCurrentPage('tracker');
      } else if (hash.startsWith('tools')) {
        setCurrentPage('tools');
        if (hash === 'tools-credit' || hash === 'credit') setActiveSubTool('credit');
        else if (hash === 'tools-emi' || hash === 'emi') setActiveSubTool('emi');
        else if (hash === 'tools-tips' || hash === 'tips') setActiveSubTool('tips');
        else setActiveSubTool('eligibility');
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Update hash when navigating
  const handleNavigate = (page: WebsitePage, subTool?: SubTool) => {
    setCurrentPage(page);
    let targetHash: string = page;
    if (page === 'tools') {
      const tool = subTool || activeSubTool;
      setActiveSubTool(tool);
      targetHash = `tools-${tool}`;
    }
    window.location.hash = targetHash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}loan_input`, JSON.stringify(loanInput));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [loanInput]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}credit_profile`, JSON.stringify(creditProfile));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [creditProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}records`, JSON.stringify(records));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }, [records]);

  useEffect(() => {
    try {
      const savedUrl = localStorage.getItem(`${STORAGE_KEY_PREFIX}webhook`);
      if (savedUrl) setWebhookUrl(savedUrl);
    } catch {}
  }, []);

  const handleSetWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}webhook`, url);
    } catch {}
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all financial inputs to benchmark defaults?')) {
      setLoanInput(DEFAULT_LOAN_INPUT);
      setCreditProfile(DEFAULT_CREDIT_PROFILE);
      setRecords(DEFAULT_RECORDS);
      localStorage.clear();
      window.location.hash = 'home';
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Website Top Navigation Bar with Direct Link Share */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(p) => handleNavigate(p)}
        currency={currency}
        setCurrency={setCurrency}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        onResetDefaults={handleResetDefaults}
        sheetSynced={Boolean(webhookUrl)}
      />

      {/* Main Website Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Bar with Active Direct Link */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate('home')}
              className="hover:text-cyan-400 transition-colors"
            >
              Credex
            </button>
            <span>/</span>
            <span className="text-slate-200 capitalize">
              {currentPage === 'home'
                ? 'Institutional Overview'
                : currentPage === 'tools'
                ? `Tools Hub · ${activeSubTool}`
                : currentPage === 'rates'
                ? 'Lending Rate Benchmarks'
                : currentPage === 'methodology'
                ? 'Underwriting Science'
                : 'Finance Ledger & Sheets'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Direct Hash:</span>
            <span className="text-cyan-400">#{window.location.hash.replace('#', '') || 'home'}</span>
          </div>
        </div>

        {/* Viewport Routing */}
        {currentPage === 'home' && (
          <HomePage
            currency={currency}
            onNavigate={(page, subTool) => handleNavigate(page, subTool)}
            loanInput={loanInput}
            setLoanInput={setLoanInput}
            onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
          />
        )}

        {currentPage === 'tools' && (
          <ToolsHub
            activeTool={activeSubTool}
            setActiveTool={(t) => handleNavigate('tools', t)}
            currency={currency}
            loanInput={loanInput}
            setLoanInput={setLoanInput}
            creditProfile={creditProfile}
            setCreditProfile={setCreditProfile}
            records={records}
          />
        )}

        {currentPage === 'rates' && (
          <RatesPage
            currency={currency}
            onNavigateToTool={(t) => handleNavigate('tools', t)}
          />
        )}

        {currentPage === 'methodology' && (
          <MethodologyPage
            onNavigateToTool={(t) => handleNavigate('tools', t)}
          />
        )}

        {currentPage === 'tracker' && (
          <PersonalFinanceTracker
            currency={currency}
            records={records}
            setRecords={setRecords}
            onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
            webhookUrl={webhookUrl}
            sheetSynced={Boolean(webhookUrl)}
          />
        )}
      </main>

      {/* Google Sheets Integration Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        currency={currency}
        records={records}
        webhookUrl={webhookUrl}
        setWebhookUrl={handleSetWebhookUrl}
      />

      {/* Comprehensive Website Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
      />
    </div>
  );
}
