/**
 * calculations.js
 * Core grid calculation formulas for GridWise AI.
 * All calculations are clearly documented for transparency.
 */

/**
 * Total Generation = Conventional + Solar + Wind
 * @param {number} conventional - Conventional generation (MW)
 * @param {number} solar - Solar generation (MW)
 * @param {number} wind - Wind generation (MW)
 * @returns {number} Total generation (MW)
 */
export function totalGeneration(conventional, solar, wind) {
  return conventional + solar + wind;
}

/**
 * Performance Ratio = Actual Output / Expected Output × 100
 * @param {number} actual - Actual output (MW)
 * @param {number} expected - Expected/rated output (MW)
 * @returns {number} Performance ratio (%)
 */
export function performanceRatio(actual, expected) {
  if (expected === 0) return 0;
  return Math.round((actual / expected) * 100 * 10) / 10;
}

/**
 * Curtailment = max(0, Available Renewable − Utilised Renewable)
 * @param {number} availableRenewable - Total available renewable capacity (MW)
 * @param {number} utilisedRenewable - Actually used renewable energy (MW)
 * @returns {number} Curtailment (MW)
 */
export function curtailment(availableRenewable, utilisedRenewable) {
  return Math.max(0, availableRenewable - utilisedRenewable);
}

/**
 * Curtailment % = Curtailment / Available × 100
 * @param {number} curtailmentMW - Curtailed energy (MW)
 * @param {number} availableRenewable - Total available renewable (MW)
 * @returns {number} Curtailment percentage
 */
export function curtailmentPercent(curtailmentMW, availableRenewable) {
  if (availableRenewable === 0) return 0;
  return Math.round((curtailmentMW / availableRenewable) * 100 * 10) / 10;
}

/**
 * Generation Surplus = Total Generation − Demand
 * @param {number} generation - Total generation (MW)
 * @param {number} demand - Load demand (MW)
 * @returns {number} Surplus (positive) or deficit (negative) in MW
 */
export function generationSurplus(generation, demand) {
  return generation - demand;
}

/**
 * Reserve Margin = (Total Generation − Demand) / Demand × 100
 * @param {number} generation - Total generation (MW)
 * @param {number} demand - Load demand (MW)
 * @returns {number} Reserve margin (%)
 */
export function reserveMargin(generation, demand) {
  if (demand === 0) return 0;
  return Math.round(((generation - demand) / demand) * 100 * 10) / 10;
}

/**
 * Renewable Fraction = (Solar + Wind) / Total Generation × 100
 * @param {number} solar - Solar generation (MW)
 * @param {number} wind - Wind generation (MW)
 * @param {number} totalGen - Total generation (MW)
 * @returns {number} Renewable fraction (%)
 */
export function renewableFraction(solar, wind, totalGen) {
  if (totalGen === 0) return 0;
  return Math.round(((solar + wind) / totalGen) * 100 * 10) / 10;
}

/**
 * Carbon Intensity = (Conventional / Total) × 380 g/kWh
 * Assumes 380 gCO₂e/kWh for conventional (gas/coal mix), 0 for renewables.
 * @param {number} conventional - Conventional generation (MW)
 * @param {number} totalGen - Total generation (MW)
 * @returns {number} Carbon intensity (gCO₂e/kWh)
 */
export function carbonIntensity(conventional, totalGen) {
  if (totalGen === 0) return 0;
  return Math.round((conventional / totalGen) * 380);
}

/**
 * Load Factor = Average Load / Peak Load × 100
 * @param {Array<number>} loads - Array of load values (MW)
 * @returns {number} Load factor (%)
 */
export function loadFactor(loads) {
  if (!loads || loads.length === 0) return 0;
  const avg = loads.reduce((s, v) => s + v, 0) / loads.length;
  const peak = Math.max(...loads);
  return peak > 0 ? Math.round((avg / peak) * 100 * 10) / 10 : 0;
}

/**
 * Capacity Utilisation = Actual Generation / Nameplate Capacity × 100
 * @param {number} actual - Actual generation (MW)
 * @param {number} capacity - Nameplate/rated capacity (MW)
 * @returns {number} Capacity utilisation (%)
 */
export function capacityUtilisation(actual, capacity) {
  if (capacity === 0) return 0;
  return Math.round((actual / capacity) * 100 * 10) / 10;
}

/**
 * Compute full grid balance object for a data point.
 * @param {Object} dataPoint - Single simulation data point
 * @returns {Object} Grid balance breakdown
 */
export function computeGridBalance(dataPoint) {
  const { demand, solarGeneration, windGeneration, conventionalGeneration } = dataPoint;
  const total = totalGeneration(conventionalGeneration, solarGeneration, windGeneration);
  const surplus = generationSurplus(total, demand);
  const rm = reserveMargin(total, demand);
  const renewFrac = renewableFraction(solarGeneration, windGeneration, total);
  const ci = carbonIntensity(conventionalGeneration, total);
  const availRenewable = solarGeneration + windGeneration;
  const utilisedRenewable = Math.min(availRenewable, demand - conventionalGeneration + solarGeneration + windGeneration);
  const curt = curtailment(availRenewable, utilisedRenewable);
  const curtPct = curtailmentPercent(curt, availRenewable);

  return {
    demand,
    total,
    surplus,
    reserveMargin: rm,
    renewableFraction: renewFrac,
    carbonIntensity: ci,
    curtailment: curt,
    curtailmentPct: curtPct,
    solarGeneration,
    windGeneration,
    conventionalGeneration,
    status: rm < 5 ? 'critical' : rm < 10 ? 'warning' : 'normal',
  };
}

/**
 * Compute curtailment breakdown over a series.
 * @param {Array} dataSeries - Array of data points
 * @returns {Array} Array with curtailment metrics per point
 */
export function computeCurtailmentSeries(dataSeries) {
  return dataSeries.map(p => {
    const available = p.solarGeneration + p.windGeneration;
    const utilised = Math.max(0, available - p.curtailment);
    const cPct = curtailmentPercent(p.curtailment, available);
    return {
      label: p.label,
      timestamp: p.timestamp,
      available,
      utilised,
      curtailed: p.curtailment,
      curtailmentPct: cPct,
      solar: p.solarGeneration,
      wind: p.windGeneration,
    };
  });
}

/**
 * Simple forecast accuracy metrics given actuals and forecasts.
 * @param {Array<number>} actuals
 * @param {Array<number>} forecasts
 * @returns {{ mae: number, rmse: number, mape: number }}
 */
export function forecastAccuracy(actuals, forecasts) {
  if (!actuals || !forecasts || actuals.length === 0) return { mae: 0, rmse: 0, mape: 0 };
  const n = Math.min(actuals.length, forecasts.length);
  let sumAbsErr = 0, sumSqErr = 0, sumAbsPct = 0;
  for (let i = 0; i < n; i++) {
    const err = actuals[i] - forecasts[i];
    sumAbsErr += Math.abs(err);
    sumSqErr += err * err;
    sumAbsPct += actuals[i] !== 0 ? Math.abs(err / actuals[i]) : 0;
  }
  return {
    mae: Math.round((sumAbsErr / n) * 10) / 10,
    rmse: Math.round(Math.sqrt(sumSqErr / n) * 10) / 10,
    mape: Math.round((sumAbsPct / n) * 100 * 10) / 10,
  };
}
