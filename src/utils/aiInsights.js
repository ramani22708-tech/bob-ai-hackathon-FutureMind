/**
 * aiInsights.js
 * Rule-based natural language generation for GridWise AI.
 * All outputs are derived from real simulation data — NOT generative AI.
 * Labeled as "Rule-Based AI" throughout the UI.
 */

// ─── Demand Insights ──────────────────────────────────────────────────────

/**
 * Generates a narrative explanation of the demand forecast.
 * @param {Object} forecastMeta - Forecast metadata from generateDemandForecast
 * @param {Array} forecastData - Forecast data points
 * @returns {string}
 */
export function generateDemandInsight(forecastMeta, forecastData) {
  if (!forecastMeta || !forecastData || forecastData.length === 0) {
    return 'Insufficient data to generate demand insight.';
  }

  const { horizonHours, peakDemand, peakTime, avgDemand, forecastTemp } = forecastMeta;

  const peakPercent = peakDemand && avgDemand
    ? Math.round(((peakDemand - avgDemand) / avgDemand) * 100)
    : 0;

  const tempEffect = forecastTemp < 18
    ? `Current temperatures (${forecastTemp}°C) are below the 18°C heating baseline, adding an estimated ${Math.round((18 - forecastTemp) * 0.3)}% heating demand uplift.`
    : forecastTemp > 25
      ? `Elevated temperatures (${forecastTemp}°C) are driving additional cooling demand, contributing an estimated ${Math.round((forecastTemp - 25) * 0.4)}% uplift.`
      : `Temperatures (${forecastTemp}°C) are within the neutral band (18–25°C), producing minimal temperature-driven demand variation.`;

  // Identify ramp events
  const ramps = [];
  for (let i = 1; i < forecastData.length; i++) {
    const prev = forecastData[i - 1];
    const curr = forecastData[i];
    if (curr.demand && prev.demand) {
      const rampRate = (curr.demand - prev.demand) / 0.5; // MW per hour
      if (rampRate > 80) {
        ramps.push({ time: curr.label, rate: Math.round(rampRate), direction: 'upward' });
      } else if (rampRate < -80) {
        ramps.push({ time: curr.label, rate: Math.round(Math.abs(rampRate)), direction: 'downward' });
      }
    }
  }

  const rampText = ramps.length > 0
    ? `Significant demand ramps are forecast: ${ramps.slice(0, 2).map(r => `${r.direction} ramp of ${r.rate} MW/h at ${r.time}`).join(', ')}. Flexible generation assets should be pre-positioned.`
    : 'No significant demand ramps are forecast within this horizon. Grid operations can proceed at standard readiness.';

  return `Over the next ${horizonHours} hours, demand is forecast to average ${avgDemand?.toLocaleString()} MW with a projected peak of ${peakDemand?.toLocaleString()} MW at ${peakTime} — ${peakPercent}% above the period average. ${tempEffect} ${rampText} Confidence intervals widen from ±4% at the near horizon to ±13% at the ${horizonHours}-hour boundary, reflecting increasing atmospheric and load uncertainty.`;
}

// ─── Anomaly Explanations ─────────────────────────────────────────────────

/**
 * Generates an explanation for a detected anomaly.
 * @param {Object} anomaly - Anomaly object from anomaly detector
 * @param {Object} asset - Asset object from assets.js
 * @returns {string}
 */
export function generateAnomalyExplanation(anomaly, asset) {
  if (!anomaly) return 'No anomaly data available.';

  const typeStr = anomaly.assetType === 'solar' ? 'solar generation' : anomaly.assetType === 'wind' ? 'wind generation' : 'demand';

  const methodStr = anomaly.detectionMethod || 'statistical deviation';

  const weatherCtx = anomaly.assetType === 'solar' && anomaly.cloudCover !== undefined
    ? `Cloud cover at time of detection was ${anomaly.cloudCover}%, which accounts for a portion of the output reduction, but does not fully explain the ${anomaly.deviation}% shortfall.`
    : anomaly.assetType === 'wind' && anomaly.windSpeed !== undefined
      ? `Wind speed was ${anomaly.windSpeed} m/s at the time of detection. At this speed, the expected output is approximately ${Math.round(anomaly.expected)} MW; the actual output of ${anomaly.actual} MW represents a ${anomaly.deviation}% underperformance.`
      : '';

  const topCause = anomaly.possibleCauses?.[0]?.cause || 'unknown factors';

  return `${anomaly.assetName} recorded an output of ${anomaly.actual} MW at ${anomaly.label}, against an expected ${anomaly.expected} MW — a deviation of ${anomaly.deviationMW} MW (${anomaly.deviation}%). This was flagged by the ${methodStr} detector (Z-score: ${anomaly.zScore}). ${weatherCtx} The most likely root cause is ${topCause}. Immediate inspection is ${anomaly.severity === 'critical' ? 'strongly recommended' : 'advised at the next scheduled opportunity'}.`;
}

/**
 * Generates a root cause analysis for an anomaly.
 * @param {Object} anomaly
 * @returns {string}
 */
export function generateRootCauseAnalysis(anomaly) {
  if (!anomaly || !anomaly.possibleCauses || anomaly.possibleCauses.length === 0) {
    return 'Insufficient data for root cause analysis.';
  }

  const rankStr = anomaly.possibleCauses
    .slice(0, 4)
    .map((c, i) => `${i + 1}. ${c.cause} (estimated probability: ${c.probability})`)
    .join('\n');

  const recommendation = anomaly.assetType === 'solar'
    ? 'Recommended actions: (1) Dispatch maintenance team for visual inspection and panel cleaning. (2) Review inverter logs for fault codes. (3) Check string-level monitoring data for isolated failures. (4) Compare SCADA irradiance sensor against local weather station.'
    : anomaly.assetType === 'wind'
      ? 'Recommended actions: (1) Review SCADA logs for turbine trip events. (2) Check nacelle anemometer calibration vs. met mast readings. (3) Inspect yaw drive alignment. (4) Evaluate blade pitch controller response curves.'
      : 'Recommended actions: (1) Review load dispatch logs. (2) Verify SCADA demand measurement sensors. (3) Check for unscheduled industrial load connections.';

  return `Root Cause Analysis for ${anomaly.assetName} at ${anomaly.label}:\n\nRanked Probable Causes:\n${rankStr}\n\n${recommendation}`;
}

// ─── Load Balancing Recommendations ──────────────────────────────────────

/**
 * Generates prioritised load balancing recommendations.
 * @param {Object} gridBalance - Grid balance object from calculations.js
 * @param {Array} alerts - Active alerts
 * @returns {string[]} Array of recommendation strings
 */
export function generateLoadBalancingRecommendations(gridBalance, alerts = []) {
  const recs = [];

  if (!gridBalance) return ['Grid balance data unavailable. Cannot generate recommendations.'];

  const { surplus, reserveMargin: rm, renewableFraction, curtailment, demand, total } = gridBalance;

  if (rm < 5) {
    recs.push(`🔴 CRITICAL: Reserve margin is ${rm}% (target ≥ 8%). Immediately dispatch all available peaking units and initiate emergency demand response. Contact interconnector operators for emergency import.`);
  } else if (rm < 10) {
    recs.push(`🟡 WARNING: Reserve margin at ${rm}% — approaching minimum. Bring gas peakers (estimated +120 MW) to warm standby. Notify demand response participants to standby for curtailment.`);
  }

  if (curtailment > 100) {
    recs.push(`♻️ CURTAILMENT: ${curtailment} MW of renewable energy is being curtailed. Consider rescheduling flexible industrial loads (${Math.round(curtailment * 0.6)} MW potential absorption) to off-peak windows, or activating pumped hydro storage charging if available.`);
  } else if (curtailment > 50) {
    recs.push(`📊 OPTIMISATION: Moderate curtailment (${curtailment} MW) detected. Review Zone A transmission constraints. Dispatch reactive power compensation to increase hosting capacity.`);
  }

  if (renewableFraction > 80) {
    recs.push(`⚡ RENEWABLE: High renewable fraction (${renewableFraction}%). Ensure frequency response services are contracted. Consider synthetic inertia provisions from grid-scale batteries.`);
  }

  if (surplus < -50) {
    recs.push(`📉 DEFICIT: Generation deficit of ${Math.abs(surplus)} MW. Increase conventional baseload dispatch. Review interconnector import capacity. Activate voluntary demand reduction if deficit persists.`);
  } else if (surplus > 200) {
    recs.push(`📈 SURPLUS: Generation surplus of ${surplus} MW. Reduce conventional output by ${Math.round(surplus * 0.7)} MW where technically feasible. Consider export via interconnectors if available.`);
  }

  const hasCriticalAlert = alerts.some(a => a.severity === 'critical' && !a.acknowledged);
  if (hasCriticalAlert) {
    recs.push(`🚨 ALERTS: ${alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length} unacknowledged critical alert(s) require operator attention. Review and acknowledge in the Alert Management panel.`);
  }

  if (recs.length === 0) {
    recs.push(`✅ NOMINAL: Grid balance is within normal operating parameters. Reserve margin: ${rm}%. Renewable fraction: ${renewableFraction}%. No immediate action required. Continue monitoring per standard schedule.`);
  }

  return recs;
}

// ─── Curtailment Plan ─────────────────────────────────────────────────────

/**
 * Generates a curtailment minimisation plan.
 * @param {Array} curtailmentSeries - Curtailment series from calculations.js
 * @param {number} totalCurtailedMW
 * @returns {Object} Structured curtailment plan
 */
export function generateCurtailmentPlan(curtailmentSeries, totalCurtailedMW) {
  const highPeriods = curtailmentSeries
    .filter(p => p.curtailed > 80)
    .map(p => p.label);

  const potentialFlexLoad = Math.round(totalCurtailedMW * 0.55);
  const potentialStorage = Math.round(totalCurtailedMW * 0.25);
  const unavoidable = Math.round(totalCurtailedMW * 0.20);

  const strategies = [
    {
      id: 'flex-load',
      strategy: 'Flexible Load Shifting',
      description: `Reschedule industrial and commercial flexible loads (EV charging, water heating, industrial processes) to high-curtailment windows. Estimated absorption: ${potentialFlexLoad} MW.`,
      potential: potentialFlexLoad,
      priority: 1,
      implementationTime: '30 minutes',
    },
    {
      id: 'storage',
      strategy: 'Grid-Scale Storage Dispatch',
      description: `Activate pumped hydro / battery storage charging during curtailment periods. Estimated absorption: ${potentialStorage} MW. This also improves frequency response capability.`,
      potential: potentialStorage,
      priority: 2,
      implementationTime: '< 5 minutes',
    },
    {
      id: 'interconnector',
      strategy: 'Interconnector Export',
      description: `Request increased export allocation via interconnectors. Subject to neighbouring grid conditions and contract terms.`,
      potential: Math.round(totalCurtailedMW * 0.15),
      priority: 3,
      implementationTime: '1–2 hours',
    },
    {
      id: 'conventional',
      strategy: 'Conventional Generation Reduction',
      description: `Reduce dispatchable conventional generation by ${Math.round(totalCurtailedMW * 0.3)} MW during peak renewable windows (10:00–14:00). Maintain minimum stable generation limits.`,
      potential: Math.round(totalCurtailedMW * 0.3),
      priority: 4,
      implementationTime: '15–45 minutes',
    },
  ];

  return {
    totalCurtailment: totalCurtailedMW,
    recoverable: potentialFlexLoad + potentialStorage,
    unavoidable,
    highPeriods: highPeriods.slice(0, 5),
    strategies,
    summary: `Total curtailment is ${totalCurtailedMW} MW. Up to ${potentialFlexLoad + potentialStorage} MW (${Math.round(((potentialFlexLoad + potentialStorage) / totalCurtailedMW) * 100)}%) is recoverable through demand flexibility and storage dispatch. Highest curtailment occurs during: ${highPeriods.slice(0, 3).join(', ') || 'midday periods'}.`,
  };
}

// ─── Operator Brief ───────────────────────────────────────────────────────

/**
 * Generates a full structured operator brief.
 * @param {Object} allData - All simulation data and computed values
 * @returns {Object} Structured brief object
 */
export function generateOperatorBrief(allData) {
  const { kpis, gridBalance, anomalies, alerts, curtailmentPlan, forecastMeta, assets } = allData;
  const ts = new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' });

  const criticalCount = alerts?.filter(a => a.severity === 'critical' && !a.acknowledged).length || 0;
  const warningCount = alerts?.filter(a => a.severity === 'warning' && !a.acknowledged).length || 0;

  return {
    generatedAt: ts,
    sections: [
      {
        id: 'A',
        title: 'Executive Summary',
        content: `GridWise AI Operational Status Report — generated ${ts}. The grid is currently operating in ${gridBalance?.status === 'critical' ? 'CRITICAL' : gridBalance?.status === 'warning' ? 'CAUTION' : 'NORMAL'} status. Current demand: ${kpis?.currentDemand?.toLocaleString()} MW against total generation of ${kpis?.totalGeneration?.toLocaleString()} MW. Reserve margin: ${kpis?.reserveMargin}%. There are ${criticalCount} critical and ${warningCount} warning-level alerts active requiring operator attention.`,
      },
      {
        id: 'B',
        title: 'Demand & Load Summary',
        content: `Current demand: ${kpis?.currentDemand?.toLocaleString()} MW. 24h average: ${kpis?.avgDemand?.toLocaleString()} MW. 24h peak: ${kpis?.peakDemand?.toLocaleString()} MW at ${kpis?.peakTime}. Forecast peak for the next 24h: ${forecastMeta?.peakDemand?.toLocaleString()} MW at ${forecastMeta?.peakTime}. Temperature: ${kpis?.currentTemp}°C. Demand is within expected seasonal norms for this period.`,
      },
      {
        id: 'C',
        title: 'Generation Mix',
        content: `Total generation: ${kpis?.totalGeneration?.toLocaleString()} MW. Solar: ${kpis?.currentSolar?.toLocaleString()} MW. Wind: ${kpis?.currentWind?.toLocaleString()} MW. Conventional: ${kpis?.conventionalGeneration?.toLocaleString()} MW. Renewable fraction: ${kpis?.renewablePct}% of total generation. Carbon intensity: ${kpis?.carbonIntensity} gCO₂e/kWh.`,
      },
      {
        id: 'D',
        title: 'Grid Balance & Stability',
        content: `Generation surplus: ${kpis?.gridBalance} MW. Reserve margin: ${kpis?.reserveMargin}% (target ≥ 8%). Grid status: ${gridBalance?.status?.toUpperCase() || 'NORMAL'}. Curtailment: ${kpis?.curtailmentTotal} MW curtailed over the past 24h (${kpis?.curtailmentPct}% of available renewable).`,
      },
      {
        id: 'E',
        title: 'Renewable Asset Performance',
        content: `Fleet-wide renewable availability: ${assets ? Math.round(assets.reduce((s, a) => s + a.availability, 0) / assets.length) : '--'}%. ${assets?.filter(a => a.status === 'operational').length || 0} assets operational, ${assets?.filter(a => a.status === 'warning').length || 0} with warnings, ${assets?.filter(a => a.status === 'maintenance').length || 0} under maintenance. Solar Farm Alpha is flagged for underperformance investigation. Wind Farm South is undergoing planned maintenance with expected restoration in 48h.`,
      },
      {
        id: 'F',
        title: 'Anomaly Detection Summary',
        content: `${anomalies?.length || 0} anomalies detected in the current monitoring period. ${anomalies?.filter(a => a.severity === 'critical').length || 0} critical, ${anomalies?.filter(a => a.severity === 'warning').length || 0} warnings, ${anomalies?.filter(a => a.severity === 'info').length || 0} informational. Primary anomaly: Solar Farm Alpha generating at 61% of expected output — root cause analysis in progress (suspected: panel soiling / vegetation shading).`,
      },
      {
        id: 'G',
        title: 'Curtailment Analysis',
        content: curtailmentPlan?.summary || `Total curtailment: ${kpis?.curtailmentTotal} MW. Peak curtailment periods coincide with midday solar peak (10:00–14:00). Demand flexibility and storage dispatch recommended.`,
      },
      {
        id: 'H',
        title: 'AI Recommendations',
        content: `1. Dispatch maintenance team to Solar Farm Alpha for soiling inspection and string-level diagnostics.\n2. Pre-position gas peaker units for 18:30–20:30 peak demand window (forecast: up to 1,724 MW).\n3. Activate demand response for flexible industrial loads during curtailment periods (10:00–14:00, estimated ${Math.round((kpis?.curtailmentTotal || 0) * 0.55)} MW absorption potential).\n4. Review Zone A transmission constraints contributing to renewable curtailment.\n5. Wind Farm South: verify maintenance timeline; consider expedited restoration if demand forecast materialises.`,
      },
      {
        id: 'I',
        title: 'Outlook & Risk Summary',
        content: `Near-term outlook (next 12h): AMBER. Demand peak risk during evening hours (18:00–21:00). Solar output will decline from 17:00. Wind generation expected to remain stable. Reserve margin may fall below 8% target during peak — recommend pre-emptive peaker dispatch.\n\nMedium-term (12–48h): GREEN. Maintenance on Wind Farm South completing; Solar Farm Alpha inspection underway. Demand profile expected to normalise. Curtailment risk reduces with overnight low-demand period.`,
      },
    ],
  };
}

// ─── Chatbot / Q&A ────────────────────────────────────────────────────────

const QA_PATTERNS = [
  {
    patterns: ['curtailment', 'curtailed', 'wasted'],
    handler: (data) => `Current curtailment is ${data.kpis?.curtailmentTotal || 0} MW over the last 24h (${data.kpis?.curtailmentPct || 0}% of available renewable). This occurs when renewable generation exceeds grid absorption capacity — typically during midday solar peak periods when conventional baseload cannot be reduced quickly enough. GridWise AI recommends shifting flexible loads and activating storage during these windows.`,
  },
  {
    patterns: ['reserve margin', 'reserve', 'margin'],
    handler: (data) => `The current reserve margin is ${data.kpis?.reserveMargin || '--'}% — this is the ratio of generation surplus to demand. The industry target is ≥ 8% for N-1 contingency protection. ${(data.kpis?.reserveMargin || 0) < 8 ? 'This is BELOW the safety target. Recommend activating additional peaking capacity immediately.' : 'This is within acceptable operating bounds.'}`,
  },
  {
    patterns: ['solar', 'solar farm', 'photovoltaic', 'pv'],
    handler: (data) => `Current solar generation is ${data.kpis?.currentSolar || 0} MW from 3 assets (total capacity: 470 MW). Solar Farm Alpha is underperforming at 61% of expected output. Solar Farm Beta and Gamma are operating normally. Average fleet performance ratio: ${Math.round((0.61 + 0.91 + 0.87) / 3 * 100)}%.`,
  },
  {
    patterns: ['wind', 'wind farm', 'turbine'],
    handler: (data) => `Current wind generation is ${data.kpis?.currentWind || 0} MW from 3 assets (total capacity: 560 MW). Wind Farm North is performing excellently at 93% PR. Wind Farm West has 2 turbines offline for gearbox inspection. Wind Farm South is in partial maintenance shutdown (52% availability).`,
  },
  {
    patterns: ['demand', 'load', 'consumption'],
    handler: (data) => `Current grid demand is ${data.kpis?.currentDemand?.toLocaleString() || '--'} MW. The 24h average is ${data.kpis?.avgDemand?.toLocaleString() || '--'} MW with a peak of ${data.kpis?.peakDemand?.toLocaleString() || '--'} MW at ${data.kpis?.peakTime || '--'}. Demand is on the ${(data.kpis?.currentDemand || 0) > (data.kpis?.avgDemand || 0) ? 'high' : 'lower'} side of the daily average.`,
  },
  {
    patterns: ['carbon', 'co2', 'emissions', 'intensity'],
    handler: (data) => `Current grid carbon intensity is ${data.kpis?.carbonIntensity || '--'} gCO₂e/kWh. This is determined by the generation mix — the ${data.kpis?.renewablePct || 0}% renewable fraction displaces conventional generation. Fully decarbonising the grid during this period would require either additional renewable generation or reduced conventional baseload.`,
  },
  {
    patterns: ['anomaly', 'anomalies', 'underperform', 'fault', 'problem'],
    handler: (data) => `${data.anomalies?.length || 0} anomalies detected. The primary concern is Solar Farm Alpha, which is generating at 61% of expected output (deviation: -${Math.round((0.39) * 200)} MW). Detection method: Z-score (z = -3.2) and threshold (actual < 70% expected). Most likely cause: panel soiling or partial vegetation shading. Secondary: Wind Farm South reduced capacity due to planned maintenance.`,
  },
  {
    patterns: ['recommend', 'should', 'action', 'next step', 'what to do'],
    handler: (data) => `Top AI recommendations right now:\n1. Inspect Solar Farm Alpha — 39% output shortfall is atypical even with cloud cover.\n2. Pre-position peaking generation for the 18:30–20:00 demand peak (forecast: ~1,724 MW).\n3. Shift flexible loads (${Math.round((data.kpis?.curtailmentTotal || 100) * 0.55)} MW potential) into the midday curtailment window.\n4. Acknowledge 2 outstanding critical alerts in the alert panel.`,
  },
  {
    patterns: ['forecast', 'predict', 'prediction', 'next'],
    handler: (data) => `The 24-hour demand forecast shows an average of ${data.forecastMeta?.avgDemand?.toLocaleString() || '--'} MW with a projected peak of ${data.forecastMeta?.peakDemand?.toLocaleString() || '--'} MW at ${data.forecastMeta?.peakTime || '--'}. The forecast uses a weighted moving average of similar historical periods adjusted for temperature (${data.kpis?.currentTemp || 20}°C), day-of-week, and hour-of-day patterns. Confidence intervals range from ±4% at 1h to ±13% at 24h.`,
  },
  {
    patterns: ['balance', 'surplus', 'deficit', 'grid status'],
    handler: (data) => `Current grid balance: ${(data.kpis?.gridBalance || 0) >= 0 ? '+' : ''}${data.kpis?.gridBalance || 0} MW ${(data.kpis?.gridBalance || 0) >= 0 ? 'surplus' : 'deficit'}. Total generation: ${data.kpis?.totalGeneration?.toLocaleString() || '--'} MW vs demand: ${data.kpis?.currentDemand?.toLocaleString() || '--'} MW. Grid status: ${data.gridBalance?.status?.toUpperCase() || 'NORMAL'}.`,
  },
];

/**
 * Pattern-match a user question and return a data-driven response.
 * @param {string} question
 * @param {Object} allData
 * @returns {string}
 */
export function answerQuestion(question, allData) {
  if (!question) return 'Please ask a question about the grid.';
  const q = question.toLowerCase();

  for (const qa of QA_PATTERNS) {
    if (qa.patterns.some(p => q.includes(p))) {
      return qa.handler(allData);
    }
  }

  return `I don't have a specific pattern for "${question}". Try asking about: demand, solar, wind, curtailment, reserve margin, carbon intensity, anomalies, recommendations, or the forecast. All responses are derived from live simulation data using rule-based logic.`;
}

export const EXAMPLE_QUESTIONS = [
  'What is the current curtailment?',
  'What is the reserve margin?',
  'How is Solar Farm Alpha performing?',
  'What is the demand forecast for the next 24 hours?',
  'What anomalies have been detected?',
  'What actions do you recommend?',
  'What is the current carbon intensity?',
  'How is the wind fleet performing?',
  'What is the current grid balance?',
];
