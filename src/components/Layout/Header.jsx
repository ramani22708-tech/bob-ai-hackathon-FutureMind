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
        {/* IBM Official Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          paddingRight: '16px',
          marginRight: '16px',
          borderRight: '1px solid var(--border)',
        }}>
          <IBMLogo />
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

// ─── IBM 8-Bar Stripe Wordmark ───────────────────────────────────────────────
// Faithful recreation of IBM's iconic 8-horizontal-stripe logo in IBM blue.
function IBMLogo() {
  const c = '#1F70C1'; // IBM blue
  // Each letter uses 8 horizontal stripes (bars) with equal gaps
  // Stripe height = 3px, gap = 2px → unit = 5px, total height = 8×3 + 7×2 = 38px
  const bh = 3;   // bar height
  const gap = 2;  // gap between bars
  const u = bh + gap; // 5px per row

  // rows 0-7 y-positions
  const y = Array.from({ length: 8 }, (_, i) => i * u);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 38"
      width="80"
      height="38"
      aria-label="IBM"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* ── I ── x: 0–13 */}
      {y.map((yi, i) => <rect key={`i${i}`} x={0} y={yi} width={13} height={bh} fill={c} />)}

      {/* ── B ── x: 18–43  */}
      {/* 8 left bars */}
      {y.map((yi, i) => <rect key={`bl${i}`} x={18} y={yi} width={13} height={bh} fill={c} />)}
      {/* top bump: rows 0-2, right bar + connector */}
      <rect x={31} y={y[0]} width={12} height={bh} fill={c} />
      <rect x={31} y={y[1]} width={12} height={bh} fill={c} />
      <rect x={42} y={y[0]} width={bh} height={u + bh} fill={c} />
      {/* middle bump: rows 3-5 */}
      <rect x={31} y={y[3]} width={13} height={bh} fill={c} />
      <rect x={31} y={y[4]} width={13} height={bh} fill={c} />
      <rect x={43} y={y[3]} width={bh} height={u + bh} fill={c} />
      {/* bottom bump: rows 6-7 */}
      <rect x={31} y={y[6]} width={12} height={bh} fill={c} />
      <rect x={31} y={y[7]} width={12} height={bh} fill={c} />
      <rect x={42} y={y[6]} width={bh} height={u + bh} fill={c} />

      {/* ── M ── x: 48–80 */}
      {/* left column */}
      {y.map((yi, i) => <rect key={`ml${i}`} x={48} y={yi} width={13} height={bh} fill={c} />)}
      {/* right column */}
      {y.map((yi, i) => <rect key={`mr${i}`} x={67} y={yi} width={13} height={bh} fill={c} />)}
      {/* center V-shape (rows 0–3 descend, rows 4–7 ascend) */}
      <rect x={59} y={y[0]} width={10} height={bh} fill={c} />
      <rect x={60} y={y[1]} width={8}  height={bh} fill={c} />
      <rect x={61} y={y[2]} width={6}  height={bh} fill={c} />
      <rect x={62} y={y[3]} width={4}  height={bh} fill={c} />
    </svg>
  );
}
