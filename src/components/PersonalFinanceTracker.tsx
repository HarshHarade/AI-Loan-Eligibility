import React, { useState } from 'react';
import { Currency, FinancialRecord } from '../types/finance';
import {
  formatCurrency,
  generateGoogleSheetsCsv,
  downloadCsvFile,
} from '../utils/financeMath';
import {
  Plus,
  Trash2,
  Download,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ExternalLink,
  Check,
  RotateCw,
} from 'lucide-react';

interface PersonalFinanceTrackerProps {
  currency: Currency;
  records: FinancialRecord[];
  setRecords: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  onOpenSheetsModal: () => void;
  webhookUrl: string;
  sheetSynced: boolean;
}

export const PersonalFinanceTracker: React.FC<PersonalFinanceTrackerProps> = ({
  currency,
  records,
  setRecords,
  onOpenSheetsModal,
  webhookUrl,
  sheetSynced,
}) => {
  // New record form
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState<FinancialRecord['category']>('Living Expense');
  const [newNotes, setNewNotes] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Push to webhook status
  const [syncingWebhook, setSyncingWebhook] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Aggregates
  const totalIncome = records
    .filter((r) => r.category === 'Income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebtEmi = records
    .filter((r) => r.category === 'Debt / EMI')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalLivingExpenses = records
    .filter((r) => r.category === 'Living Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalInvestments = records
    .filter((r) => r.category === 'Investment' || r.category === 'Savings')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netSurplus = Math.max(0, totalIncome - totalDebtEmi - totalLivingExpenses);
  const savingsRate = totalIncome > 0 ? ((netSurplus / totalIncome) * 100).toFixed(1) : '0.0';

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newAmount === '' || Number(newAmount) <= 0) return;

    const newRecord: FinancialRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toISOString().split('T')[0],
      title: newTitle.trim(),
      amount: Number(newAmount),
      category: newCategory,
      notes: newNotes.trim() || undefined,
    };

    setRecords([newRecord, ...records]);
    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleExportCsv = () => {
    const csv = generateGoogleSheetsCsv(records, currency);
    downloadCsvFile(csv, `Credex_Personal_Finance_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSyncToWebhook = async () => {
    if (!webhookUrl) {
      onOpenSheetsModal();
      return;
    }

    setSyncingWebhook(true);
    setSyncSuccess(false);

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', // standard for Google Apps Script Webhooks
        body: JSON.stringify({
          app: 'Credex BFSI Suite',
          timestamp: new Date().toISOString(),
          currency,
          summary: {
            totalIncome,
            totalDebtEmi,
            totalLivingExpenses,
            netSurplus,
            savingsRate,
          },
          records,
        }),
      });

      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    } catch (err) {
      console.error('Webhook sync failed:', err);
    } finally {
      setSyncingWebhook(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesCat = filterCategory === 'All' || r.category === filterCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase tracking-wider mb-1">
            <span>Personal Finance Tracker</span>
            <span aria-hidden="true">·</span>
            <span>Google Sheets Cloud Sync</span>
            <span aria-hidden="true">·</span>
            <span>Persistent Cashflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Finance Tracker & Sheets Ledger
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A minimalist, high-clarity financial ledger tracking monthly cashflows, obligations, and savings. Sync directly to Google Sheets or export cleanly formatted CSVs.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-xs font-medium text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleSyncToWebhook}
            disabled={syncingWebhook}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-medium text-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            {syncSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Synced to Sheets!</span>
              </>
            ) : syncingWebhook ? (
              <>
                <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Pushing to Cloud...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>{webhookUrl ? 'Sync to Google Sheets' : 'Setup Google Sheets'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Aggregate Overview Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Monthly Inflow</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatCurrency(totalIncome, currency)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Salary & Liquid revenue
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Debt Service & EMIs</span>
            <ArrowDownRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {formatCurrency(totalDebtEmi, currency)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {totalIncome > 0 ? ((totalDebtEmi / totalIncome) * 100).toFixed(1) : 0}% DTI obligation
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Essential Living Costs</span>
            <ArrowDownRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
            {formatCurrency(totalLivingExpenses, currency)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Rent, utilities, food
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Free Discretionary Surplus</span>
            <span className="text-[10px] font-mono text-cyan-400">{savingsRate}% Rate</span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
            {formatCurrency(netSurplus, currency)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Uncommitted monthly runway
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left (35%), Ledger Table Right (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fast Add Form */}
        <div className="lg:col-span-4 space-y-4">
          <form onSubmit={handleAddRecord} className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center justify-between">
              <span>Log Financial Transaction</span>
              <span className="text-xs text-slate-400 font-mono">Quick Entry</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              >
                <option value="Income">Income (Salary / Dividend)</option>
                <option value="Debt / EMI">Debt / EMI Obligation</option>
                <option value="Living Expense">Living Expense (Essential)</option>
                <option value="Investment">Investment (SIP / Stocks)</option>
                <option value="Savings">Emergency Savings</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Title / Counterparty
              </label>
              <input
                type="text"
                placeholder="e.g. Primary Tech Salary, Chase Home Loan"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Amount ({currency})
              </label>
              <input
                type="number"
                placeholder="e.g. 4500"
                min="1"
                step="any"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Due on 1st of month"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md shadow-cyan-900/20"
            >
              <Plus className="w-4 h-4" />
              <span>Record Transaction</span>
            </button>
          </form>

          {/* Quick Presets */}
          <div className="glass-panel p-4 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
              Quick Ledger Presets
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => {
                  setNewTitle('Monthly Corporate Salary');
                  setNewCategory('Income');
                  setNewAmount(6500);
                }}
                className="text-[11px] px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.05]"
              >
                + Salary ($6,500)
              </button>
              <button
                onClick={() => {
                  setNewTitle('Mortgage Home Loan EMI');
                  setNewCategory('Debt / EMI');
                  setNewAmount(1450);
                }}
                className="text-[11px] px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.05]"
              >
                + Mortgage ($1,450)
              </button>
              <button
                onClick={() => {
                  setNewTitle('Auto Vehicle Finance');
                  setNewCategory('Debt / EMI');
                  setNewAmount(420);
                }}
                className="text-[11px] px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.05]"
              >
                + Car Loan ($420)
              </button>
              <button
                onClick={() => {
                  setNewTitle('Index Fund SIP Auto-Sweep');
                  setNewCategory('Investment');
                  setNewAmount(800);
                }}
                className="text-[11px] px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.05]"
              >
                + Index SIP ($800)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Ledger Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-5 rounded-xl space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {['All', 'Income', 'Debt / EMI', 'Living Expense', 'Investment', 'Savings'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                        filterCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass-input rounded-lg pl-8 pr-3 py-1.5 text-xs"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {filteredRecords.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No records matching the filter criteria. Add a record on the left to track cashflows.
                </div>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-white/[0.06]">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-mono">
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2 px-3 text-slate-400">{r.date}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`text-[10px] font-semibold ${
                              r.category === 'Income'
                                ? 'text-emerald-400'
                                : r.category === 'Debt / EMI'
                                ? 'text-amber-400'
                                : r.category === 'Investment'
                                ? 'text-cyan-400'
                                : 'text-slate-300'
                            }`}
                          >
                            {r.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-200 font-sans">
                          <div>{r.title}</div>
                          {r.notes && (
                            <div className="text-[10px] text-slate-500 font-mono">{r.notes}</div>
                          )}
                        </td>
                        <td
                          className={`py-2 px-3 font-semibold tabular-nums ${
                            r.category === 'Income' ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {r.category === 'Income' ? '+' : '-'}
                          {formatCurrency(r.amount, currency)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => handleDeleteRecord(r.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
              <div>
                Showing <span className="font-mono text-slate-200">{filteredRecords.length}</span> of{' '}
                <span className="font-mono text-slate-200">{records.length}</span> entries
              </div>
              <div className="font-mono text-[11px]">
                Persistent across browser sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
