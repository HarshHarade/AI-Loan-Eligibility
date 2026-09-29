# Credex — AI Loan Eligibility & BFSI Personal Finance Suite

An institutional-grade, AI-powered Banking, Financial Services & Insurance (BFSI) web platform designed to simplify and accelerate personal financial decision-making. The platform integrates four core financial tools within a minimalist dark glassmorphism interface powered by Gemini 3.8 AI reasoning and transparent Google Sheets synchronization.

---

## 🌟 Live Demo & Web App

- **Production Web App:** [https://ais-pre-fgvj4ye7pmzlr3webqhb4q-343502752611.asia-southeast1.run.app](https://ais-pre-fgvj4ye7pmzlr3webqhb4q-343502752611.asia-southeast1.run.app)
- **Development Preview:** [https://ais-dev-fgvj4ye7pmzlr3webqhb4q-343502752611.asia-southeast1.run.app](https://ais-dev-fgvj4ye7pmzlr3webqhb4q-343502752611.asia-southeast1.run.app)

---

## 🚀 Key Modules & Tools

### 1. AI Loan Eligibility Checker
- **FOIR / DTI Underwriting**: Real-time evaluation of Fixed Obligation to Income Ratio against standard banking caps (<40% prime band, 50% institutional ceiling).
- **Institutional AI Underwriting File**: Uses Gemini 3.8 to generate sanction recommendations (*Approved*, *Conditional Approval*, *High Risk/Restructure*), underwriter summaries, risk classifications, approval odds, and bank negotiation tips.
- **Capacity Calculations**: Computes maximum sanction amounts, required tenures, and co-applicant buffers.

### 2. Credit Score Bureau Analyzer
- **The 5 Bureau Pillars**: Mathematical decomposition of Payment History (35%), Credit Utilization (30%), Credit Age (15%), Credit Mix (10%), and Recent Inquiries (10%).
- **Interactive Bureau Simulator**: "What-If" engine to project credit score deltas from debt paydowns, limit increases, or missed billing cycles.
- **Actionable 90-Day Roadmap**: AI-generated 30-day, 60-day, and 90-day credit repair milestones.

### 3. Dynamic EMI Calculator & Amortizer
- **Reducing-Balance Engine**: Precision monthly and annual amortization ledgers.
- **Visual Equity Split**: Live comparison of borrowed principal vs. total cumulative interest outgo.
- **Foreclosure & Prepayment Simulator**: Models extra monthly payments or lump sums to forecast exact tenure reduction and thousands in interest saved.
- **CSV Amortization Export**: 1-click download of the complete repayment schedule.

### 4. AI Financial Tips & Advisory
- **Cashflow Optimization Blueprint**: Tailored strategies across Debt Snowball/Avalanche, Emergency Runway Liquidity, and Capital Allocation.
- **Interactive Senior Underwriter Q&A**: Real-time conversational advisory console for complex mortgage structuring and debt compression questions.

### 5. Personal Finance Ledger & Google Sheets Integration
- **Transaction Tracker**: Monthly cashflow recording across Incomes, EMIs, Living Expenses, and Investments.
- **Google Sheets Cloud Sync**: 1-click formatted CSV export + real-time webhook sync via Google Apps Script.
- **Persistent Storage**: Client-side encrypted persistence preserves all transactions and simulations across sessions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express, TypeScript (`tsx`)
- **AI Engine**: Google GenAI SDK (`@google/genai`), Gemini 3.8 Flash
- **Cloud & Tooling**: Vite 8, Google Sheets Integration (CSV & Webhook)

---

## 📦 Local Setup & Development

### Prerequisites
- Node.js 20+ installed
- NPM or Bun

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/HarshHarade/AI-Loan-Eligibility.git
cd AI-Loan-Eligibility

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env and configure your GEMINI_API_KEY
cp .env.example .env

# 4. Start the full-stack development server
npm run dev
```

Visit `http://localhost:3000` to interact with the platform.

### Build & Production

```bash
# Build optimized client bundle
npm run build

# Start production server
npm start
```

---

## 📄 License
Licensed under the Apache-2.0 License.
