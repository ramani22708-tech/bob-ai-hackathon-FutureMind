import React from 'react';
import { useSimulation } from '../../context/SimulationContext';

const PAGE_TITLES = {
  overview: { title: 'Overview Dashboard', sub: 'Real-time grid monitoring and AI recommendations' },
  demand: { title: 'Demand Forecast', sub: 'AI-powered load forecasting with confidence intervals' },
  renewable: { title: 'Renewable Performance', sub: 'Asset monitoring and anomaly detection' },
  gridbalance: { title: 'Grid Balance', sub: 'Generation-demand equilibrium analysis' },
  insights: { title: 'AI Insights', sub: 'Rule-based AI advisor — data-driven recommendations' },
  curtailment: { title: 'Curtailment Optimisation', sub: 'Minimise renewable energy waste' },
  brief: { title: 'Operator Brief', sub: 'Structured operational report generator' },
  simulation: { title: 'Data Simulation', sub: 'Scenario controls and raw data export' },
  about: { title: 'About GridWise AI', sub: 'IBM BoB AI Innovation Hackathon 2026' },
};

export default function Header({ activePage, onNavigate }) {
  const {
    kpis,
    alertCounts,
    demandLevel,
    solarPerformance,
    windPerformance,
    demoMode,
    startDemoMode,
  } = useSimulation();

  const pageInfo = PAGE_TITLES[activePage] || PAGE_TITLES.overview;
  const now = new Date().toLocaleString('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const hasActiveScenario = demandLevel !== 'normal' || solarPerformance !== 'normal' || windPerformance !== 'normal';

  return (
    <header className="header">
      <div className="header-left">
        {/* IBM BoB — header badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingRight: '18px',
          marginRight: '18px',
          borderRight: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          {/* IBM blue pill */}
          <div style={{
            background: '#1F70C1',
            borderRadius: '6px',
            padding: '4px 10px',
          }}>
            <span style={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '18px',
              fontFamily: '"Segoe UI", Arial, sans-serif',
              letterSpacing: '3px',
              lineHeight: 1,
              display: 'block',
            }}>IBM</span>
          </div>
          {/* BoB text */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '15px',
              fontFamily: '"Segoe UI", Arial, sans-serif',
              letterSpacing: '1px',
            }}>BoB</span>
            <span style={{
              color: 'var(--text-muted)',
              fontSize: '9px',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}>AI INNOVATION</span>
          </div>
        </div>

        <div>
          <div className="header-title">{pageInfo.title}</div>
          <div className="header-subtitle">{pageInfo.sub}</div>
        </div>
      </div>

      <div className="header-right">
        {/* Active scenario indicator */}
        {hasActiveScenario && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,193,7,0.1)',
            border: '1px solid rgba(255,193,7,0.3)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            color: 'var(--accent-amber)',
            fontWeight: 700,
          }}>
            <span>⚡ SCENARIO ACTIVE</span>
          </div>
        )}

        {/* Alert count */}
        {(alertCounts.critical > 0 || alertCounts.warning > 0) && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onNavigate('overview')}
            style={{ gap: '5px' }}
          >
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#fff', animation: 'pulse-dot 1.5s infinite',
              display: 'inline-block',
            }} />
            {alertCounts.critical > 0 ? `${alertCounts.critical} Critical` : `${alertCounts.warning} Warning`}
          </button>
        )}

        {/* Temperature */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}>
          🌡 {kpis.currentTemp || '--'}°C
        </div>

        {/* Live badge */}
        <div className="live-badge">
          <span className="live-dot" />
          LIVE SIM
        </div>

        {/* Clock */}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{now}</div>

        {/* Demo mode button */}
        {!demoMode && (
          <button
            className="btn btn-purple btn-sm"
            onClick={startDemoMode}
          >
            ▶ Demo
          </button>
        )}
      </div>
    </header>
  );
}

