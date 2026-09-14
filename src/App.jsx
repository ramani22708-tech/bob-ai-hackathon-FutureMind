import React, { useState } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import Layout from './components/Layout/Layout';
import Overview from './pages/Overview';
import DemandForecast from './pages/DemandForecast';
import RenewablePerformance from './pages/RenewablePerformance';
import GridBalance from './pages/GridBalance';
import AIInsights from './pages/AIInsights';
import CurtailmentOptimisation from './pages/CurtailmentOptimisation';
import OperatorBrief from './pages/OperatorBrief';
import DataSimulation from './pages/DataSimulation';
import AboutProject from './pages/AboutProject';

const PAGES = {
  overview: Overview,
  demand: DemandForecast,
  renewable: RenewablePerformance,
  gridbalance: GridBalance,
  insights: AIInsights,
  curtailment: CurtailmentOptimisation,
  brief: OperatorBrief,
  simulation: DataSimulation,
  about: AboutProject,
};

function AppInner() {
  const [activePage, setActivePage] = useState('overview');
  const {
    demoMode,
    demoStep,
    demoSteps,
    nextDemoStep,
    prevDemoStep,
    exitDemoMode,
    simulateDemandSpike,
    simulateSolarUnderperformance,
    resetSimulation,
  } = useSimulation();

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  // Sync demo navigation
  const currentDemoStep = demoSteps[demoStep];
  React.useEffect(() => {
    if (demoMode && currentDemoStep) {
      setActivePage(currentDemoStep.page);
      // Execute scenario for certain steps
      if (currentDemoStep.step === 3) simulateDemandSpike();
      if (currentDemoStep.step === 5) simulateSolarUnderperformance();
      if (currentDemoStep.step === 0) resetSimulation();
    }
  }, [demoStep, demoMode]);

  const PageComponent = PAGES[activePage] || Overview;

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      <PageComponent onNavigate={handleNavigate} />

      {/* Demo Mode Panel */}
      {demoMode && (
        <DemoPanel
          step={demoStep}
          steps={demoSteps}
          onNext={nextDemoStep}
          onPrev={prevDemoStep}
          onExit={exitDemoMode}
        />
      )}
    </Layout>
  );
}

function DemoPanel({ step, steps, onNext, onPrev, onExit }) {
  const current = steps[step];

  return (
    <div className="demo-panel">
      {/* Header */}
      <div className="demo-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>▶</span>
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Demo Mode</span>
          <span className="badge badge-info" style={{ fontSize: '10px' }}>{step + 1}/{steps.length}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onExit} style={{ padding: '2px 6px' }}>✕</button>
      </div>

      {/* Current Step */}
      <div style={{
        background: 'rgba(33,150,243,0.08)',
        border: '1px solid rgba(33,150,243,0.2)',
        borderRadius: '8px',
        padding: '12px 14px',
        marginBottom: '12px',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '4px' }}>
          Step {step + 1}: {current?.title}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {current?.description}
        </div>
      </div>

      {/* Step Progress Dots */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', justifyContent: 'center' }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              width: i === step ? '16px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i < step ? 'var(--accent-green)' :
                          i === step ? 'var(--accent-blue)' :
                          'var(--border)',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={onPrev}
          disabled={step === 0}
          style={{ flex: 1 }}
        >
          ← Prev
        </button>
        <button
          className={`btn btn-sm ${step === steps.length - 1 ? 'btn-success' : 'btn-primary'}`}
          onClick={step === steps.length - 1 ? onExit : onNext}
          style={{ flex: 1 }}
        >
          {step === steps.length - 1 ? '✅ Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppInner />
    </SimulationProvider>
  );
}
