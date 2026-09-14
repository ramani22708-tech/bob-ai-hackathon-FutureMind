/**
 * assets.js
 * Renewable energy asset definitions for GridWise AI.
 * All data is simulated for demonstration purposes.
 */

export const ASSETS = [
  // ─── SOLAR ──────────────────────────────────────────
  {
    id: 'solar-alpha',
    name: 'Solar Farm Alpha',
    type: 'solar',
    capacity: 200,
    zone: 'Zone A',
    latitude: 51.32,
    longitude: -1.18,
    status: 'warning',
    performanceRatio: 0.61,
    availability: 78.4,
    lastUpdate: '2026-06-15T10:30:00Z',
    installYear: 2019,
    panelType: 'Monocrystalline PERC',
    description: 'Primary solar installation, experiencing intermittent underperformance due to suspected soiling and partial shading from vegetation encroachment.',
    alerts: ['underperformance', 'maintenance-due'],
  },
  {
    id: 'solar-beta',
    name: 'Solar Farm Beta',
    type: 'solar',
    capacity: 150,
    zone: 'Zone B',
    latitude: 51.45,
    longitude: -0.97,
    status: 'operational',
    performanceRatio: 0.91,
    availability: 97.2,
    lastUpdate: '2026-06-15T10:30:00Z',
    installYear: 2021,
    panelType: 'Bifacial Monocrystalline',
    description: 'High-efficiency bifacial array operating within normal parameters. Recent cleaning yielded 4.2% performance uplift.',
    alerts: [],
  },
  {
    id: 'solar-gamma',
    name: 'Solar Farm Gamma',
    type: 'solar',
    capacity: 120,
    zone: 'Zone C',
    latitude: 51.58,
    longitude: -1.42,
    status: 'operational',
    performanceRatio: 0.87,
    availability: 94.1,
    lastUpdate: '2026-06-15T10:30:00Z',
    installYear: 2022,
    panelType: 'Thin-film CdTe',
    description: 'Newer installation with thin-film technology. Performance nominal; minor inverter efficiency loss detected.',
    alerts: [],
  },

  // ─── WIND ───────────────────────────────────────────
  {
    id: 'wind-north',
    name: 'Wind Farm North',
    type: 'wind',
    capacity: 180,
    zone: 'Zone N',
    latitude: 52.14,
    longitude: -1.55,
    status: 'operational',
    performanceRatio: 0.93,
    availability: 98.6,
    lastUpdate: '2026-06-15T10:30:00Z',
    installYear: 2018,
    turbineModel: 'Vestas V150-4.5MW',
    numTurbines: 40,
    description: 'Offshore-adjacent onshore wind farm. Current wind speeds 8.4 m/s; all 40 turbines operational. Scheduled maintenance on T-17 next week.',
    alerts: [],
  },
  {
    id: 'wind-west',
    name: 'Wind Farm West',
    type: 'wind',
    capacity: 220,
    zone: 'Zone W',
    latitude: 51.89,
    longitude: -2.31,
    status: 'operational',
    performanceRatio: 0.88,
    availability: 95.4,
    lastUpdate: '2026-06-15T10:30:00Z',
    installYear: 2020,
    turbineModel: 'Siemens Gamesa SG 5.0-145',
    numTurbines: 44,
    description: 'Largest wind asset in the portfolio. 2 turbines offline for gearbox inspection; remainder at full capacity.',
    alerts: ['maintenance-in-progress'],
  },
  {
    id: 'wind-south',
    name: 'Wind Farm South',
    type: 'wind',
    capacity: 160,
    zone: 'Zone S',
    latitude: 50.72,
    longitude: -1.82,
    status: 'maintenance',
    performanceRatio: 0.52,
    availability: 62.5,
    lastUpdate: '2026-06-15T09:15:00Z',
    installYear: 2017,
    turbineModel: 'GE Vernova 3.x-137',
    numTurbines: 35,
    description: 'Partial shutdown for planned blade inspection and replacement on 12 turbines. Expected to return to full capacity in 48h.',
    alerts: ['maintenance', 'reduced-capacity'],
  },
];

export const ASSET_COLORS = {
  solar: '#ffc107',
  wind: '#2196f3',
};

export const STATUS_COLORS = {
  operational: '#00e676',
  warning: '#ffc107',
  maintenance: '#f44336',
};

/** Get asset by id */
export function getAssetById(id) {
  return ASSETS.find(a => a.id === id) || null;
}

/** Get all solar assets */
export function getSolarAssets() {
  return ASSETS.filter(a => a.type === 'solar');
}

/** Get all wind assets */
export function getWindAssets() {
  return ASSETS.filter(a => a.type === 'wind');
}

/** Compute fleet-level performance stats */
export function getFleetStats() {
  const totalCapacity = ASSETS.reduce((s, a) => s + a.capacity, 0);
  const avgPerformance = ASSETS.reduce((s, a) => s + a.performanceRatio, 0) / ASSETS.length;
  const avgAvailability = ASSETS.reduce((s, a) => s + a.availability, 0) / ASSETS.length;
  const operational = ASSETS.filter(a => a.status === 'operational').length;
  const warning = ASSETS.filter(a => a.status === 'warning').length;
  const maintenance = ASSETS.filter(a => a.status === 'maintenance').length;

  return {
    totalCapacity,
    avgPerformance: Math.round(avgPerformance * 100),
    avgAvailability: Math.round(avgAvailability * 10) / 10,
    operational,
    warning,
    maintenance,
    total: ASSETS.length,
  };
}

/** Returns per-asset actual generation given current solar/wind levels */
export function computeAssetGeneration(solarTotal, windTotal) {
  const solar = ASSETS.filter(a => a.type === 'solar');
  const wind = ASSETS.filter(a => a.type === 'wind');
  const solarCap = solar.reduce((s, a) => s + a.capacity, 0);
  const windCap = wind.reduce((s, a) => s + a.capacity, 0);

  return ASSETS.map(asset => {
    let expected, actual;
    if (asset.type === 'solar') {
      expected = Math.round((asset.capacity / solarCap) * solarTotal / asset.performanceRatio);
      actual = Math.round((asset.capacity / solarCap) * solarTotal * asset.performanceRatio);
    } else {
      expected = Math.round((asset.capacity / windCap) * windTotal / asset.performanceRatio);
      actual = Math.round((asset.capacity / windCap) * windTotal * asset.performanceRatio);
    }
    return { ...asset, expected, actual };
  });
}
