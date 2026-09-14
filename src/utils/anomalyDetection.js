/**
 * anomalyDetection.js
 * Statistical and threshold-based anomaly detection for GridWise AI.
 * Uses Z-score and threshold methods — transparent, rule-based.
 */

/**
 * Compute Z-score for a value relative to a population.
 * Z = (x − μ) / σ
 * @param {number} value
 * @param {number} mean
 * @param {number} stddev
 * @returns {number}
 */
export function zScore(value, mean, stddev) {
  if (stddev === 0) return 0;
  return (value - mean) / stddev;
}

/**
 * Compute mean of an array.
 */
export function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

/**
 * Compute standard deviation of an array.
 */
export function stddev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

const POSSIBLE_SOLAR_CAUSES = [
  'Panel soiling / dust accumulation',
  'Partial shading from vegetation or structures',
  'Inverter efficiency loss or fault',
  'Degraded module string',
  'High ambient temperature reducing panel efficiency',
  'Cloud cover exceeding forecast',
  'Sensor calibration drift',
];

const POSSIBLE_WIND_CAUSES = [
  'Wind speed below cut-in velocity',
  'Turbine yaw misalignment',
  'Blade pitch control issue',
  'Gearbox efficiency loss',
  'Turbine wake effect from upstream turbines',
  'Icing on blades (if applicable)',
  'Planned maintenance reducing available turbines',
];

/**
 * Detect solar generation anomalies across all time periods.
 * @param {Array} dataSeries - Historical data points
 * @param {string} assetId - Asset identifier
 * @param {number} zThreshold - Z-score threshold (default 2.5)
 * @param {number} ratioThreshold - Threshold for ratio method (default 0.7)
 * @returns {Array} Detected anomalies
 */
export function detectSolarAnomalies(dataSeries, assetId = 'solar-alpha', zThreshold = 2.5, ratioThreshold = 0.7) {
  // Only look at daytime points (solar curve should be > 0)
  const daytime = dataSeries.filter(p => p.hour >= 6 && p.hour <= 20 && p.solarGeneration !== undefined);
  if (daytime.length < 3) return [];

  const values = daytime.map(p => p.solarGeneration);
  const m = mean(values);
  const s = stddev(values);

  const anomalies = [];

  daytime.forEach(p => {
    const z = zScore(p.solarGeneration, m, s);
    const expectedForHour = estimateExpectedSolar(p.hour, 600);
    const ratio = expectedForHour > 0 ? p.solarGeneration / expectedForHour : 1;
    const isZAnomaly = z < -zThreshold;
    const isRatioAnomaly = expectedForHour > 50 && ratio < ratioThreshold;

    if (isZAnomaly || isRatioAnomaly) {
      const deviation = expectedForHour > 0
        ? Math.round((1 - ratio) * 100)
        : Math.round(Math.abs(z) * 10);

      const severity = deviation > 50 ? 'critical' : deviation > 30 ? 'warning' : 'info';

      // Select top 3 most likely causes based on deviation magnitude
      const causes = POSSIBLE_SOLAR_CAUSES
        .slice(0, deviation > 50 ? 4 : 3)
        .map((c, i) => ({ cause: c, probability: Math.round((100 - i * 15) * (deviation / 100)) + '%' }));

      anomalies.push({
        id: `anom-solar-${p.index}`,
        assetId,
        assetName: 'Solar Farm Alpha',
        assetType: 'solar',
        timestamp: p.timestamp,
        label: p.label,
        actual: p.solarGeneration,
        expected: Math.round(expectedForHour),
        deviation,
        deviationMW: Math.round(expectedForHour - p.solarGeneration),
        zScore: Math.round(z * 100) / 100,
        severity,
        type: isZAnomaly ? 'statistical' : 'threshold',
        detectionMethod: isZAnomaly ? 'Z-score (|z| > 2.5)' : 'Threshold (actual < 70% expected)',
        possibleCauses: causes,
        temperature: p.temperature,
        cloudCover: p.cloudCover,
        windSpeed: p.windSpeed,
        hour: p.hour,
      });
    }
  });

  return anomalies;
}

/**
 * Detect wind generation anomalies.
 * @param {Array} dataSeries
 * @returns {Array}
 */
export function detectWindAnomalies(dataSeries) {
  const windPoints = dataSeries.filter(p => p.windGeneration !== undefined);
  if (windPoints.length < 3) return [];

  const values = windPoints.map(p => p.windGeneration);
  const m = mean(values);
  const s = stddev(values);
  const anomalies = [];

  windPoints.forEach(p => {
    const z = zScore(p.windGeneration, m, s);
    const expectedWind = estimateExpectedWind(p.windSpeed || 7);
    const ratio = expectedWind > 0 ? p.windGeneration / expectedWind : 1;

    if (z < -2.5 || ratio < 0.6) {
      const deviation = Math.round((1 - ratio) * 100);
      const severity = deviation > 40 ? 'warning' : 'info';

      const causes = POSSIBLE_WIND_CAUSES
        .slice(0, 3)
        .map((c, i) => ({ cause: c, probability: Math.round((85 - i * 15) * (deviation / 100)) + '%' }));

      anomalies.push({
        id: `anom-wind-${p.index}`,
        assetId: 'wind-south',
        assetName: 'Wind Farm South',
        assetType: 'wind',
        timestamp: p.timestamp,
        label: p.label,
        actual: p.windGeneration,
        expected: Math.round(expectedWind),
        deviation,
        deviationMW: Math.round(expectedWind - p.windGeneration),
        zScore: Math.round(z * 100) / 100,
        severity,
        type: 'statistical',
        detectionMethod: 'Z-score (|z| > 2.5)',
        possibleCauses: causes,
        windSpeed: p.windSpeed,
        temperature: p.temperature,
        hour: p.hour,
      });
    }
  });

  return anomalies;
}

/**
 * Detect demand anomalies (spikes or unexpected drops).
 * @param {Array} dataSeries
 * @returns {Array}
 */
export function detectDemandAnomalies(dataSeries) {
  if (dataSeries.length < 5) return [];
  const values = dataSeries.map(p => p.demand);
  const m = mean(values);
  const s = stddev(values);
  const anomalies = [];

  dataSeries.forEach(p => {
    const z = zScore(p.demand, m, s);
    if (Math.abs(z) > 2.8) {
      anomalies.push({
        id: `anom-demand-${p.index}`,
        assetId: null,
        assetName: 'Grid Demand',
        assetType: 'demand',
        timestamp: p.timestamp,
        label: p.label,
        actual: p.demand,
        expected: Math.round(m),
        deviation: Math.abs(Math.round((p.demand - m) / m * 100)),
        zScore: Math.round(z * 100) / 100,
        severity: Math.abs(z) > 3.5 ? 'critical' : 'warning',
        type: 'statistical',
        detectionMethod: 'Z-score (|z| > 2.8)',
        possibleCauses: [
          { cause: 'Unexpected large load connection', probability: '45%' },
          { cause: 'Temperature-driven demand surge', probability: '30%' },
          { cause: 'Industrial load change', probability: '15%' },
        ],
        temperature: p.temperature,
        hour: p.hour,
      });
    }
  });

  return anomalies;
}

/**
 * Run all anomaly detectors and return combined results.
 * @param {Array} dataSeries
 * @returns {Array} All detected anomalies sorted by severity
 */
export function runAllDetectors(dataSeries) {
  const solar = detectSolarAnomalies(dataSeries);
  const wind = detectWindAnomalies(dataSeries);
  const demand = detectDemandAnomalies(dataSeries);
  const all = [...solar, ...wind, ...demand];
  const order = { critical: 0, warning: 1, info: 2 };
  return all.sort((a, b) => order[a.severity] - order[b.severity]);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function estimateExpectedSolar(hour, peakCapacity = 600) {
  if (hour < 6 || hour > 20) return 0;
  const mid = 12.5;
  const val = Math.max(0, Math.cos(((hour - mid) / 7.0) * Math.PI * 0.9));
  return val * peakCapacity * 0.75; // 75% cloud-adjusted expected
}

function estimateExpectedWind(windSpeed, ratedCapacity = 560) {
  // Simple cubic wind power approximation with cut-in at 3m/s, rated at 12m/s
  if (windSpeed < 3) return 0;
  if (windSpeed > 12) return ratedCapacity;
  const fraction = Math.min(1, ((windSpeed - 3) / 9) ** 2);
  return ratedCapacity * fraction;
}
