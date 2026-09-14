/**
 * simulationData.js
 * Generates 48h of realistic time-series grid data at 30-min intervals (96 points)
 * All data is simulated for demonstration purposes.
 */

// Seeded pseudo-random to keep data deterministic between renders
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * Returns a demand curve value (0-1) for a given hour of day.
 * Models morning peak (~08:00) and evening peak (~19:00).
 */
function demandCurve(hour) {
  if (hour < 5) return 0.45 + Math.sin(hour * 0.3) * 0.05;
  if (hour < 9) return 0.45 + (hour - 5) * 0.12;
  if (hour < 12) return 0.93 - (hour - 9) * 0.03;
  if (hour < 14) return 0.84 + Math.sin(hour * 0.5) * 0.02;
  if (hour < 17) return 0.82 + (hour - 14) * 0.03;
  if (hour < 20) return 0.91 + Math.sin((hour - 17) * 1.0) * 0.08;
  if (hour < 22) return 0.88 - (hour - 20) * 0.07;
  return 0.72 - (hour - 22) * 0.05;
}

/**
 * Returns a solar irradiance curve (0-1) for a given hour of day.
 * Models sunrise ~06:00, peak ~12:30, sunset ~19:30.
 */
function solarCurve(hour) {
  if (hour < 6 || hour >= 20) return 0;
  const mid = 12.5;
  const val = Math.max(0, Math.cos(((hour - mid) / 7.0) * Math.PI * 0.9));
  return val;
}

/** BASE START TIME: 48h ago from a fixed reference */
const REFERENCE_DATE = new Date('2026-06-15T00:00:00Z');

/**
 * Generates the full 48-hour historical dataset (96 data points at 30-min intervals).
 * @param {Object} overrides - Optional overrides for simulation scenarios
 * @returns {Array} Array of data point objects
 */
export function generateHistoricalData(overrides = {}) {
  const {
    demandMultiplier = 1.0,
    solarMultiplier = 1.0,
    windMultiplier = 1.0,
    anomalySlots = [18, 22, 38], // slot indices with injected solar anomalies
  } = overrides;

  const rng = seededRandom(42);
  const points = [];

  for (let i = 0; i < 96; i++) {
    const t = new Date(REFERENCE_DATE.getTime() + i * 30 * 60 * 1000);
    const hour = t.getUTCHours() + t.getUTCMinutes() / 60;
    const dayOffset = Math.floor(i / 48);

    // Demand: 800–1800 MW realistic daily curve
    const baseDemand = 800 + demandCurve(hour) * 1000;
    const demandNoise = (rng() - 0.5) * 60;
    const demand = Math.round((baseDemand + demandNoise) * demandMultiplier);

    // Solar: 0–600 MW based on irradiance + cloud cover
    const cloudCover = Math.max(0, Math.min(1, 0.3 + (rng() - 0.5) * 0.4));
    let solarBase = solarCurve(hour) * 600 * (1 - cloudCover * 0.75);
    // Inject anomalies at specific slots
    const isAnomaly = anomalySlots.includes(i);
    if (isAnomaly) solarBase *= 0.35; // 65% underperformance
    const solarNoise = (rng() - 0.5) * 20;
    const solarGeneration = Math.max(0, Math.round((solarBase + solarNoise) * solarMultiplier));

    // Wind: 50–350 MW variable
    const windBase = 120 + Math.sin(i * 0.15 + 1.2) * 90 + Math.sin(i * 0.07) * 60;
    const windNoise = (rng() - 0.5) * 50;
    const windSpeed = Math.max(2, Math.min(18, 7 + Math.sin(i * 0.1) * 4 + (rng() - 0.5) * 2));
    const windGeneration = Math.max(50, Math.min(350, Math.round((windBase + windNoise) * windMultiplier)));

    // Temperature: 12–32°C daily cycle
    const tempBase = 22 + Math.sin((hour - 14) / 24 * 2 * Math.PI) * 8 + (dayOffset * -1);
    const temperature = Math.round(tempBase + (rng() - 0.5) * 3);

    // Conventional generation: meets residual demand
    const renewableAvailable = solarGeneration + windGeneration;
    const conventionalTarget = Math.max(450, demand - renewableAvailable + 80);
    const conventionalGeneration = Math.round(conventionalTarget + (rng() - 0.5) * 40);

    // Curtailment: excess renewable that can't be absorbed
    const totalGeneration = solarGeneration + windGeneration + conventionalGeneration;
    const surplus = totalGeneration - demand;
    const curtailment = Math.max(0, Math.round(surplus * 0.4));

    points.push({
      index: i,
      timestamp: t.toISOString(),
      label: formatTimeLabel(t),
      hour,
      demand,
      solarGeneration,
      windGeneration,
      conventionalGeneration,
      totalGeneration,
      surplus,
      curtailment,
      temperature,
      cloudCover: Math.round(cloudCover * 100),
      windSpeed: Math.round(windSpeed * 10) / 10,
      isAnomaly,
      anomalyAsset: isAnomaly ? 'Solar Farm Alpha' : null,
    });
  }

  return points;
}

/**
 * Generates forecast data for a given number of hours ahead.
 * Applies hourly patterns + uncertainty bands.
 * @param {Array} historicalData - Past data points
 * @param {number} horizonHours - Hours to forecast (6, 12, or 24)
 * @returns {{ forecast: Array, upper: Array, lower: Array }}
 */
export function generateForecast(historicalData, horizonHours = 24) {
  const rng = seededRandom(99);
  const slots = horizonHours * 2; // 30-min intervals
  const lastPoint = historicalData[historicalData.length - 1];
  const baseTime = new Date(lastPoint.timestamp);

  const forecast = [];
  const upper = [];
  const lower = [];

  for (let i = 1; i <= slots; i++) {
    const t = new Date(baseTime.getTime() + i * 30 * 60 * 1000);
    const hour = t.getUTCHours() + t.getUTCMinutes() / 60;

    // Look back at same hour from 2 similar periods for moving average
    const similarPast = historicalData.filter(p => {
      const ph = p.hour;
      return Math.abs(ph - hour) < 0.6;
    });

    let avgDemand = 1100;
    let avgSolar = 200;
    let avgWind = 180;

    if (similarPast.length > 0) {
      avgDemand = similarPast.reduce((s, p) => s + p.demand, 0) / similarPast.length;
      avgSolar = similarPast.reduce((s, p) => s + p.solarGeneration, 0) / similarPast.length;
      avgWind = similarPast.reduce((s, p) => s + p.windGeneration, 0) / similarPast.length;
    }

    // Temperature adjustment: +3% demand per -10°C below 18°C
    const forecastTemp = 22 + Math.sin((hour - 14) / 24 * 2 * Math.PI) * 7;
    const tempAdj = forecastTemp < 18 ? 1 + ((18 - forecastTemp) / 10) * 0.03 : 1.0;

    const fDemand = Math.round(avgDemand * tempAdj + (rng() - 0.5) * 30);
    const fSolar = Math.max(0, Math.round(avgSolar + (rng() - 0.5) * 25));
    const fWind = Math.max(40, Math.round(avgWind + (rng() - 0.5) * 35));
    const cloudCover = Math.max(0, Math.min(1, 0.3 + (rng() - 0.5) * 0.35));
    const fTemp = Math.round(forecastTemp + (rng() - 0.5) * 2);

    const point = {
      index: historicalData.length + i,
      timestamp: t.toISOString(),
      label: formatTimeLabel(t),
      hour,
      demand: fDemand,
      solarGeneration: fSolar,
      windGeneration: fWind,
      conventionalGeneration: Math.max(450, fDemand - fSolar - fWind + 80),
      temperature: fTemp,
      cloudCover: Math.round(cloudCover * 100),
      isForecast: true,
    };

    // ±10% confidence interval widening over time
    const ci = 0.05 + (i / slots) * 0.08;
    forecast.push(point);
    upper.push({ ...point, demand: Math.round(fDemand * (1 + ci)) });
    lower.push({ ...point, demand: Math.round(fDemand * (1 - ci)) });
  }

  return { forecast, upper, lower };
}

/**
 * Combines historical + forecast into a single display series.
 * Marks transition point.
 */
export function buildDisplaySeries(historicalData, forecastData) {
  const hist = historicalData.map(p => ({
    ...p,
    forecastDemand: null,
    forecastSolar: null,
    forecastWind: null,
  }));

  const fcast = forecastData.forecast.map(p => ({
    ...p,
    forecastDemand: p.demand,
    forecastSolar: p.solarGeneration,
    forecastWind: p.windGeneration,
    demand: null,
    solarGeneration: null,
    windGeneration: null,
  }));

  return [...hist, ...fcast];
}

function formatTimeLabel(date) {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  const d = date.getUTCDate();
  const mo = date.getUTCMonth() + 1;
  return `${mo}/${d} ${h}:${m}`;
}

/** Returns KPI summary for the current state of simulation data */
export function computeKPIs(data) {
  if (!data || data.length === 0) return {};

  const latest = data[data.length - 1];
  const last24 = data.slice(-48);

  const avgDemand = Math.round(last24.reduce((s, p) => s + p.demand, 0) / last24.length);
  const peakDemand = Math.max(...last24.map(p => p.demand));
  const peakPoint = last24.find(p => p.demand === peakDemand);
  const totalSolar = Math.round(last24.reduce((s, p) => s + p.solarGeneration, 0) / last24.length);
  const totalWind = Math.round(last24.reduce((s, p) => s + p.windGeneration, 0) / last24.length);
  const totalRenewable = totalSolar + totalWind;
  const renewablePct = Math.round((totalRenewable / avgDemand) * 100);
  const curtailmentTotal = last24.reduce((s, p) => s + p.curtailment, 0);
  const curtailmentPct = Math.round((curtailmentTotal / (curtailmentTotal + totalRenewable * 48)) * 100 * 10) / 10;

  const gridBalance = latest.totalGeneration - latest.demand;
  const reserveMargin = Math.round((gridBalance / latest.demand) * 100 * 10) / 10;
  const carbonIntensity = Math.round(
    (latest.conventionalGeneration / latest.totalGeneration) * 380 +
    (latest.solarGeneration / latest.totalGeneration) * 0 +
    (latest.windGeneration / latest.totalGeneration) * 0
  );

  return {
    currentDemand: latest.demand,
    avgDemand,
    peakDemand,
    peakTime: peakPoint?.label || '--',
    currentSolar: latest.solarGeneration,
    currentWind: latest.windGeneration,
    avgSolar: totalSolar,
    avgWind: totalWind,
    renewablePct,
    totalRenewable,
    gridBalance,
    reserveMargin,
    curtailmentTotal,
    curtailmentPct,
    carbonIntensity,
    currentTemp: latest.temperature,
    conventionalGeneration: latest.conventionalGeneration,
    totalGeneration: latest.totalGeneration,
  };
}
