# 🏗️ Architecture — GridWise AI

**IBM BoB AI Innovation Hackathon 2026 · Problem U2**

---

## System Architecture

GridWise AI is a **single-page React application** with no backend server. All logic, data generation, AI computations, and UI rendering run entirely in the user's browser.

```
┌──────────────────────────────────────────────────────────────────┐
│                        User's Browser                             │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                     React Application                       │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │              DATA LAYER                               │   │   │
│  │  │                                                        │   │   │
│  │  │  simulationData.js   assets.js   alerts.js           │   │   │
│  │  │  ─────────────────   ─────────   ──────────          │   │   │
│  │  │  48h × 30-min        6 renewable  Dynamic alert      │   │   │
│  │  │  time-series         asset defs   generation         │   │   │
│  │  │  Seeded RNG (42)     Solar×3      BASE_ALERTS +      │   │   │
│  │  │  Scenario overrides  Wind×3       scenario alerts    │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                           │                                  │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │              COMPUTATION LAYER                        │   │   │
│  │  │                                                        │   │   │
│  │  │  calculations.js    forecasting.js                   │   │   │
│  │  │  ────────────────   ───────────────                  │   │   │
│  │  │  totalGeneration()  generateDemandForecast()         │   │   │
│  │  │  performanceRatio() buildForecastChartSeries()       │   │   │
│  │  │  curtailment()      WMA + Hour/DOW/Temp factors      │   │   │
│  │  │  reserveMargin()    Confidence intervals ±4%→±13%    │   │   │
│  │  │  carbonIntensity()                                   │   │   │
│  │  │  computeGridBalance()   anomalyDetection.js          │   │   │
│  │  │  computeCurtailmentSeries()  ─────────────────       │   │   │
│  │  │                         detectSolarAnomalies()       │   │   │
│  │  │                         detectWindAnomalies()        │   │   │
│  │  │                         Z-score |z| > 2.5           │   │   │
│  │  │                         Threshold < 70% expected     │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                           │                                  │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │              AI LAYER (Rule-Based NLG)                │   │   │
│  │  │                                                        │   │   │
│  │  │  aiInsights.js                                       │   │   │
│  │  │  ──────────────────────────────────                  │   │   │
│  │  │  generateDemandInsight()                             │   │   │
│  │  │  generateAnomalyExplanation()                        │   │   │
│  │  │  generateRootCauseAnalysis()                         │   │   │
│  │  │  generateLoadBalancingRecommendations()              │   │   │
│  │  │  generateCurtailmentPlan()                           │   │   │
│  │  │  generateOperatorBrief()                             │   │   │
│  │  │  answerQuestion() — 10 pattern chatbot               │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                           │                                  │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │           STATE MANAGEMENT LAYER                      │   │   │
│  │  │                                                        │   │   │
│  │  │  SimulationContext.jsx (React Context + useMemo)      │   │   │
│  │  │  ──────────────────────────────────────────────       │   │   │
│  │  │  demandLevel  solarPerformance  windPerformance       │   │   │
│  │  │  gridConstraint  timeRange  forecastHorizon           │   │   │
│  │  │  demoMode  demoStep                                  │   │   │
│  │  │                                                        │   │   │
│  │  │  Computed: historicalData, kpis, forecastResult,     │   │   │
│  │  │  anomalies, allAlerts, gridBalance, curtailmentData, │   │   │
│  │  │  assetPerformance, recommendations, operatorBrief    │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                           │                                  │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │              UI LAYER                                 │   │   │
│  │  │                                                        │   │   │
│  │  │  Layout: Sidebar · Header · Layout                   │   │   │
│  │  │  Common: KPICard · AlertBadge · StatusIndicator      │   │   │
│  │  │  Charts: DemandChart · RenewableChart                │   │   │
│  │  │          GridBalanceChart · CurtailmentChart         │   │   │
│  │  │  Pages:  Overview · DemandForecast · Renewable       │   │   │
│  │  │          GridBalance · AIInsights · Curtailment      │   │   │
│  │  │          OperatorBrief · DataSimulation · About      │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User triggers scenario (e.g., "Demand Spike")
        │
        ▼
SimulationContext: setDemandLevel('spike')
        │
        ▼
simulationOverrides = { demandMultiplier: 1.28, ... }
        │
        ▼
generateHistoricalData(overrides) → 96 data points regenerated
        │
        ├──► computeKPIs()          → currentDemand, peakDemand, reserveMargin...
        ├──► generateDemandForecast() → forecast[], upper[], lower[], metadata
        ├──► runAllDetectors()       → anomalies[]
        ├──► generateDynamicAlerts() → allAlerts[] (includes d001: critical spike)
        ├──► computeGridBalance()    → surplus, reserveMargin, status
        ├──► computeCurtailmentSeries() → curtailmentData[]
        ├──► computeAssetGeneration() → assetPerformance[]
        ├──► generateLoadBalancingRecommendations() → recommendations[]
        ├──► generateCurtailmentPlan() → curtailmentPlan{}
        └──► generateOperatorBrief()  → operatorBrief{}
                │
                ▼
    All 9 pages re-render with updated data simultaneously
```

---

## Component Tree

```
App
└── SimulationProvider
    └── Layout
        ├── Sidebar (IBM BoB badge, navigation, alert count, Demo Mode button)
        ├── Header (IBM BoB badge, page title, scenario indicator, alerts, clock)
        └── [Active Page]
            ├── Overview
            │   ├── KPICard × 9
            │   ├── GridBalanceChart
            │   ├── Active Alerts panel
            │   ├── AI Recommendations panel
            │   ├── CurtailmentTrendLine
            │   └── Asset Health table
            ├── DemandForecast
            │   ├── Forecast horizon selector
            │   ├── DemandChart (LineChart + CI bands + peak reference)
            │   ├── AI Demand Narrative
            │   ├── Spike Detection panel
            │   └── Forecast Factors panel
            ├── RenewablePerformance
            │   ├── AssetCard × 6 (clickable)
            │   ├── Asset Detail Panel (conditional)
            │   │   ├── Metrics grid
            │   │   └── AI RCA panel
            │   ├── AssetPerformanceBarChart
            │   └── Anomaly table
            ├── GridBalance
            │   ├── Balance gauge + Reserve margin + Generation breakdown
            │   ├── GridBalanceChart (AreaChart)
            │   ├── GenerationMixDonut (PieChart)
            │   └── Risk Period Timeline
            ├── AIInsights
            │   ├── Chat interface (input + messages + example questions)
            │   ├── Demand Narrative card
            │   ├── Grid Balance Assessment card
            │   ├── Anomaly Summary card
            │   └── Load Balancing Recommendations panel
            ├── CurtailmentOptimisation
            │   ├── KPI cards (total, %, recoverable, unavoidable)
            │   ├── CurtailmentChart (BarChart)
            │   ├── AI Minimisation Plan panel
            │   ├── Period Analysis panel
            │   └── Curtailment Data table
            ├── OperatorBrief
            │   ├── Generate / Print / Copy buttons
            │   ├── Brief Header (grid status, summary stats)
            │   └── Sections A–I
            ├── DataSimulation
            │   ├── Scenario buttons (spike, underperformance, reset)
            │   ├── State summary cards
            │   ├── Time range selector
            │   ├── KPI summary table
            │   └── Raw data table + CSV export
            └── AboutProject
```

---

## File Structure

```
src/
├── main.jsx                    Entry point — mounts React app
├── App.jsx                     Page routing + Demo Mode floating panel
├── index.css                   CSS custom properties + all component styles
├── context/
│   └── SimulationContext.jsx   Global state: 20+ computed values, 15+ actions
├── data/
│   ├── simulationData.js       generateHistoricalData(), generateForecast(), computeKPIs()
│   ├── assets.js               ASSETS[], computeAssetGeneration(), getFleetStats()
│   └── alerts.js               BASE_ALERTS[], generateDynamicAlerts(), countBySeverity()
├── utils/
│   ├── calculations.js         8 pure calculation functions with JSDoc
│   ├── forecasting.js          generateDemandForecast(), buildForecastChartSeries()
│   ├── anomalyDetection.js     detectSolarAnomalies(), detectWindAnomalies(), runAllDetectors()
│   └── aiInsights.js           6 NLG functions + answerQuestion() chatbot
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx         Navigation + IBM BoB badge + Demo Mode trigger
│   │   ├── Header.jsx          Page info + IBM BoB badge + scenario/alert indicators
│   │   └── Layout.jsx          Sidebar + Header + main content wrapper
│   ├── Common/
│   │   ├── KPICard.jsx         Reusable metric card with trend indicator
│   │   ├── AlertBadge.jsx      Severity-coloured badge
│   │   ├── StatusIndicator.jsx Colour dot + label
│   │   ├── ChartWrapper.jsx    Card with title/subtitle for chart containers
│   │   └── LoadingSpinner.jsx  CSS spinner
│   └── Charts/
│       ├── DemandChart.jsx     Recharts LineChart: historical + forecast + CI bands
│       ├── RenewableChart.jsx  Recharts ComposedChart: actual vs expected bars + line
│       ├── GridBalanceChart.jsx Recharts AreaChart + PieChart (generation mix)
│       └── CurtailmentChart.jsx Recharts BarChart + trend line
└── pages/
    ├── Overview.jsx
    ├── DemandForecast.jsx
    ├── RenewablePerformance.jsx
    ├── GridBalance.jsx
    ├── AIInsights.jsx
    ├── CurtailmentOptimisation.jsx
    ├── OperatorBrief.jsx
    ├── DataSimulation.jsx
    └── AboutProject.jsx
```

---

## Technology Choices

| Decision | Choice | Rationale |
|---|---|---|
| Frontend framework | React 18 | Component model, hooks, context API |
| Build tool | Vite 4 | Fast HMR, simple config, no ejection |
| Charts | Recharts | React-native, composable, dark-theme friendly |
| State management | React Context + useMemo | No Redux needed for single SPA |
| AI approach | Rule-based | Transparent, no API keys, explainable |
| Data | Seeded simulation | Deterministic, no backend, hackathon-appropriate |
| Styling | Plain CSS custom properties | No Tailwind dependency, full control |
| Icons | Inline SVG | Zero import, zero dependency |

---

## Performance Notes

- All data computed on first render via `useMemo` — subsequent renders use cached values
- Scenario changes invalidate only affected memo dependencies — not full recompute
- 96 data points × ~15 computed fields = ~1,440 values per simulation state
- Build output: ~720KB JS (gzipped: ~196KB) — acceptable for a hackathon prototype
