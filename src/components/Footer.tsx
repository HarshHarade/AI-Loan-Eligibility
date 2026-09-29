import React from 'react';
import { WebsitePage } from './Navbar';
import { SubTool } from './ToolsHub';
import { Shield, FileSpreadsheet, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: WebsitePage, subTool?: SubTool) => void;
  onOpenSheetsModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSheetsModal,
}) => {
  return (
    <footer className="mt-20 border-t border-white/[0.08] bg-[#05080e] text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top 4-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors"
            >
              Credex
            </button>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              AI-powered Banking, Financial Services &amp; Insurance (BFSI) web platform designed to eliminate debt ambiguity and accelerate personal financial decision-making with institutional underwriting clarity.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400 text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Sheets Ready</span>
              </span>
            </div>
          </div>

          {/* Col 1: Platform Tools */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
              Financial Tools
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('tools', 'eligibility')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Loan Eligibility Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools', 'credit')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Credit Score Bureau Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools', 'emi')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Dynamic EMI Amortizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools', 'tips')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  AI Underwriter Advisory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Institutional Intelligence */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
              Methodology &amp; Rates
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('rates')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  2026 Lending Benchmarks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('methodology')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  FOIR &amp; DTI Mathematics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('methodology')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  5-Pillar Credit Scoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('methodology')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Reducing Balance Engine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrations & Cloud */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
              Data &amp; Persistence
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Personal Finance Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSheetsModal}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Google Sheets Integration
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSheetsModal}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Apps Script Webhook Setup
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSheetsModal}
                  className="hover:text-cyan-400 transition-colors"
                >
                  CSV Format Documentation
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimers & Legal Notice */}
        <div className="border-t border-white/[0.06] pt-6 space-y-2 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong>Regulatory &amp; Analytical Disclosure:</strong> Credex is an independent financial technology decision-support system and AI analytics provider. Credex is not a chartered banking institution, licensed lender, loan broker, or credit repair organization. The eligibility scores, amortization schedules, and underwriting simulations provided are deterministic projections based on public BFSI guidelines, FICO/CIBIL algorithms, and institutional risk parameters. Official loan sanction remains at the sole discretion of individual credit committees and regulated financial institutions.
          </p>
          <p>
            Client data is processed privately with client-side encrypted caching and optional user-directed Google Sheets cloud synchronization. We do not sell consumer financial data to third-party lead brokers.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.04] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Credex Financial Intelligence Suite. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>ISO-20022 Financial Framework</span>
            <span aria-hidden="true">·</span>
            <span>Gemini AI Reasoner</span>
            <span aria-hidden="true">·</span>
            <span>Google Sheets Compatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
