# 💡 Solution Overview — GridWise AI

**IBM BoB AI Innovation Hackathon 2026 · Problem U2**

---

## Solution Name
**GridWise AI** — *Smarter Energy. Stronger Grid. Greener Future.*

---

## What We Built

GridWise AI is a complete, interactive, AI-powered web application that acts as a **decision-support platform** for electricity-grid operators. It addresses all five dimensions of Problem U2:

| Problem Dimension | GridWise AI Solution |
|---|---|
| Demand spike forecasting | Weighted Moving Average forecast + spike detection alerts |
| Load-balancing recommendations | Rule-based AI recommendation engine |
| Renewable performance anomaly detection | Z-score + threshold statistical detection |
| Root-cause analysis | Ranked probable causes with supporting evidence |
| Integrated operator brief | One-click 9-section printable report |

---

## How It Works

### Architecture Overview

```
User Browser
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                  GridWise AI (React SPA)             │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │          Simulation Data Engine                  │ │
│  │  48h × 30-min time-series · Seeded deterministic│ │
│  │  Scenario overrides (spike, underperformance)   │ │
│  └─────────────┬───────────────────────────────────┘ │
│                │                                      │
│  ┌─────────────▼───────────────────────────────────┐ │
│  │         SimulationContext (React Context)         │ │
│  │  Global reactive state · All derived data        │ │
│  │  Memoized computations · Scenario actions        │ │
│  └──┬──────────┬──────────┬──────────┬─────────────┘ │
│     │          │          │          │                │
│  ┌──▼──┐  ┌───▼──┐  ┌────▼──┐  ┌───▼──────────┐     │
│  │KPIs │  │Fore- │  │Anomaly│  │  AI Insights  │     │
│  │     │  │cast  │  │Detect │  │  (Rule NLG)  │     │
│  └──┬──┘  └───┬──┘  └────┬──┘  └───┬──────────┘     │
│     │          │          │          │                │
│  ┌──▼──────────▼──────────▼──────────▼─────────────┐ │
│  │              9 Page Components                    │ │
│  │  Overview · Forecast · Renewable · GridBalance    │ │
│  │  AIInsights · Curtailment · Brief · Simulation   │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Key Technical Decisions

### 1. Rule-Based AI (Transparent by Design)
We deliberately chose rule-based AI over black-box ML models for three reasons:
- **Explainability:** Every recommendation is traceable to specific data values and rules
- **Reliability:** Deterministic outputs — same data always produces same results
- **Hackathon scope:** No training data, API keys, or model hosting required

### 2. Seeded Deterministic Data
The simulation uses a seeded pseudo-random number generator (`seed = 42`) so data is identical on every render — no flickering KPIs or changing charts during a presentation.

### 3. Reactive Global State
`SimulationContext` uses `React.useMemo` for all derived computations. Triggering a scenario (e.g., demand spike) updates the multiplier → regenerates historical data → recomputes all KPIs, forecasts, anomalies, alerts, recommendations, curtailment, and operator brief simultaneously across all 9 pages.

### 4. Confidence Intervals
The demand forecast widens confidence bands from ±4% at 1 hour to ±13% at 24 hours — matching real-world forecast uncertainty growth, demonstrating AI transparency.

---

## AI Modules

### Demand Forecasting (`forecasting.js`)
- **Method:** Weighted Moving Average (WMA) of historical periods at the same hour
- **Factors:** Hour-of-day pattern, day-of-week adjustment, temperature coefficient
- **Output:** Point forecast + upper/lower confidence bounds

### Anomaly Detection (`anomalyDetection.js`)
- **Z-score method:** Flags if |z| > 2.5 (statistical outlier)
- **Threshold method:** Flags if actual < 70% of expected output
- **Output:** Anomaly objects with severity, deviation%, Z-score, type, possible causes

### Root-Cause Analysis (`aiInsights.js`)
- **Method:** Conditional ranking of pre-defined cause library
- **Solar causes:** Soiling, shading, inverter fault, string degradation, temperature, cloud cover, sensor drift
- **Wind causes:** Low wind speed, yaw misalignment, pitch control, gearbox, wake effect, icing, maintenance
- **Output:** Ranked probable causes with probability estimates and recommended actions

### Natural Language Generation (`aiInsights.js`)
- **Method:** Template-based NLG with live data interpolation
- **Modules:** Demand narrative, anomaly explanation, root-cause report, load-balancing recommendations, curtailment plan, operator brief sections
- **Chatbot:** 10 keyword patterns → data-driven responses

### Curtailment Analysis (`calculations.js`)
- **Formula:** `Curtailment = max(0, Available Renewable − Utilised Renewable)`
- **Recovery modelling:** 55% flex load, 25% storage, 15% interconnector, 5% unavoidable
- **Output:** Recovery potential by strategy, high-curtailment period identification

---

## User Interface

- **Design:** Dark navy (#0a0f1e) with green renewable accents, amber warnings, red critical
- **Responsive:** Works on desktop, tablet (768px+)
- **Components:** KPICard, AlertBadge, StatusIndicator, ChartWrapper, 4 Recharts chart components
- **Charts:** LineChart (demand forecast + CI), AreaChart (grid balance), ComposedChart (renewable performance), BarChart (curtailment), PieChart (generation mix)

---

## Expected Benefits

| Benefit | Mechanism |
|---|---|
| Earlier demand spike awareness | 6–24h ahead forecast with spike detection |
| Faster renewable fault detection | Statistical anomaly detection with severity ranking |
| Reduced curtailment | AI plan quantifying recovery potential |
| Better operator decisions | Integrated brief consolidating all findings |
| Improved planning | Curtailment period identification for scheduling |
| Transparent AI | All recommendations traceable to data and rules |

---

*See [architecture.md](architecture.md) for detailed technical architecture documentation.*
