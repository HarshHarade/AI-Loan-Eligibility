import React, { useState } from 'react';
import { Currency } from '../types/finance';
import { FileSpreadsheet, RotateCcw, Share2, Check } from 'lucide-react';

export type WebsitePage = 'home' | 'tools' | 'rates' | 'methodology' | 'tracker';

interface NavbarProps {
  currentPage: WebsitePage;
  setCurrentPage: (page: WebsitePage) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenSheetsModal: () => void;
  onResetDefaults: () => void;
  sheetSynced: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currency,
  setCurrency,
  onOpenSheetsModal,
  onResetDefaults,
  sheetSynced,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080c14]/85 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentPage('home')}
          className="text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors shrink-0"
        >
          Credex
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              currentPage === 'home'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentPage('tools')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              currentPage === 'tools'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tools Hub
          </button>

          <button
            onClick={() => setCurrentPage('rates')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              currentPage === 'rates'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lending Rates
          </button>

          <button
            onClick={() => setCurrentPage('methodology')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              currentPage === 'methodology'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Underwriting Science
          </button>

          <button
            onClick={() => setCurrentPage('tracker')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
              currentPage === 'tracker'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Finance Ledger
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Share Direct Link Button */}
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 rounded-md hover:bg-cyan-900/50 hover:border-cyan-400/50 transition-all whitespace-nowrap cursor-pointer"
            title="Copy shareable direct link to clipboard"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Share Link</span>
              </>
            )}
          </button>

          {/* Currency selector */}
          <div className="relative">
            <select
              aria-label="Select currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-slate-900/80 border border-white/10 rounded-md text-xs font-mono text-slate-300 px-2 py-1.5 pr-6 appearance-none focus:outline-none focus:border-cyan-400/60 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Google Sheets Sync Button */}
          <button
            onClick={onOpenSheetsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-md hover:bg-emerald-900/50 hover:border-emerald-400/50 transition-all whitespace-nowrap cursor-pointer"
            title="Google Sheets Cloud Sync"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Google Sheets</span>
            {sheetSynced && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          {/* Reset Preset Button */}
          <button
            onClick={onResetDefaults}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
            title="Reset to benchmark defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 gap-2 border-t border-white/[0.04] scrollbar-none">
        <button
          onClick={() => setCurrentPage('home')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentPage === 'home' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('tools')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentPage === 'tools' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Tools Hub
        </button>
        <button
          onClick={() => setCurrentPage('rates')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentPage === 'rates' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Rates
        </button>
        <button
          onClick={() => setCurrentPage('methodology')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentPage === 'methodology' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Methodology
        </button>
        <button
          onClick={() => setCurrentPage('tracker')}
          className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
            currentPage === 'tracker' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Ledger
        </button>
      </div>
    </header>
  );
};
