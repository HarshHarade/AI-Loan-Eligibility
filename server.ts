import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Gemini client setup following official AI Studio guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Loan Eligibility Evaluation Endpoint
app.post('/api/gemini/analyze-eligibility', async (req, res) => {
  try {
    const {
      monthlyIncome,
      existingEmi,
      loanAmountRequested,
      loanTenorMonths,
      interestRateAnnual,
      creditScore,
      employmentType,
      loanPurpose,
      hasCoApplicant,
      hasCollateral,
      calculatedEmi,
      calculatedFoir,
      maxEligibleAmount,
    } = req.body;

    const prompt = `You are a Senior BFSI Underwriter and Credit Risk Officer at a premier banking institution.
Evaluate the following personal loan / mortgage application strictly using rigorous banking guidelines:

Applicant Financial Profile:
- Net Monthly Income: $${monthlyIncome}
- Existing Monthly Debt/EMIs: $${existingEmi}
- Requested Loan Amount: $${loanAmountRequested}
- Requested Tenor: ${loanTenorMonths} months (${(loanTenorMonths / 12).toFixed(1)} years)
- Indicative Interest Rate: ${interestRateAnnual}% p.a.
- Calculated Estimated EMI: $${calculatedEmi}
- Current FOIR / DTI (including new EMI): ${calculatedFoir}% (Benchmark cap is typically 45%-50%)
- Bureau Credit Score: ${creditScore}
- Employment Classification: ${employmentType}
- Loan Purpose: ${loanPurpose}
- Co-Applicant Present: ${hasCoApplicant ? 'Yes' : 'No'}
- Collateral / Asset Backed: ${hasCollateral ? 'Yes' : 'No'}
- Rule-based Max Capacity: $${maxEligibleAmount}

Provide a comprehensive, professional BFSI underwriting analysis in valid JSON format ONLY. Do not include markdown code fences or backticks.
The JSON must follow this exact structure:
{
  "verdict": "APPROVED" | "CONDITIONALLY_APPROVED" | "HIGH_RISK_REJECTED",
  "underwriterSummary": "A concise 2-3 sentence executive summary of the sanction decision.",
  "riskTier": "Low" | "Moderate" | "Elevated" | "High",
  "approvalProbability": 85,
  "strengths": ["string", "string"],
  "vulnerabilities": ["string", "string"],
  "recommendedActionItems": [
    { "title": "string", "impact": "High" | "Medium" | "Low", "description": "string" }
  ],
  "optimalLoanStructure": {
    "recommendedAmount": 0,
    "recommendedTenureMonths": 0,
    "targetEmi": 0,
    "negotiationTip": "string"
  }
}`;

    if (!ai) {
      // Deterministic underwriting fallback if API key is not ready
      const isApproved = calculatedFoir <= 50 && creditScore >= 700;
      const isConditional = calculatedFoir <= 60 && creditScore >= 620;
      return res.json({
        verdict: isApproved ? 'APPROVED' : isConditional ? 'CONDITIONALLY_APPROVED' : 'HIGH_RISK_REJECTED',
        underwriterSummary: isApproved
          ? `Strong financial profile with a controlled FOIR of ${calculatedFoir}%. Risk exposure is well within institutional tolerance.`
          : isConditional
          ? `Conditional approval feasible upon debt consolidation or tenure extension to moderate monthly FOIR below 50%.`
          : `High debt burden or credit profile exceeds standard risk tolerances. Restructuring is mandatory prior to formal bank submission.`,
        riskTier: isApproved ? 'Low' : isConditional ? 'Moderate' : 'High',
        approvalProbability: isApproved ? 90 : isConditional ? 65 : 30,
        strengths: [
          creditScore >= 720 ? 'Strong credit score demonstrating repayment discipline' : 'Established recurring monthly income flow',
          hasCoApplicant ? 'Dual-income co-applicant lowers single-point default risk' : 'Manageable loan-to-income requested multiple',
        ],
        vulnerabilities: [
          calculatedFoir > 45 ? `FOIR at ${calculatedFoir}% leaves minimal buffer for cost-of-living fluctuations` : 'Unsecured debt exposure requires monitoring',
          creditScore < 680 ? 'Credit score below prime tier attracts risk premium of 50-100 bps' : 'Tenure length increases cumulative interest outgo',
        ],
        recommendedActionItems: [
          {
            title: calculatedFoir > 45 ? 'Extend Tenure by 12-24 Months' : 'Prequalify with Tier-1 Banks',
            impact: 'High',
            description: calculatedFoir > 45 ? 'Reduces monthly EMI obligation, bringing FOIR into the prime <40% approval band.' : 'Leverage pristine credit score to negotiate 25-50 bps reduction in interest rate.',
          },
          {
            title: 'Liquidate Short-term Revolving Debt',
            impact: 'Medium',
            description: 'Retiring small credit card or BNPL obligations immediately frees up debt-service capacity.',
          }
        ],
        optimalLoanStructure: {
          recommendedAmount: Math.min(loanAmountRequested, maxEligibleAmount),
          recommendedTenureMonths: calculatedFoir > 50 ? loanTenorMonths + 24 : loanTenorMonths,
          targetEmi: calculatedEmi,
          negotiationTip: 'Request waiver of 0.5% loan processing fee and ask for floating rate with zero prepayment penalty.',
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Eligibility AI error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze loan eligibility' });
  }
});

// 2. Credit Score Bureau Diagnostics Endpoint
app.post('/api/gemini/analyze-credit', async (req, res) => {
  try {
    const {
      creditScore,
      paymentHistoryScore,
      creditUtilization,
      averageAccountAgeYears,
      hardInquiriesLast6Months,
      totalCreditLimit,
      totalCurrentBalance,
    } = req.body;

    const prompt = `You are a certified Credit Bureau Analyst and FICO / CIBIL Scoring Specialist.
Analyze the following consumer credit report profile:

- Credit Score: ${creditScore} (Scale: 300 to 900)
- On-Time Payment History: ${paymentHistoryScore}% (Target: >99%)
- Revolving Credit Utilization Ratio: ${creditUtilization}% (Target: <30%, Optimal: <10%)
- Average Account Age: ${averageAccountAgeYears} years
- Hard Credit Inquiries in last 6 months: ${hardInquiriesLast6Months}
- Total Credit Limit: $${totalCreditLimit}
- Total Current Revolving Balance: $${totalCurrentBalance}

Provide a deep credit diagnosis with a 30/60/90 day score optimization roadmap in valid JSON format ONLY. Do not use markdown backticks.
The JSON must follow this structure:
{
  "scoreTier": "Exceptional" | "Very Good" | "Good" | "Fair" | "Poor",
  "interestRateImpact": "string explaining loan interest impact",
  "primaryHurdle": "string",
  "factorBreakdown": [
    { "factor": "Payment History", "impactWeight": "35%", "status": "Good" | "Warning" | "Critical", "insight": "string" },
    { "factor": "Credit Utilization", "impactWeight": "30%", "status": "Good" | "Warning" | "Critical", "insight": "string" },
    { "factor": "Credit Age & History", "impactWeight": "15%", "status": "Good" | "Warning" | "Critical", "insight": "string" },
    { "factor": "Credit Mix & Depth", "impactWeight": "10%", "status": "Good" | "Warning" | "Critical", "insight": "string" },
    { "factor": "Recent Inquiries", "impactWeight": "10%", "status": "Good" | "Warning" | "Critical", "insight": "string" }
  ],
  "potentialScoreGain": "+25 to +60 points within 90 days",
  "roadmap": {
    "day30": ["string", "string"],
    "day60": ["string", "string"],
    "day90": ["string", "string"]
  }
}`;

    if (!ai) {
      const tier = creditScore >= 780 ? 'Exceptional' : creditScore >= 720 ? 'Very Good' : creditScore >= 660 ? 'Good' : creditScore >= 580 ? 'Fair' : 'Poor';
      return res.json({
        scoreTier: tier,
        interestRateImpact: creditScore >= 740 ? 'Qualifies for lowest prime mortgage and personal loan rates.' : 'Subject to 0.75% to 2.25% risk premium on standard borrowing rates.',
        primaryHurdle: creditUtilization > 30 ? 'Elevated credit card utilization suppresses score by up to 45 points.' : 'Credit history seasoning required.',
        factorBreakdown: [
          { factor: 'Payment History', impactWeight: '35%', status: paymentHistoryScore >= 98 ? 'Good' : 'Critical', insight: `${paymentHistoryScore}% on-time payment track record.` },
          { factor: 'Credit Utilization', impactWeight: '30%', status: creditUtilization <= 30 ? 'Good' : 'Warning', insight: `${creditUtilization}% revolving utilization against $${totalCreditLimit} aggregate limit.` },
          { factor: 'Credit Age & History', impactWeight: '15%', status: averageAccountAgeYears >= 3 ? 'Good' : 'Warning', insight: `${averageAccountAgeYears} years average credit maturity.` },
          { factor: 'Credit Mix & Depth', impactWeight: '10%', status: 'Good', insight: 'Mix of revolving cards and installment debt.' },
          { factor: 'Recent Inquiries', impactWeight: '10%', status: hardInquiriesLast6Months <= 2 ? 'Good' : 'Warning', insight: `${hardInquiriesLast6Months} hard inquiries registered recently.` }
        ],
        potentialScoreGain: '+35 to +55 points within 90 days',
        roadmap: {
          day30: ['Pay down balances prior to statement closing date to register under 20% utilization on bureau tapes.', 'Dispute any reporting discrepancies or erroneous late marks.'],
          day60: ['Request a soft-pull credit limit increase on oldest active credit card.', 'Ensure 100% automated minimum payments across all active accounts.'],
          day90: ['Allow recent hard inquiries to age past the 6-month threshold.', 'Maintain active credit accounts with single-digit utilization.']
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Credit AI error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze credit score' });
  }
});

// 3. AI Financial Advisory & Personalized Tips Endpoint
app.post('/api/gemini/financial-tips', async (req, res) => {
  try {
    const {
      monthlyIncome,
      monthlyExpenses,
      existingEmi,
      totalSavings,
      emergencyFundMonths,
      targetGoal,
    } = req.body;

    const netFreeCashflow = Math.max(0, monthlyIncome - monthlyExpenses - existingEmi);
    const savingsRate = monthlyIncome > 0 ? ((netFreeCashflow / monthlyIncome) * 100).toFixed(1) : 0;

    const prompt = `You are a certified wealth advisor and personal finance strategist.
Analyze the user's personal financial snapshot:
- Monthly Net Inflow: $${monthlyIncome}
- Monthly Non-Discretionary & Living Expenses: $${monthlyExpenses}
- Total Existing Debt/EMI Servicing: $${existingEmi}
- Free Discretionary Monthly Surplus: $${netFreeCashflow}
- Net Monthly Savings Rate: ${savingsRate}%
- Total Liquid Cash & Savings Reserve: $${totalSavings}
- Emergency Reserve Runway: ${emergencyFundMonths} months
- Stated Financial Goal: ${targetGoal || 'Optimize cashflow, reduce debt burden, and grow net worth'}

Generate a structured set of actionable, high-impact BFSI financial strategies in valid JSON format ONLY. Do not use markdown backticks.
The JSON must follow this exact format:
{
  "financialHealthScore": 82,
  "overallVerdict": "string 1-2 sentences on financial runway",
  "strategies": [
    {
      "category": "Debt Optimization" | "Emergency Cushion" | "Cashflow Engineering" | "Investment & Growth" | "Tax & Insurance",
      "headline": "string",
      "estimatedMonthlySavings": 0,
      "priority": "High" | "Medium" | "Low",
      "rationale": "string",
      "actionStep": "string"
    }
  ],
  "goldenRuleSummary": "One concise memorable financial axiom tailored to this user"
}`;

    if (!ai) {
      return res.json({
        financialHealthScore: Math.min(95, Math.max(40, Math.round(Number(savingsRate) * 1.5 + (emergencyFundMonths >= 6 ? 30 : emergencyFundMonths * 5)))),
        overallVerdict: `You retain $${netFreeCashflow}/mo in unallocated surplus (${savingsRate}% savings rate). Priority is solidifying an emergency runway before taking high-leverage positions.`,
        strategies: [
          {
            category: 'Debt Optimization',
            headline: 'Target High-Interest Revolving Balance Elimination',
            estimatedMonthlySavings: Math.round(existingEmi * 0.15),
            priority: 'High',
            rationale: 'Retiring consumer debt provides a guaranteed risk-free return equivalent to the interest rate avoided.',
            actionStep: 'Direct 50% of monthly surplus toward the highest-APR obligation while maintaining minimums on others.',
          },
          {
            category: 'Emergency Cushion',
            headline: emergencyFundMonths >= 6 ? 'Safeguard Liquid High-Yield Reserve' : 'Ramp Liquid Runway to 6 Months',
            estimatedMonthlySavings: 0,
            priority: emergencyFundMonths < 3 ? 'High' : 'Medium',
            rationale: 'Liquid reserves prevent forced liquidation of long-term investments during sudden income disruption.',
            actionStep: `Park ${Math.min(monthlyExpenses * 6, totalSavings)} in an FDIC-insured High Yield Savings Account earning ~4.5% APY.`,
          },
          {
            category: 'Cashflow Engineering',
            headline: 'Automate Pay-Yourself-First Split on Payday',
            estimatedMonthlySavings: Math.round(monthlyIncome * 0.1),
            priority: 'Medium',
            rationale: 'Automating transfers on salary credit day eliminates lifestyle creep and friction.',
            actionStep: 'Set up standing instruction to sweep 20% of net salary directly to an investment index account on the 1st of each month.',
          }
        ],
        goldenRuleSummary: 'Never borrow to fund depreciating lifestyle assets; borrow only when expected returns comfortably exceed debt-servicing costs.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Tips AI error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate financial tips' });
  }
});

// 4. Interactive BFSI Financial Advisor Q&A
app.post('/api/gemini/ask-advisor', async (req, res) => {
  try {
    const { question, userContext } = req.body;

    const prompt = `You are a seasoned Banking, Financial Services and Insurance (BFSI) advisory expert with 20+ years of institutional underwriting experience.
The user is asking: "${question}"

User Financial Context:
- Monthly Income: $${userContext?.monthlyIncome || 5000}
- Existing EMIs: $${userContext?.existingEmi || 800}
- Credit Score: ${userContext?.creditScore || 720}
- Monthly Expenses: $${userContext?.monthlyExpenses || 2500}
- Savings: $${userContext?.totalSavings || 15000}

Provide clear, actionable, mathematically sound advice. Avoid generic filler. Cite specific banking rules, ratios (such as FOIR, LTV, DTI), tax implications, or interest cost savings.
Respond with a concise, beautifully formatted answer with bullet points and bold highlights. Keep it within 3-4 short paragraphs.`;

    if (!ai) {
      return res.json({
        answer: `**Underwriter Perspective on your query:**\n\nWhen evaluating "${question}", the primary banking metric to monitor is your **Fixed Obligation to Income Ratio (FOIR)**. Based on your profile, keeping total monthly debt payments under **40% of net monthly income** guarantees access to prime interest rates with top-tier lenders.\n\n* **Immediate Step:** Audit existing recurring debts and prioritize retiring any obligation charging over 12% annual interest.\n* **Banking Leverage:** Once your credit score holds firmly above 750, you have the right to negotiate for zero processing fees and concessionary spreads.\n* **Cashflow Principle:** Always keep at least 3 to 6 months of basic living expenses in liquid sovereign or treasury equivalents before aggressive principal pre-payments.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Advisor Q&A error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to query financial advisor' });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Credex BFSI Server running on port ${port}`);
  });
}

startServer();
