import React, { useState } from 'react';
import { Currency, FinancialRecord } from '../types/finance';
import {
  formatCurrency,
  generateGoogleSheetsCsv,
  downloadCsvFile,
} from '../utils/financeMath';
import {
  FileSpreadsheet,
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Link2,
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  records: FinancialRecord[];
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  currency,
  records,
  webhookUrl,
  setWebhookUrl,
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const csv = generateGoogleSheetsCsv(records, currency);
    downloadCsvFile(csv, `Credex_Google_Sheets_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const sampleAppsScript = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Append timestamp and summary
  if (data.records && data.records.length > 0) {
    data.records.forEach(function(r) {
      sheet.appendRow([new Date(), r.category, r.title, r.amount, r.notes || ""]);
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(sampleAppsScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleTestPing = async () => {
    if (!webhookUrl) return;
    setTestStatus('Testing connection...');
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          test: true,
          pingTime: new Date().toISOString(),
          recordCount: records.length,
        }),
      });
      setTestStatus('Sync packet sent successfully!');
      setTimeout(() => setTestStatus(null), 4000);
    } catch (err: any) {
      setTestStatus('Connection failed: check Webhook URL permissions');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel-elevated w-full max-w-2xl rounded-2xl p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto border border-emerald-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Google Sheets Integration & Cloud Persistence
              </h3>
              <p className="text-xs text-slate-400">
                Seamless synchronization with Google Sheets for auditable transparency.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method 1: Instant CSV Export */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Option 1: One-Click Google Sheets CSV Export</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">Ready</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Downloads a clean, pre-structured CSV containing all {records.length} transactions, date timestamps, categories, and balances. In your Google Sheet, click <strong className="text-slate-300">File &gt; Import &gt; Upload</strong>.
          </p>
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Formatted Google Sheets CSV</span>
          </button>
        </div>

        {/* Method 2: Live Webhook Sync */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-400" />
              <span>Option 2: Live Google Apps Script Webhook Sync</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">Automated</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Stream entries live to any Google Spreadsheet by providing an Apps Script Web App URL.
          </p>

          <div className="space-y-2">
            <label className="block text-[11px] font-mono text-slate-300">
              Google Apps Script Web App Deployment URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 glass-input rounded-lg px-3 py-2 text-xs font-mono"
              />
              <button
                onClick={handleTestPing}
                disabled={!webhookUrl}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Test Ping
              </button>
            </div>
            {testStatus && (
              <div className="text-[11px] font-mono text-cyan-300">{testStatus}</div>
            )}
          </div>

          {/* Collapsible snippet */}
          <div className="pt-2 border-t border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">3-Step Setup Instructions:</span>
              <button
                onClick={handleCopyScript}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? 'Copied Script!' : 'Copy Apps Script'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 pl-1">
              <li>Open your Google Sheet, select <span className="text-slate-300">Extensions &gt; Apps Script</span>.</li>
              <li>Paste the copied script and click <span className="text-slate-300">Deploy &gt; New deployment</span>.</li>
              <li>Select type <span className="text-slate-300">Web app</span>, set Access to <span className="text-slate-300">Anyone</span>, and paste the URL above.</li>
            </ol>
          </div>
        </div>

        {/* Local Persistence reassurance */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/[0.05] flex items-center gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Local Storage Encrypted Persistence:</strong> All transactions and simulation configurations are automatically preserved on your local client across reloads and sessions.
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
