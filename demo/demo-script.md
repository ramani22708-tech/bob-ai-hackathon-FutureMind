# 🎬 Demo Script — GridWise AI

**IBM BoB AI Innovation Hackathon 2026 · Team FutureMind**
**Duration:** ~5–8 minutes | **Mode:** Live browser demo

---

## Before You Start

1. Open browser at `http://localhost:5173`
2. Ensure the app loads with the **Overview Dashboard**
3. Confirm top bar shows: `● LIVE SIM` and current time
4. Have the GitHub repo open in another tab: `https://github.com/ramani22708-tech/bob-ai-hackathon-FutureMind`

---

## Demo Steps

---

### 🟢 Step 1 — Overview Dashboard (45 seconds)

**Say:**
> "GridWise AI is an AI-powered decision support platform for electricity grid operators. On the Overview Dashboard, operators get an instant picture of the entire grid."

**Show:**
- Point to the **9 KPI cards** — Current Demand, Solar, Wind, Renewable %, Reserve Margin, Grid Balance, Curtailment, Carbon Intensity, Peak Demand
- Point to the **Demand vs Generation chart** on the left
- Point to the **Active Alerts** panel showing real alerts with severity badges
- Point to the **AI Recommendations** panel

**Say:**
> "Every number here is calculated live from our simulated 48-hour dataset — including the reserve margin, which tells us how much buffer we have before a supply shortage."

---

### 🟢 Step 2 — Demand Forecast (45 seconds)

**Navigate to:** `Demand Forecast` in sidebar

**Say:**
> "Grid operators need to plan hours ahead. Our AI demand forecast uses a Weighted Moving Average with hour-of-day patterns, day-of-week factors, and temperature adjustments."

**Show:**
- The **forecast chart** — solid blue line (historical) + dashed green line (forecast) + shaded confidence band
- Click **24h** → **12h** → **6h** horizon selectors — chart updates instantly
- Point to the **Peak Demand card** showing time and MW value
- Point to **MAE and RMSE** accuracy metrics

**Say:**
> "The confidence band widens from ±4% at one hour to ±13% at 24 hours — honestly reflecting increasing uncertainty, which is key for responsible AI."

---

### 🟢 Step 3 — Trigger Demand Spike (30 seconds)

**Navigate to:** `Data Simulation` in sidebar

**Say:**
> "Now let's simulate a real operational scenario — a demand spike."

**Click:** `🔴 Demand Spike (+28%)`

**Show:**
- The **⚡ SCENARIO ACTIVE** badge in the header
- The **active scenario status** card showing SPIKE
- Navigate back to **Overview** — show demand KPI jumped, reserve margin dropped, new critical alert appeared

**Say:**
> "Watch how every page updates simultaneously. The KPIs, alerts, recommendations, and forecast all respond to the scenario in real time."

---

### 🟢 Step 4 — Grid Balance (30 seconds)

**Navigate to:** `Grid Balance` in sidebar

**Say:**
> "The Grid Balance page shows the full supply-demand picture."

**Show:**
- The **Grid Balance gauge** — should show the impact of the demand spike
- The **Reserve Margin** card — likely showing "Below Minimum" with red badge
- The **Risk Period Timeline** — periods where reserve margin falls below 8%
- The **Generation Mix donut chart**

**Say:**
> "The reserve margin is now below our 8% safety target — a critical condition that requires immediate operator attention."

---

### 🟢 Step 5 — Trigger Solar Underperformance (30 seconds)

**Navigate to:** `Data Simulation` in sidebar

**Say:**
> "Now let's compound the challenge — let's simulate Solar Farm Alpha experiencing underperformance. This could be caused by panel soiling, cloud cover, or an equipment fault."

**Click:** `☀️ Solar Underperformance (−60%)`

**Show:** Both scenarios now active — Demand Spike + Solar Underperformance

---

### 🟢 Step 6 — Anomaly Detection (60 seconds)

**Navigate to:** `Renewable Performance` in sidebar

**Say:**
> "Our anomaly detection module has automatically flagged the underperformance."

**Show:**
- **Solar Farm Alpha card** with `⚠ ANOMALY` badge and warning status
- **Click on Solar Farm Alpha card** to expand the detail panel
- Show the **AI anomaly explanation** with Z-score, deviation %, and expected vs actual
- Show the **Root Cause Analysis** panel with ranked probable causes

**Say:**
> "The system detected this using Z-score statistical analysis — the output deviated more than 2.5 standard deviations from the mean. The AI then generates a ranked list of probable causes: panel soiling, partial shading, inverter fault — each with probability estimates and recommended verification steps."

- Scroll down to show the **Anomaly Detection table** with all detected anomalies

---

### 🟢 Step 7 — Curtailment Optimisation (45 seconds)

**Navigate to:** `Curtailment` in sidebar

**Say:**
> "Curtailment is one of the biggest wastes in renewable energy — it's when we have to switch off clean energy because the grid can't absorb it."

**Show:**
- **Total Curtailed** and **Curtailment %** KPI cards
- **Recoverable** vs **Unavoidable** split
- The **AI Curtailment Minimisation Plan** with 4 strategies
- Point to **Flexible Load Shifting** as Priority 1

**Say:**
> "GridWise AI has calculated that up to 80% of this curtailment is recoverable — primarily through rescheduling flexible industrial loads and dispatching grid-scale storage during high-renewable periods."

---

### 🟢 Step 8 — AI Insights Chat (45 seconds)

**Navigate to:** `AI Insights` in sidebar

**Say:**
> "Our AI Insights page combines everything into one place — and includes a conversational interface."

**Type in chat box:** `What actions do you recommend right now?`
→ Press Enter, show the response

**Click one example question button** (e.g., "What is the reserve margin?")
→ Show the data-driven response

**Say:**
> "This is rule-based AI — fully transparent. Every answer is traceable to specific calculations and data points. No generative AI, no hallucinations, no black-box responses."

---

### 🟢 Step 9 — Operator Brief (60 seconds)

**Navigate to:** `Operator Brief` in sidebar

**Say:**
> "Finally — the centrepiece of GridWise AI. With one click, we generate a complete structured operational report."

**Click:** `📋 Generate Operator Brief`

**Show the generated report:**
- **Header:** Grid status CRITICAL, 3 Critical Alerts
- **Section A:** Executive Summary with current state
- **Section B:** Demand & Load Summary
- **Section C:** Generation Mix
- **Section D:** Grid Balance
- **Section E:** Renewable Asset Performance
- **Section F:** Anomaly Detection Summary
- **Section G:** Curtailment Analysis
- **Section H:** AI Recommendations
- **Section I:** Outlook & Risk Summary

**Click:** `📋 Copy to Clipboard`

**Say:**
> "This report consolidates every finding — forecasts, anomalies, root causes, recommendations — into a single professional document that an operator can act on or forward to their team."

**Optional:** Click `🖨 Print / PDF` to show the print dialog

---

### 🏁 Closing (30 seconds)

**Say:**
> "GridWise AI demonstrates how AI can meaningfully assist electricity-grid operators — improving awareness of demand spikes, accelerating detection of renewable underperformance, reducing curtailment, and generating integrated decision support. All of this runs entirely in the browser with no external APIs, making it accessible, transparent, and reliable."

> "The entire solution was built using IBM BoB as our AI development platform, with React, Recharts, and rule-based AI algorithms. Thank you."

---

## Tips for Presenters

- Keep the **Demo Mode panel** closed for a cleaner presentation — use manual navigation instead
- Have the GitHub repo tab ready to show source code if judges ask
- If asked "Is this real AI?" — explain: *"It's rule-based AI — fully transparent, deterministic, and explainable. Every output traces to a specific calculation."*
- If asked about future improvements: *"Real ML forecasting using IBM watsonx.ai, live sensor integration, and mobile app for field engineers."*

---

## Reset Between Demos

Navigate to **Data Simulation** → Click **✅ Reset All** → All scenarios cleared, data returns to baseline.
