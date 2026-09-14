/**
 * SimulationContext.jsx
 * Global simulation state provider for GridWise AI.
 * Manages all simulation data, scenarios, and derived computations.
 */
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { generateHistoricalData, generateForecast, computeKPIs } from '../data/simulationData';
import { ASSETS, computeAssetGeneration } from '../data/assets';
import { generateDynamicAlerts, countBySeverity } from '../data/alerts';
import { computeGridBalance, computeCurtailmentSeries } from '../utils/calculations';
import { generateDemandForecast, buildForecastChartSeries } from '../utils/forecasting';
import { runAllDetectors } from '../utils/anomalyDetection';
import { generateLoadBalancingRecommendations, generateCurtailmentPlan, generateOperatorBrief } from '../utils/aiInsights';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  // ─── Simulation State ────────────────────────────────────────────────
  const [demandLevel, setDemandLevel] = useState('normal'); // 'normal' | 'high' | 'spike'
  const [solarPerformance, setSolarPerformance] = useState('normal'); // 'normal' | 'underperforming'
  const [windPerformance, setWindPerformance] = useState('normal'); // 'normal' | 'underperforming'
  const [gridConstraint, setGridConstraint] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [timeRange, setTimeRange] = useState('24h'); // '6h' | '12h' | '24h' | '48h'
  const [alertFilter, setAlertFilter] = useState('all');
  const [forecastHorizon, setForecastHorizon] = useState(24); // hours

  // Demo mode state
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // ─── Simulation Overrides ─────────────────────────────────────────────
  const simulationOverrides = useMemo(() => ({
    demandMultiplier: demandLevel === 'spike' ? 1.28 : demandLevel === 'high' ? 1.12 : 1.0,
    solarMultiplier: solarPerformance === 'underperforming' ? 0.4 : 1.0,
    windMultiplier: windPerformance === 'underperforming' ? 0.55 : 1.0,
    anomalySlots: solarPerformance === 'underperforming'
      ? [10, 14, 18, 22, 26, 30, 34, 38, 42]
      : [18, 22, 38],
  }), [demandLevel, solarPerformance, windPerformance]);

  // ─── Raw Historical Data ──────────────────────────────────────────────
  const historicalData = useMemo(
    () => generateHistoricalData(simulationOverrides),
    [simulationOverrides]
  );

  // ─── Time-Filtered Historical Data ───────────────────────────────────
  const currentData = useMemo(() => {
    const slotMap = { '6h': 12, '12h': 24, '24h': 48, '48h': 96 };
    const slots = slotMap[timeRange] || 48;
    return historicalData.slice(-slots);
  }, [historicalData, timeRange]);

  // ─── KPIs ─────────────────────────────────────────────────────────────
  const kpis = useMemo(() => computeKPIs(historicalData), [historicalData]);

  // ─── Forecast Data ────────────────────────────────────────────────────
  const forecastResult = useMemo(
    () => generateDemandForecast(historicalData, forecastHorizon, kpis.currentTemp || 20),
    [historicalData, forecastHorizon, kpis.currentTemp]
  );

  const forecastChartSeries = useMemo(
    () => buildForecastChartSeries(historicalData, forecastResult, 48),
    [historicalData, forecastResult]
  );

  // ─── Anomaly Detection ────────────────────────────────────────────────
  const anomalies = useMemo(() => runAllDetectors(historicalData), [historicalData]);

  // ─── Alerts ───────────────────────────────────────────────────────────
  const simulationState = useMemo(() => ({
    demandLevel,
    solarPerformance,
    windPerformance,
    gridConstraint,
  }), [demandLevel, solarPerformance, windPerformance, gridConstraint]);

  const allAlerts = useMemo(
    () => generateDynamicAlerts(kpis, simulationState),
    [kpis, simulationState]
  );

  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'all') return allAlerts;
    if (alertFilter === 'unacknowledged') return allAlerts.filter(a => !a.acknowledged);
    return allAlerts.filter(a => a.severity === alertFilter);
  }, [allAlerts, alertFilter]);

  const alertCounts = useMemo(() => countBySeverity(allAlerts), [allAlerts]);

  // ─── Grid Balance ─────────────────────────────────────────────────────
  const gridBalance = useMemo(() => {
    const latest = historicalData[historicalData.length - 1];
    return latest ? computeGridBalance(latest) : null;
  }, [historicalData]);

  // ─── Curtailment ─────────────────────────────────────────────────────
  const curtailmentData = useMemo(
    () => computeCurtailmentSeries(currentData),
    [currentData]
  );

  const totalCurtailment = useMemo(
    () => curtailmentData.reduce((s, p) => s + p.curtailed, 0),
    [curtailmentData]
  );

  // ─── Asset Performance ────────────────────────────────────────────────
  const assetPerformance = useMemo(() => {
    const latest = historicalData[historicalData.length - 1];
    if (!latest) return ASSETS;
    return computeAssetGeneration(latest.solarGeneration, latest.windGeneration);
  }, [historicalData]);

  // ─── AI Recommendations ───────────────────────────────────────────────
  const recommendations = useMemo(() => {
    if (!gridBalance) return [];
    return generateLoadBalancingRecommendations(gridBalance, allAlerts);
  }, [gridBalance, allAlerts]);

  const curtailmentPlan = useMemo(
    () => generateCurtailmentPlan(curtailmentData, totalCurtailment),
    [curtailmentData, totalCurtailment]
  );

  const operatorBrief = useMemo(
    () => generateOperatorBrief({
      kpis,
      gridBalance,
      anomalies,
      alerts: allAlerts,
      curtailmentPlan,
      forecastMeta: forecastResult.metadata,
      assets: ASSETS,
    }),
    [kpis, gridBalance, anomalies, allAlerts, curtailmentPlan, forecastResult.metadata]
  );

  // ─── Scenario Actions ─────────────────────────────────────────────────
  const simulateDemandSpike = useCallback(() => {
    setDemandLevel('spike');
  }, []);

  const simulateSolarUnderperformance = useCallback(() => {
    setSolarPerformance('underperforming');
  }, []);

  const simulateWindUnderperformance = useCallback(() => {
    setWindPerformance('underperforming');
  }, []);

  const resetSimulation = useCallback(() => {
    setDemandLevel('normal');
    setSolarPerformance('normal');
    setWindPerformance('normal');
    setGridConstraint(false);
  }, []);

  // ─── Demo Mode ────────────────────────────────────────────────────────
  const DEMO_STEPS = [
    { step: 0, page: 'overview', title: 'Overview Dashboard', description: 'Start with the Overview page: 9 KPIs, live grid status, active alerts, and AI recommendations at a glance.' },
    { step: 1, page: 'demand', title: 'Demand Forecast', description: 'Explore the AI-powered demand forecast with confidence intervals, peak detection, and error metrics.' },
    { step: 2, page: 'renewable', title: 'Renewable Performance', description: 'Review all 6 renewable assets — Solar Farms Alpha, Beta, Gamma and Wind Farms North, West, South.' },
    { step: 3, page: 'simulation', title: 'Trigger Demand Spike', description: 'Use Data Simulation to trigger a demand spike scenario and observe how the grid responds in real time.' },
    { step: 4, page: 'gridbalance', title: 'Grid Balance Analysis', description: 'Observe the generation mix, reserve margin, and real-time surplus/deficit gauge updating with the spike.' },
    { step: 5, page: 'simulation', title: 'Trigger Solar Underperformance', description: 'Simulate a solar underperformance event — modelling panel soiling or weather-related output loss.' },
    { step: 6, page: 'renewable', title: 'Anomaly Flags Active', description: 'Return to Renewable Performance to see anomaly detection flags and root cause analysis activated.' },
    { step: 7, page: 'curtailment', title: 'Curtailment Optimisation', description: 'View the AI-generated curtailment minimisation plan with strategies and recovery potential.' },
    { step: 8, page: 'insights', title: 'AI Insights Chat', description: 'Ask the rule-based AI advisor questions about the grid state — all answers are data-driven.' },
    { step: 9, page: 'brief', title: 'Operator Brief', description: 'Generate a full structured operator brief with all findings, then print or copy it.' },
  ];

  const startDemoMode = useCallback(() => {
    setDemoMode(true);
    setDemoStep(0);
  }, []);

  const nextDemoStep = useCallback(() => {
    setDemoStep(prev => Math.min(prev + 1, DEMO_STEPS.length - 1));
  }, []);

  const prevDemoStep = useCallback(() => {
    setDemoStep(prev => Math.max(prev - 1, 0));
  }, []);

  const exitDemoMode = useCallback(() => {
    setDemoMode(false);
    setDemoStep(0);
  }, []);

  // ─── Context Value ────────────────────────────────────────────────────
  const value = {
    // State
    demandLevel,
    solarPerformance,
    windPerformance,
    gridConstraint,
    selectedAsset,
    timeRange,
    alertFilter,
    forecastHorizon,
    demoMode,
    demoStep,
    demoSteps: DEMO_STEPS,

    // Data
    historicalData,
    currentData,
    kpis,
    forecastResult,
    forecastChartSeries,
    anomalies,
    allAlerts,
    filteredAlerts,
    alertCounts,
    gridBalance,
    curtailmentData,
    totalCurtailment,
    assetPerformance,
    recommendations,
    curtailmentPlan,
    operatorBrief,

    // Actions
    setDemandLevel,
    setSolarPerformance,
    setWindPerformance,
    setGridConstraint,
    selectAsset: setSelectedAsset,
    setTimeRange,
    setAlertFilter,
    setForecastHorizon,
    simulateDemandSpike,
    simulateSolarUnderperformance,
    simulateWindUnderperformance,
    resetSimulation,
    startDemoMode,
    nextDemoStep,
    prevDemoStep,
    exitDemoMode,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
