/**
 * forecasting.js
 * Transparent baseline demand forecasting for GridWise AI.
 * Uses moving average of similar historical periods + adjustment factors.
 */

/**
 * Hour-of-day demand factor (0.4 = low, 1.0 = peak).
 * Used as a multiplier when insufficient historical data is available.
 */
const HOUR_FACTORS = [
  0.44, 0.42, 0.41, 0.40, 0.42, 0.48, 0.58, 0.72,
  0.88, 0.93, 0.91, 0.88, 0.85, 0.84, 0.83, 0.84,
  0.86, 0.89, 0.94, 0.97, 0.95, 0.90, 0.80, 0.65,
];

/**
 * Day-of-week factor (Mon=1, Sun=7). Weekday slightly higher.
 */
const DOW_FACTORS = {
  0: 0.92, // Sunday
  1: 1.02, // Monday
  2: 1.04, // Tuesday
  3: 1.03, // Wednesday
  4: 1.01, // Thursday
  5: 0.97, // Friday
  6: 0.90, // Saturday
};

/**
 * Temperature demand adjustment factor.
 * +3% demand per -10°C below 18°C baseline (heating loads).
 * +2% demand per +5°C above 25°C baseline (cooling loads).
 * @param {number} temperature
 * @returns {number} Multiplier
 */
function temperatureAdjustment(temperature) {
  if (temperature < 18) {
    return 1 + ((18 - temperature) / 10) * 0.03;
  } else if (temperature > 25) {
    return 1 + ((temperature - 25) / 5) * 0.02;
  }
  return 1.0;
}

/**
 * Find historical data points within ±45 min of the given hour.
 * @param {Array} history
 * @param {number} targetHour
 * @returns {Array}
 */
function findSimilarPeriods(history, targetHour) {
  return history.filter(p => {
    const diff = Math.abs(p.hour - targetHour);
    return diff < 0.8 || diff > 23.2; // wraps around midnight
  });
}

/**
 * Compute weighted moving average over similar periods.
 * More recent periods receive higher weight.
 * @param {Array} periods - Similar historical data points
 * @param {string} field - Field to average
 * @returns {number} Weighted average
 */
function weightedMovingAverage(periods, field) {
  if (periods.length === 0) return 0;
  // Exponential weighting: more recent = higher weight
  let totalWeight = 0;
  let weightedSum = 0;
  periods.forEach((p, i) => {
    const w = Math.exp(i / periods.length); // exponential growth
    weightedSum += p[field] * w;
    totalWeight += w;
  });
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Generate demand forecast with confidence intervals.
 * @param {Array} historicalData - Array of historical data points
 * @param {number} horizonHours - Hours to forecast ahead (6, 12, 24)
 * @param {number} forecastTemp - Expected average temperature (°C)
 * @returns {{ forecast: Array, upper: Array, lower: Array, metadata: Object }}
 */
export function generateDemandForecast(historicalData, horizonHours = 24, forecastTemp = 20) {
  const slots = horizonHours * 2; // 30-min slots
  const lastPoint = historicalData[historicalData.length - 1];
  const baseTime = new Date(lastPoint.timestamp);

  const forecast = [];
  const upper = [];
  const lower = [];

  for (let i = 1; i <= slots; i++) {
    const t = new Date(baseTime.getTime() + i * 30 * 60 * 1000);
    const hour = t.getUTCHours() + t.getUTCMinutes() / 60;
    const hourInt = Math.floor(hour);
    const dow = t.getUTCDay();
    const label = formatLabel(t);

    // Find similar historical periods (same hour of day, ±45 min)
    const similar = findSimilarPeriods(historicalData, hour);

    let baseDemand;
    if (similar.length >= 2) {
      baseDemand = weightedMovingAverage(similar, 'demand');
    } else {
      // Fallback: use hour factor × baseline demand
      const hourFactor = HOUR_FACTORS[hourInt] || 0.7;
      baseDemand = 800 + hourFactor * 1000;
    }

    // Apply day-of-week factor
    const dowFactor = DOW_FACTORS[dow] || 1.0;
    // Apply temperature adjustment
    const tempFactor = temperatureAdjustment(forecastTemp);

    const adjustedDemand = Math.round(baseDemand * dowFactor * tempFactor);

    // Confidence interval widens with forecast horizon
    const ciWidth = 0.04 + (i / slots) * 0.09; // 4% → 13%
    const upperDemand = Math.round(adjustedDemand * (1 + ciWidth));
    const lowerDemand = Math.round(adjustedDemand * (1 - ciWidth));

    const solarEst = similar.length > 0
      ? Math.round(weightedMovingAverage(similar, 'solarGeneration') * 0.95)
      : 0;
    const windEst = similar.length > 0
      ? Math.round(weightedMovingAverage(similar, 'windGeneration') * 0.9)
      : 150;

    const point = {
      index: historicalData.length + i,
      timestamp: t.toISOString(),
      label,
      hour,
      demand: adjustedDemand,
      forecastDemand: adjustedDemand,
      solarForecast: solarEst,
      windForecast: windEst,
      isForecast: true,
      temperature: forecastTemp,
    };

    forecast.push(point);
    upper.push({ ...point, demand: upperDemand, forecastDemand: upperDemand });
    lower.push({ ...point, demand: lowerDemand, forecastDemand: lowerDemand });
  }

  // Find predicted peak
  const peakPoint = forecast.reduce((max, p) => p.demand > max.demand ? p : max, forecast[0]);

  return {
    forecast,
    upper,
    lower,
    metadata: {
      horizonHours,
      generatedAt: new Date().toISOString(),
      method: 'Weighted Moving Average + Hour/DOW/Temperature Factors',
      forecastTemp,
      slots,
      peakDemand: peakPoint?.demand,
      peakTime: peakPoint?.label,
      avgDemand: Math.round(forecast.reduce((s, p) => s + p.demand, 0) / forecast.length),
    },
  };
}

/**
 * Build a combined series for charting: historical actuals + forecast with confidence band.
 * @param {Array} historical
 * @param {Object} forecastResult - Result from generateDemandForecast
 * @param {number} historySlots - How many historical slots to show
 * @returns {Array} Chart-ready array
 */
export function buildForecastChartSeries(historical, forecastResult, historySlots = 48) {
  const histSlice = historical.slice(-historySlots);

  const histSeries = histSlice.map(p => ({
    label: p.label,
    timestamp: p.timestamp,
    actual: p.demand,
    forecast: null,
    upper: null,
    lower: null,
    solar: p.solarGeneration,
    wind: p.windGeneration,
    conventional: p.conventionalGeneration,
    temperature: p.temperature,
    isHistory: true,
  }));

  const fcastSeries = forecastResult.forecast.map((p, i) => ({
    label: p.label,
    timestamp: p.timestamp,
    actual: null,
    forecast: p.demand,
    upper: forecastResult.upper[i]?.demand,
    lower: forecastResult.lower[i]?.demand,
    solar: p.solarForecast,
    wind: p.windForecast,
    temperature: p.temperature,
    isForecast: true,
  }));

  return [...histSeries, ...fcastSeries];
}

function formatLabel(date) {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  const d = date.getUTCDate();
  const mo = date.getUTCMonth() + 1;
  return `${mo}/${d} ${h}:${m}`;
}
