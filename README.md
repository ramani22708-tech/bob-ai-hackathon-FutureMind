# ⚡ GridWise AI

> **Smarter Energy. Stronger Grid. Greener Future.**

An AI-powered grid optimisation and renewable energy performance platform built for the **IBM BoB AI Innovation Hackathon 2026**.

| Field | Value |
|---|---|
| **Team Name** | FutureMind |
| **Problem Statement** | U2 — Grid Load Optimisation & Renewable Energy Performance Advisor |
| **Industry** | Utilities — Power, Energy, Transmission & Distribution |
| **Hackathon** | IBM BoB AI Innovation Hackathon 2026 |

---

## 👥 Team

| Name | Role |
|---|---|
| Shruti Ramani | Team Lead — Full Stack Development, AI Integration |
| Team Member 2 | UI/UX Design, Frontend |
| Team Member 3 | Data Science, Forecasting Logic |
| Team Member 4 | Documentation, Testing, Presentation |

---

## 🎯 Problem Statement

Electricity-grid operators face growing challenges in balancing supply and demand as renewable energy sources (solar and wind) become a larger share of the generation mix. Unlike conventional power plants, renewables are weather-dependent and unpredictable — creating risks of demand spikes, generation shortfalls, and unnecessary curtailment of clean energy. Operators lack integrated, AI-assisted tools to forecast demand, detect renewable underperformance, and generate actionable optimisation plans in real time.

---

## 💡 Our Solution

**GridWise AI** is a web-based AI-powered decision-support platform that integrates demand forecasting, renewable asset monitoring, anomaly detection, root-cause analysis, and curtailment optimisation into a single operator dashboard. It uses rule-based AI to generate natural-language insights and prioritised recommendations — helping grid operators make faster, better-informed decisions without replacing human judgement.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **📊 Overview Dashboard** | 9 real-time KPI cards — demand, generation, renewable %, reserve margin, carbon intensity, curtailment |
| **📈 Demand Forecasting** | Weighted Moving Average forecast with hour-of-day, day-of-week, temperature factors + confidence intervals |
| **☀️💨 Renewable Performance** | 6 asset monitoring (3 solar, 3 wind) with performance ratios, anomaly flags, root-cause analysis |
| **⚖️ Grid Balance** | Real-time surplus/deficit gauge, generation mix donut chart, reserve margin indicator, risk period timeline |
| **🤖 AI Insights Chat** | Rule-based chatbot answering 20+ question patterns using live simulation data |
| **✂️ Curtailment Optimisation** | AI minimisation plan with flex-load, storage, interconnector strategies and recovery potential |
| **📋 Operator Brief** | One-click printable 9-section structured operational report (Sections A–I) |
| **🧪 Data Simulation** | Scenario controls — demand spike, solar/wind underperformance, grid constraint, CSV export |
| **▶ Demo Mode** | 10-step guided hackathon tour with automatic page navigation and scenario injection |

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | JavaScript (ES2022), JSX, CSS3 |
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite 4 |
| **Charts** | Recharts 2.8 |
| **Icons** | Inline SVG (custom) |
| **IBM Technologies** | IBM BoB (development platform) |
| **AI Approach** | Rule-Based AI — Z-score anomaly detection, Weighted Moving Average forecasting, Template-based NLG |
| **Data** | Simulated time-series (48h × 30-min intervals, 96 data points) |
| **Deployment** | Vite build → Static hosting (Vercel / GitHub Pages) |

---

## 📁 Repository Structure

```
gridwise-ai/
├── src/                          # All application source code
│   ├── main.jsx                  # React entry point
│   ├── App.jsx                   # Client-side routing + Demo Mode
│   ├── index.css                 # Complete dark-theme design system
│   ├── context/
│   │   └── SimulationContext.jsx # Global reactive state
│   ├── data/
│   │   ├── simulationData.js     # 48h time-series data generator
│   │   ├── assets.js             # 6 renewable asset definitions
│   │   └── alerts.js             # Dynamic alert engine
│   ├── utils/
│   │   ├── calculations.js       # All grid formulas (JSDoc'd)
│   │   ├── forecasting.js        # WMA demand forecast + CI
│   │   ├── anomalyDetection.js   # Z-score + threshold detection
│   │   └── aiInsights.js         # Rule-based NLG + chatbot
│   ├── components/
│   │   ├── Layout/               # Sidebar, Header, Layout
│   │   ├── Common/               # KPICard, AlertBadge, StatusIndicator
│   │   └── Charts/               # DemandChart, RenewableChart, GridBalanceChart, CurtailmentChart
│   └── pages/                    # 9 full application pages
│       ├── Overview.jsx
│       ├── DemandForecast.jsx
│       ├── RenewablePerformance.jsx
│       ├── GridBalance.jsx
│       ├── AIInsights.jsx
│       ├── CurtailmentOptimisation.jsx
│       ├── OperatorBrief.jsx
│       ├── DataSimulation.jsx
│       └── AboutProject.jsx
├── docs/                         # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                         # Demo artifacts
│   ├── demo-script.md            # Step-by-step demo walkthrough
│   ├── screenshots/              # App screenshots descriptions
│   ├── demo-video-link.txt       # Link to demo video
│   └── live-demo-url.txt         # Live deployment URL
├── presentation/                 # Hackathon slide deck
│   └── slides.html               # Complete HTML presentation
├── submission.yaml               # Structured submission metadata
├── package.json
├── vite.config.js
└── index.html
```

---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/ramani22708-tech/bob-ai-hackathon-FutureMind.git
cd bob-ai-hackathon-FutureMind

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

**No API keys or environment variables required** — all data is simulated locally.

---

## ▶ Demo Mode

Click **"▶ Start Demo Mode"** in the sidebar or header to launch the guided 10-step hackathon demonstration:

| Step | Page | Action |
|---|---|---|
| 1 | Overview | View 9 KPIs and live grid status |
| 2 | Demand Forecast | Explore AI forecast with confidence intervals |
| 3 | Renewable Performance | Review all 6 asset health cards |
| 4 | Data Simulation | Trigger demand spike scenario |
| 5 | Grid Balance | Observe reserve margin drop |
| 6 | Data Simulation | Trigger solar underperformance |
| 7 | Renewable Performance | View anomaly detection flags |
| 8 | Curtailment Optimisation | View AI minimisation plan |
| 9 | AI Insights | Ask the rule-based chatbot questions |
| 10 | Operator Brief | Generate printable operational report |

---

## 🧠 AI Transparency

GridWise AI uses **transparent rule-based AI** — all outputs are fully traceable:

| Module | Method |
|---|---|
| Anomaly Detection | Z-score (\|z\| > 2.5) + Threshold (actual < 70% expected) |
| Demand Forecasting | Weighted Moving Average + Hour/DOW/Temperature adjustment factors |
| Natural Language Generation | Template-based NLG with live data interpolation |
| Chatbot | Pattern-matched keyword routing (20+ patterns) |
| Recommendations | Conditional rule engine on grid state |
| Operator Brief | Structured template with live data injection |

**No generative AI, no black-box models, no external API calls.** All logic runs locally in the browser.

---

## 📸 Screenshots

See [`demo/screenshots/`](demo/screenshots/) for all screenshots.

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 📊 Presentation | [presentation/slides.html](presentation/slides.html) |
| 📋 Demo Script | [demo/demo-script.md](demo/demo-script.md) |

---

## ⚠️ Limitations

- All data is **simulated** — no connection to real power grid or live sensors
- AI uses **rule-based logic**, not a trained ML model or generative AI
- Forecasting uses historical simulation data, not real meteorological feeds
- Designed as a **prototype** for demonstration purposes only
- Not intended to control or automate real grid infrastructure

---

## 🏅 What We're Most Proud Of

The **integrated end-to-end experience** — from a demand spike triggering in Data Simulation, through anomaly detection flagging Solar Farm Alpha, to the Operator Brief generating a complete structured report with root-cause analysis and prioritised actions — all reactive, all connected, and all explainable. The entire workflow runs in the browser with zero external dependencies.

---

## ⚡ Disclaimer

All data is **simulated and generated programmatically** for demonstration purposes only. This application does not connect to any real power grid, live sensor, or production system. All AI recommendations are rule-based suggestions for qualified operators to review — not automated control instructions. Created for the IBM BoB AI Innovation Hackathon 2026.
