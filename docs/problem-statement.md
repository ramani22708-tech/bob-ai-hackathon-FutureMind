# 🎯 Problem Statement — GridWise AI

**IBM BoB AI Innovation Hackathon 2026**
**Problem Code:** U2 — Grid Load Optimisation & Renewable Energy Performance Advisor
**Industry:** Utilities — Power, Energy, Transmission & Distribution

---

## The Problem

### Background

Modern electricity grids are undergoing a fundamental transformation. The rapid growth of renewable energy sources — primarily solar photovoltaic and wind turbines — is reshaping how grid operators manage supply and demand. In many countries, renewables now contribute 30–60% of electricity generation, with targets to reach 70–80% by 2035.

This transition creates new, complex operational challenges that traditional grid management tools were not designed to handle.

### Core Challenges

#### 1. Demand Forecasting Complexity
Electricity demand fluctuates continuously based on time of day, day of week, temperature, industrial activity, and seasonal patterns. Grid operators must anticipate demand spikes — periods when consumption suddenly exceeds available generation — to avoid blackouts or emergency interventions. Traditional forecasting tools provide limited lead time and do not integrate AI-driven insights or natural-language explanations that non-specialist operators can act on.

#### 2. Renewable Energy Unpredictability
Unlike conventional gas or coal power stations that can be dispatched on demand, solar and wind generation depends entirely on weather conditions:
- **Solar** output depends on irradiance (cloud cover, time of day, season)
- **Wind** output depends on wind speed, direction, and turbine availability

This variability makes it difficult to predict how much renewable energy will be available at any given moment, complicating supply planning.

#### 3. Renewable Asset Underperformance Detection
When a solar farm or wind turbine underperforms relative to expected output, operators may not detect it promptly. Causes can range from panel soiling and equipment faults to grid curtailment or maintenance issues. Manual monitoring of individual assets across a large fleet is time-consuming and prone to missed alerts.

#### 4. Curtailment Waste
**Renewable curtailment** occurs when renewable energy that could be generated is intentionally reduced because the grid cannot absorb it — for example, during periods of low demand combined with high solar generation. Curtailment represents wasted clean energy and lost revenue. Operators need tools to identify curtailment opportunities and take action to reduce it through demand flexibility, storage dispatch, or generation rescheduling.

#### 5. Fragmented Decision Support
Current operational tools often present data in silos — demand forecasting in one system, asset monitoring in another, incident alerts in a third. Operators must manually synthesise information from multiple sources to make decisions, increasing cognitive load and response time during critical events.

---

## Who Is Affected?

| Stakeholder | Impact |
|---|---|
| **Grid Control Room Operators** | Must manage real-time imbalances with insufficient AI support |
| **Renewable Energy Asset Managers** | Cannot quickly detect and diagnose underperforming assets |
| **Grid Planning Engineers** | Lack integrated curtailment analysis for optimisation |
| **Energy Consumers** | Risk of supply interruptions during undetected demand spikes |
| **Society / Environment** | Curtailed renewable energy = wasted clean energy = higher carbon intensity |

---

## Problem Statement (Summary)

> Electricity-grid operators need better AI-powered decision support to:
> 1. Forecast electricity demand and detect upcoming spikes
> 2. Monitor renewable energy performance and detect anomalies
> 3. Identify root causes of renewable asset underperformance
> 4. Recommend load-balancing actions and curtailment-reduction strategies
> 5. Generate integrated operator briefs that consolidate all findings into actionable plans

Without these capabilities, operators face increased risk of supply-demand imbalances, higher curtailment of clean energy, slower incident response, and suboptimal grid operation.

---

## Scale of the Problem

- Global renewable curtailment reached an estimated **50–100 TWh/year** in leading renewable markets
- A 1% reduction in curtailment in a medium-sized grid can recover hundreds of MWh annually
- Demand spike events that exceed available generation capacity can cost millions in emergency interventions
- The integration of AI forecasting can reduce forecast error by 20–40% compared to manual methods

---

*This problem statement is the foundation for GridWise AI — see [solution-overview.md](solution-overview.md) for our proposed solution.*
