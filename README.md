# GridWise AI ⚡

> **Smarter Energy. Stronger Grid. Greener Future.**

A full-stack AI-powered grid optimisation prototype built for the **IBM BoB AI Innovation Hackathon 2026**.

**Problem:** U2 — Grid Load Optimisation & Renewable Energy Performance Advisor  
**Industry:** Utilities — Power, Energy, Transmission & Distribution

---

## 🚀 Quick Start

```bash
cd gridwise-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app will launch automatically.

---

## 📁 Project Structure

```
gridwise-ai/
├── index.html              # Vite entry point
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx            # React root
│   ├── App.jsx             # Routing + Demo Mode
│   ├── index.css           # Complete design system (CSS variables)
│   ├── context/
│   │   └── SimulationContext.jsx   # Global state + computed data
│   ├── data/
│   │   ├── simulationData.js       # 48h time-series generator
│   │   ├── assets.js               # 6 renewable asset definitions
│   │   └── alerts.js               # Alert definitions + dynamic generation
│   ├── utils/
│   │   ├── calculations.js         # Grid formulas (balance, curtailment, etc.)
│   │   ├── forecasting.js          # WMA demand forecast with CI
│   │   ├── anomalyDetection.js     # Z-score + threshold anomaly detection
│   │   └── aiInsights.js           # Rule-based NLG + chatbot
│   ├── components/
│   │   ├── Layout/         # Sidebar, Header, Layout
│   │   ├── Common/         # KPICard, AlertBadge, StatusIndicator, etc.
│   │   └── Charts/         # DemandChart, RenewableChart, GridBalanceChart, CurtailmentChart
│   └── pages/
│       ├── Overview.jsx
│       ├── DemandForecast.jsx
│       ├── RenewablePerformance.jsx
│       ├── GridBalance.jsx
│       ├── AIInsights.jsx
│       ├── CurtailmentOptimisation.jsx
│       ├── OperatorBrief.jsx
│       ├── DataSimulation.jsx
│       └── AboutProject.jsx
```

---

## ✨ Features

| Feature | Description |
|---|---|
| **Overview Dashboard** | 9 KPI cards, live demand vs generation chart, active alerts, AI recommendations |
| **Demand Forecasting** | Weighted moving average + temperature/DOW factors, confidence intervals |
| **Renewable Performance** | 6 assets (3 solar, 3 wind), performance ratios, anomaly detection |
| **Grid Balance** | Real-time surplus/deficit gauge, generation mix donut, reserve margin |
| **AI Insights** | Rule-based chatbot, demand/anomaly narrative, load balancing recommendations |
| **Curtailment Optimisation** | AI minimisation plan: flex load, storage, interconnector strategies |
| **Operator Brief** | Printable 9-section structured report, copy to clipboard |
| **Data Simulation** | Scenario triggers (demand spike, solar/wind underperformance), CSV export |
| **Demo Mode** | 10-step guided tour with automatic page navigation and scenario triggers |

---

## 🧠 AI Transparency

GridWise AI uses **rule-based AI** — transparent, deterministic algorithms:

- **Anomaly Detection:** Z-score (|z| > 2.5) + Threshold (actual < 70% expected)
- **Demand Forecasting:** Weighted Moving Average + Hour-of-day/Day-of-week/Temperature factors
- **Insights Generation:** Template-based NLG with live data interpolation
- **Chatbot:** Pattern-matched keyword routing with data-driven responses

All AI outputs are traceable to data and rules — no black-box models.

---

## 🎨 Design System

CSS custom properties (`src/index.css`):

```css
--bg-primary: #0a0f1e        /* deep navy */
--accent-green: #00e676      /* renewable/positive */
--accent-blue: #2196f3       /* primary accent */
--accent-amber: #ffc107      /* warnings */
--accent-red: #f44336        /* critical */
--accent-purple: #9c27b0     /* AI features */
```

---

## ⚠️ Disclaimer

All data is **simulated and generated programmatically** for demonstration purposes only. This application does not connect to any real power grid or live data source. Created for the IBM BoB AI Innovation Hackathon 2026.
