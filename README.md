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

## Documentation
CREDEX
AI Loan Eligibility & BFSI Personal Finance Suite
System Documentation and Research Paper
Document type: Project Documentation / Technical Research Report
Project domain: Banking, Financial Services and Insurance (BFSI), FinTech, Credit Risk Analytics
Name: Harsh Maruti Harade
________________________________________
Abstract
The increasing adoption of financial technology has created opportunities to improve personal financial planning, loan eligibility assessment, credit analysis, and financial record management. This report documents Credex, a browser-based financial intelligence suite designed to consolidate loan eligibility estimation, credit analysis, loan repayment calculations, lending-rate comparisons, and personal finance tracking within a unified interface.
The system interface presents four principal functional areas: an institutional overview dashboard, a loan eligibility checker, a lending-rate benchmark module, and a financial ledger. The loan eligibility interface incorporates financial capacity parameters, proposed loan details, a debt-to-income or fixed-obligation assessment, estimated monthly instalments, and an underwriting assessment panel. The lending-rate interface compares illustrative annual percentage rates across credit-score tiers, while the ledger provides transaction entry, cash-flow summaries, expense categorisation, and spreadsheet integration options.
This report examines the displayed features, documents the relevant financial calculations, identifies potential inconsistencies in the demonstration data, and proposes a validation framework for reliable implementation. It draws on public research and regulatory resources concerning credit scoring, debt-to-income ratios, artificial intelligence risk management, and explainable credit decisions.
The screenshots provide evidence of the application's visual design and intended functionality. They do not, by themselves, establish predictive accuracy, regulatory compliance, successful cloud integration, or production readiness. These properties require independent testing and supporting technical evidence.
Keywords: FinTech, loan eligibility, credit risk, debt-to-income ratio, EMI calculator, financial ledger, artificial intelligence, model validation, explainable AI.
________________________________________
1. Introduction
Financial decision-making frequently requires the simultaneous assessment of income, recurring obligations, loan repayment capacity, credit history, borrowing costs, and household expenditure. When these activities are performed using disconnected spreadsheets or manual calculations, users may encounter inconsistent assumptions, duplicated records, and difficulty comparing financial alternatives.
Credex is presented as an integrated personal finance and lending-assessment interface intended to address these challenges. Its design combines financial calculators, credit assessment indicators, interest-rate benchmarks, and a transaction ledger in one application.
The system's home page introduces the platform as an AI loan eligibility and personal finance suite. The Tools Hub contains modules for loan eligibility, credit analysis, EMI calculation, and financial tips. Separate navigation sections provide lending-rate benchmarks and financial ledger functions.
The loan eligibility page displays financial inputs and a real-time assessment panel. The lending-rate page organises interest-rate examples by credit-score tier. The finance ledger page summarises monthly cash flows and displays transaction records.
These features make Credex a useful subject for a technical case study involving financial calculation, interface design, decision support, and responsible AI implementation.
2. Problem Statement
Personal finance applications often need to present several interdependent financial measures without overwhelming users. A loan applicant may need to understand not only the proposed instalment but also how the instalment affects existing obligations, disposable income, and the total cost of borrowing.
The central problem addressed by this project is:
How can a unified financial interface help users estimate loan affordability, compare borrowing costs, and monitor personal cash flows while keeping calculations transparent and results appropriately qualified?
The associated technical challenges include:
•	Calculating loan repayments using clearly defined assumptions.
•	Estimating repayment capacity using income and existing obligations.
•	Communicating credit-score tiers and lending-rate differences.
•	Maintaining a categorised record of income, debt payments, expenses, and investments.
•	Explaining assessment outcomes rather than presenting unexplained approval or rejection labels.
•	Ensuring that displayed calculations are internally consistent and independently testable.
3. Project Objectives
The principal objectives are:
1.	To document a consolidated financial dashboard for personal finance and lending analysis.
2.	To describe the inputs and outputs of the loan eligibility checker.
3.	To explain the mathematical basis of EMI and debt-burden calculations.
4.	To document the credit-score-tier lending-rate comparison interface.
5.	To describe transaction recording, cash-flow summaries, and spreadsheet integration.
6.	To identify calculation inconsistencies and recommend appropriate validation procedures.
7.	To propose responsible AI governance, privacy, security, and explainability controls.
8.	To establish a foundation for future empirical testing and academic evaluation.
4. Scope of the System
The documented interface contains four principal areas.
4.1 Institutional Overview
The home page provides navigation to the major tools, introductory project information, and summary claims concerning financial analysis and spreadsheet synchronisation.
4.2 Loan Eligibility and Underwriting
The loan eligibility interface displays adjustable financial inputs, including monthly inflow, recurring debt obligations, requested loan principal, loan tenor, interest rate, and a credit-score indicator. An assessment panel displays the proposed EMI, debt-to-income or FOIR ratio, a sanction-ceiling estimate, and a recommendation.
4.3 Lending-Rate Benchmarks
The lending-rate page displays annual interest-rate examples for several loan categories across four credit-score tiers. A spread-analysis section is intended to illustrate the financial consequences of different borrowing rates.
4.4 Finance Ledger
The ledger presents summary values for income, debt service, living expenses, and discretionary surplus. It also provides a transaction-entry form, transaction categories, a searchable transaction table, and options labelled for CSV export and Google Sheets integration.
The available screenshots demonstrate the interface and displayed sample values. They do not establish that every advertised feature has been tested against a live banking, credit bureau, or spreadsheet service.
5. System Interface and Screenshot Documentation
The four supplied screenshots are designated as Figures 1–4. They should be inserted at the indicated locations in the final formatted document, preserving their original proportions and making the interface text legible.
Figure 1. Loan Eligibility Checker
[Insert supplied screenshot 1 here]
Caption: Figure 1. Credex loan eligibility interface showing financial capacity inputs, requested loan principal, tenor, interest rate, credit-score information, proposed EMI, FOIR assessment, and a restructuring recommendation.
Description: The interface allows users to explore how changes to financial inputs affect an estimated borrowing assessment. The screenshot displays a monthly inflow of $15,250, recurring EMIs and debt of $7,500, a requested principal of $150,000, a tenor of 180 months, and an annual interest rate of 7.50%. The assessment panel reports a proposed EMI of $1,391 and a FOIR ratio of 58.3%.
These are demonstration values displayed in the interface, not verified lending offers or evidence of an actual underwriting decision.
Figure 2. Institutional Overview Dashboard
[Insert supplied screenshot 2 here]
Caption: Figure 2. Credex home page presenting the overall suite, navigation to financial tools, and introductory information.
Description: The dashboard introduces the system's principal functions and provides shortcuts to loan eligibility, credit analysis, and spreadsheet synchronisation. It also presents interface-level claims concerning financial analysis and local data persistence.
Such claims should be supported by implementation documentation and testing before they are treated as verified system properties.
Figure 3. Lending-Rate Benchmarks
[Insert supplied screenshot 3 here]
Caption: Figure 3. Lending-rate benchmark interface showing example APR values for loan categories across four credit-score tiers.
Description: The table compares residential mortgages, vehicle loans, unsecured personal loans, and commercial or small-business loans. The interface is intended to demonstrate how borrowing costs can vary by credit tier and loan product.
The displayed figures should be treated as illustrative benchmark data until their sources, observation dates, market coverage, and calculation methods are documented.
Figure 4. Finance Tracker and Sheets Ledger
[Insert supplied screenshot 4 here]
Caption: Figure 4. Personal finance ledger displaying monthly cash-flow summaries, transaction entry, category filters, and spreadsheet integration options.
Description: The ledger displays total monthly inflow, debt service, essential living costs, and discretionary surplus. The transaction table contains example entries for salary, vehicle loan payments, student loan payments, credit card obligations, housing expenses, and investments.
The interface provides a foundation for transaction categorisation and cash-flow monitoring. Persistence, export integrity, and spreadsheet synchronisation require separate functional verification.
6. Proposed System Architecture
Based on the visible interface, Credex can be documented using a logical architecture with five layers. This is a proposed architectural interpretation, not a verified description of the application's internal implementation.
6.1 Presentation Layer
The presentation layer consists of the browser interface, navigation, input controls, summary cards, tables, and assessment panels.
6.2 Financial Calculation Layer
This layer is responsible for deterministic calculations, including:
•	EMI estimation.
•	Debt-to-income or fixed-obligation ratio calculations.
•	Monthly surplus estimation.
•	Interest and repayment comparisons.
•	Credit-tier lookup and display.
These calculations should be implemented using testable functions and documented assumptions.
6.3 Assessment and Advisory Layer
An optional assessment layer can interpret financial calculations and generate plain-language explanations or recommendations.
Any generative AI component should be distinguished from the deterministic financial calculation engine. AI-generated commentary should not silently modify financial values or override validated rules.
6.4 Data Management Layer
This layer manages transaction records, financial input values, category labels, and any saved user preferences. The storage method, encryption model, retention policy, and recovery mechanism need to be documented from the actual implementation.
6.5 Integration Layer
The interface includes controls labelled for Google Sheets synchronisation and CSV export. A complete implementation would require documented authorisation, data mapping, error handling, and confirmation that exported or synchronised records match the original ledger.
7. Methodology and Financial Calculations
The system should use deterministic financial formulas for numerical outputs and reserve AI for supplementary explanations where appropriate.
7.1 Debt-to-Income Ratio
A conventional debt-to-income ratio is calculated as:
DTI = (Total monthly debt payments / Gross monthly income) × 100
The Consumer Financial Protection Bureau explains that DTI compares monthly debt payments with gross monthly income and that acceptable limits differ by lender and loan product [1].
Credex labels its assessment as FOIR, or Fixed Obligation to Income Ratio. In some financial contexts, FOIR is calculated using fixed monthly obligations divided by monthly income. However, the exact definition of included obligations and the income denominator must be explicitly documented.
A critical implementation distinction is that the screenshot labels the input as net monthly inflow, whereas the CFPB's conventional DTI definition uses gross monthly income. A net-income-based affordability ratio may be useful, but it should not be presented as identical to a gross-income-based DTI measure.
7.2 Equated Monthly Instalment (EMI)
For a standard fully amortising loan with a fixed monthly interest rate, EMI is calculated as:
EMI = P × r × (1 + r)ⁿ / [(1 + r)ⁿ − 1]
Where:
•	P = principal amount borrowed.
•	r = annual nominal interest rate divided by 12, expressed as a decimal.
•	n = total number of monthly instalments.
For zero interest, EMI simplifies to principal divided by the number of instalments.
The formula assumes regular monthly instalments, a fixed interest rate, and no additional fees or insurance premiums included in the payment.
7.3 Maximum Affordable Instalment
A simplified repayment-capacity rule can be expressed as:
Maximum total debt service = Monthly qualifying income × Maximum permitted obligation ratio
Available capacity for a new loan can then be estimated as:
Available new EMI = Maximum total debt service − Existing monthly obligations
The result should not be allowed to fall below zero. If existing obligations already exceed the selected threshold, the system should report that there is no additional capacity under the chosen rule.
This is a budgeting estimate, not a guarantee that a lender will approve the loan.
7.4 Total Repayment and Interest Cost
For a fixed-rate amortising loan:
Total scheduled repayment = EMI × Number of instalments
Estimated interest paid = Total scheduled repayment − Principal
This calculation excludes processing fees, taxes, insurance, prepayment charges, and any other amounts not included in the EMI.
7.5 Credit-Score Interpretation
Credit scores are generated using scoring models and information from credit reports. The factors and score ranges may differ by scoring model and product [2].
Accordingly, the score of 745 displayed in Figure 1 should be treated as an illustrative interface value. The application should identify the relevant bureau or scoring model, its applicable range, and the date of the score if actual bureau data is ever integrated.
8. Results and Discussion
8.1 Loan Eligibility Demonstration
Figure 1 displays the following values:
Parameter	Displayed value
Net monthly inflow	$15,250
Existing EMIs and debt	$7,500
Requested loan principal	$150,000
Loan tenor	180 months
Annual interest rate	7.50%
Proposed monthly EMI	$1,391
Displayed FOIR ratio	58.3%
The interface provides a clear visual indication that the displayed debt burden exceeds its stated 50% benchmark. It also presents a recommendation to restructure the proposed loan.
However, the numerical relationships require validation.
First, existing obligations divided by the displayed monthly infl


