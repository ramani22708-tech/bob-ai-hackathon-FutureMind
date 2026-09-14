/**
 * alerts.js
 * Alert definitions and live alert generation for GridWise AI.
 */

export const ALERT_TYPES = {
  SOLAR_UNDERPERFORMANCE: 'solar_underperformance',
  WIND_UNDERPERFORMANCE: 'wind_underperformance',
  DEMAND_SPIKE: 'demand_spike',
  CURTAILMENT_HIGH: 'curtailment_high',
  RESERVE_MARGIN_LOW: 'reserve_margin_low',
  ASSET_MAINTENANCE: 'asset_maintenance',
  GRID_IMBALANCE: 'grid_imbalance',
  FORECAST_DEVIATION: 'forecast_deviation',
};

export const BASE_ALERTS = [
  {
    id: 'a001',
    type: ALERT_TYPES.SOLAR_UNDERPERFORMANCE,
    severity: 'critical',
    title: 'Solar Farm Alpha — Underperformance Detected',
    message: 'Solar Farm Alpha generating at 61% of expected output. Z-score: -3.2. Possible causes: panel soiling, partial shading, or inverter fault.',
    assetId: 'solar-alpha',
    timestamp: '2026-06-15T07:30:00Z',
    acknowledged: false,
    value: 61,
    threshold: 75,
    unit: '%',
  },
  {
    id: 'a002',
    type: ALERT_TYPES.CURTAILMENT_HIGH,
    severity: 'warning',
    title: 'Elevated Curtailment — Midday Window',
    message: 'Renewable curtailment reached 128 MW during 11:00–13:30 window. Grid constraint in Zone A limiting renewable absorption. Recommend rescheduling flexible loads.',
    assetId: null,
    timestamp: '2026-06-15T11:45:00Z',
    acknowledged: false,
    value: 128,
    threshold: 100,
    unit: 'MW',
  },
  {
    id: 'a003',
    type: ALERT_TYPES.ASSET_MAINTENANCE,
    severity: 'warning',
    title: 'Wind Farm South — Partial Shutdown Active',
    message: 'Wind Farm South operating at 52% availability due to planned blade inspection on 12 turbines. Expected full restoration: +48h.',
    assetId: 'wind-south',
    timestamp: '2026-06-15T06:00:00Z',
    acknowledged: true,
    value: 52,
    threshold: 80,
    unit: '%',
  },
  {
    id: 'a004',
    type: ALERT_TYPES.DEMAND_SPIKE,
    severity: 'warning',
    title: 'Evening Demand Spike Forecast',
    message: 'Demand forecast shows 18:30–20:00 peak reaching 1,724 MW — 94% of grid capacity. Pre-emptive load balancing recommended.',
    assetId: null,
    timestamp: '2026-06-15T16:00:00Z',
    acknowledged: false,
    value: 1724,
    threshold: 1650,
    unit: 'MW',
  },
  {
    id: 'a005',
    type: ALERT_TYPES.RESERVE_MARGIN_LOW,
    severity: 'info',
    title: 'Reserve Margin Below Target During Peak',
    message: 'Reserve margin expected to fall to 4.2% between 19:00–20:30. Minimum target is 8%. Recommend activating demand response programme.',
    assetId: null,
    timestamp: '2026-06-15T17:30:00Z',
    acknowledged: false,
    value: 4.2,
    threshold: 8,
    unit: '%',
  },
  {
    id: 'a006',
    type: ALERT_TYPES.WIND_UNDERPERFORMANCE,
    severity: 'info',
    title: 'Wind Farm West — Gearbox Inspection',
    message: '2 turbines offline at Wind Farm West for scheduled gearbox inspection. Impact: -18 MW. Remaining fleet nominal.',
    assetId: 'wind-west',
    timestamp: '2026-06-15T04:00:00Z',
    acknowledged: true,
    value: -18,
    threshold: 0,
    unit: 'MW',
  },
  {
    id: 'a007',
    type: ALERT_TYPES.FORECAST_DEVIATION,
    severity: 'info',
    title: 'Demand Forecast Deviation — Morning Ramp',
    message: 'Actual morning demand exceeded forecast by 47 MW (4.1%). Temperature coefficient higher than modelled. Recalibrating forecast weights.',
    assetId: null,
    timestamp: '2026-06-15T09:15:00Z',
    acknowledged: true,
    value: 47,
    threshold: 30,
    unit: 'MW',
  },
  {
    id: 'a008',
    type: ALERT_TYPES.GRID_IMBALANCE,
    severity: 'normal',
    title: 'Grid Balance Restored — Zone A',
    message: 'Grid balance in Zone A normalised following renewable curtailment. Current surplus: +42 MW. System frequency stable at 50.01 Hz.',
    assetId: null,
    timestamp: '2026-06-15T13:00:00Z',
    acknowledged: true,
    value: 42,
    threshold: 0,
    unit: 'MW',
  },
];

/**
 * Returns dynamically updated alerts based on current simulation state.
 * @param {Object} kpis - Current KPI values
 * @param {Object} simulationState - Current simulation overrides
 * @returns {Array} Active alert list sorted by severity
 */
export function generateDynamicAlerts(kpis, simulationState = {}) {
  const alerts = [...BASE_ALERTS];

  const severityOrder = { critical: 0, warning: 1, info: 2, normal: 3 };

  if (simulationState.demandLevel === 'spike') {
    alerts.unshift({
      id: 'd001',
      type: ALERT_TYPES.DEMAND_SPIKE,
      severity: 'critical',
      title: 'SIMULATED: Critical Demand Spike Active',
      message: `Demand has spiked to ${kpis.currentDemand} MW — SIMULATED SCENARIO. All peaking units requested online. Emergency demand response programme activated.`,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      value: kpis.currentDemand,
      threshold: 1600,
      unit: 'MW',
    });
  }

  if (simulationState.solarPerformance === 'underperforming') {
    alerts.unshift({
      id: 'd002',
      type: ALERT_TYPES.SOLAR_UNDERPERFORMANCE,
      severity: 'critical',
      title: 'SIMULATED: Fleet-Wide Solar Underperformance',
      message: 'SIMULATED SCENARIO: All solar assets running at 40% of rated output. Immediate investigation required. Conventional generation ramping to compensate.',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      value: 40,
      threshold: 75,
      unit: '%',
    });
  }

  if (simulationState.windPerformance === 'underperforming') {
    alerts.unshift({
      id: 'd003',
      type: ALERT_TYPES.WIND_UNDERPERFORMANCE,
      severity: 'warning',
      title: 'SIMULATED: Wind Fleet Underperformance',
      message: 'SIMULATED SCENARIO: Wind generation down 45%. Low wind speed event. Backup generation dispatch initiated.',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      value: 55,
      threshold: 80,
      unit: '%',
    });
  }

  return alerts.sort((a, b) => {
    if (!a.acknowledged && b.acknowledged) return -1;
    if (a.acknowledged && !b.acknowledged) return 1;
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export function getSeverityColor(severity) {
  switch (severity) {
    case 'critical': return '#f44336';
    case 'warning': return '#ffc107';
    case 'info': return '#2196f3';
    case 'normal': return '#00e676';
    default: return '#8ba3bc';
  }
}

export function countBySeverity(alerts) {
  return {
    critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    warning: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length,
    info: alerts.filter(a => a.severity === 'info' && !a.acknowledged).length,
  };
}
