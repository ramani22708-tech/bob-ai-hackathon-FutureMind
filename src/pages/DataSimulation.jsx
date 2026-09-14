import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';

function exportCSV(data) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
  const rows = data.map(p =>
    headers.map(h => {
      const v = p[h];
      return typeof v === 'string' && v.includes(',') ? `"${v}"` : v;
    }).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gridwise-simulation-data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function DataSimulation() {
  const {
    demandLevel, setDemandLevel,
    solarPerformance, setSolarPerformance,
    windPerformance, setWindPerformance,
    gridConstraint, setGridConstraint,
    timeRange, setTimeRange,
    currentData,
    kpis,
    simulateDemandSpike,
    simulateSolarUnderperformance,
    simulateWindUnderperformance,
    resetSimulation,
    historicalData,
  } = useSimulation();

  const [showRaw, setShowRaw] = useState(false);
  const [demandSlider, setDemandSlider] = useState(100);
  const [solarSlider, setSolarSlider] = useState(100);
  const [windSlider, setWindSlider] = useState(100);

  const activeScenario = demandLevel !== 'normal' || solarPerformance !== 'normal' || windPerformance !== 'normal' || gridConstraint;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">🧪 Data Simulation</h1>
            <p className="page-subtitle">Scenario controls, parameter adjustment, and raw data export — Simulated Data</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="sim-tag">Simulated Data</span>
            {activeScenario && (
              <span className="badge badge-warning">⚡ Scenario Active</span>
            )}
          </div>
        </div>
      </div>

      {/* Scenario Buttons */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="chart-title" style={{ marginBottom: '14px' }}>⚡ Quick Scenario Triggers</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button
            className={`btn ${demandLevel === 'spike' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={simulateDemandSpike}
          >
            🔴 Demand Spike (+28%)
          </button>
          <button
            className={`btn ${demandLevel === 'high' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => setDemandLevel('high')}
          >
            🟡 High Demand (+12%)
          </button>
          <button
            className={`btn ${solarPerformance === 'underperforming' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={simulateSolarUnderperformance}
          >
            ☀️ Solar Underperformance (−60%)
          </button>
          <button
            className={`btn ${windPerformance === 'underperforming' ? 'btn-amber' : 'btn-secondary'}`}
            onClick={simulateWindUnderperformance}
          >
            💨 Wind Underperformance (−45%)
          </button>
          <button
            className={`btn ${gridConstraint ? 'btn-amber' : 'btn-secondary'}`}
            onClick={() => setGridConstraint(v => !v)}
          >
            🔒 Grid Constraint {gridConstraint ? 'ON' : 'OFF'}
          </button>
          <button
            className="btn btn-success"
            onClick={resetSimulation}
          >
            ✅ Reset All
          </button>
        </div>

        {activeScenario && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(255,193,7,0.08)',
            border: '1px solid rgba(255,193,7,0.25)',
            borderRadius: '6px',
            fontSize: '12px',
            color: 'var(--accent-amber)',
          }}>
            ⚠ Active scenario: {[
              demandLevel !== 'normal' && `Demand ${demandLevel === 'spike' ? 'Spike' : 'High'}`,
              solarPerformance !== 'normal' && 'Solar Underperformance',
              windPerformance !== 'normal' && 'Wind Underperformance',
              gridConstraint && 'Grid Constraint',
            ].filter(Boolean).join(' + ')}. Charts and KPIs are updating to reflect the scenario.
          </div>
        )}
      </div>

      {/* Current State Summary */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Demand Level', val: demandLevel.toUpperCase(), color: demandLevel === 'spike' ? 'var(--accent-red)' : demandLevel === 'high' ? 'var(--accent-amber)' : 'var(--accent-green)' },
          { label: 'Solar Performance', val: solarPerformance.toUpperCase(), color: solarPerformance !== 'normal' ? 'var(--accent-amber)' : 'var(--accent-green)' },
          { label: 'Wind Performance', val: windPerformance.toUpperCase(), color: windPerformance !== 'normal' ? 'var(--accent-amber)' : 'var(--accent-green)' },
          { label: 'Grid Constraint', val: gridConstraint ? 'ACTIVE' : 'NONE', color: gridConstraint ? 'var(--accent-amber)' : 'var(--accent-green)' },
        ].map((s, i) => (
          <div key={i} className="card card-hover">
            <div className="kpi-label">{s.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: s.color, marginTop: '6px' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Time Range */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="chart-header">
          <div className="chart-title">🕐 Time Range</div>
        </div>
        <div className="tab-bar" style={{ display: 'inline-flex' }}>
          {['6h', '12h', '24h', '48h'].map(t => (
            <button
              key={t}
              className={`tab-btn${timeRange === t ? ' active' : ''}`}
              onClick={() => setTimeRange(t)}
            >
              Last {t}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing {currentData.length} data points ({timeRange} at 30-min intervals)
        </div>
      </div>

      {/* KPI Summary under scenario */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="chart-title" style={{ marginBottom: '12px' }}>📊 Current Scenario KPIs</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {[
            { label: 'Demand', val: `${kpis.currentDemand?.toLocaleString()} MW` },
            { label: 'Solar', val: `${kpis.currentSolar?.toLocaleString()} MW` },
            { label: 'Wind', val: `${kpis.currentWind?.toLocaleString()} MW` },
            { label: 'Conventional', val: `${kpis.conventionalGeneration?.toLocaleString()} MW` },
            { label: 'Total Gen', val: `${kpis.totalGeneration?.toLocaleString()} MW` },
            { label: 'Renewable %', val: `${kpis.renewablePct}%` },
            { label: 'Reserve Margin', val: `${kpis.reserveMargin}%` },
            { label: 'Curtailment', val: `${kpis.curtailmentTotal?.toLocaleString()} MW` },
            { label: 'Carbon', val: `${kpis.carbonIntensity} gCO₂/kWh` },
            { label: 'Temperature', val: `${kpis.currentTemp}°C` },
          ].map((k, i) => (
            <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '10px 12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{k.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export + Raw Data */}
      <div className="card">
        <div className="chart-header">
          <div>
            <div className="chart-title">📂 Raw Simulation Data</div>
            <div className="chart-sub">{historicalData.length} data points (48h × 30-min intervals)</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowRaw(v => !v)}>
              {showRaw ? 'Hide Table' : 'Show Table'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => exportCSV(historicalData)}>
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {showRaw && (
          <div style={{ maxHeight: '360px', overflowY: 'auto', overflowX: 'auto', marginTop: '8px' }}>
            <table className="data-table" style={{ minWidth: '900px' }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Demand (MW)</th>
                  <th>Solar (MW)</th>
                  <th>Wind (MW)</th>
                  <th>Conventional (MW)</th>
                  <th>Surplus (MW)</th>
                  <th>Curtailment (MW)</th>
                  <th>Temp (°C)</th>
                  <th>Cloud %</th>
                  <th>Wind m/s</th>
                  <th>Anomaly</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((p, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'monospace' }}>{p.label}</td>
                    <td style={{ color: 'var(--accent-blue)' }}>{p.demand?.toLocaleString()}</td>
                    <td style={{ color: '#ffc107' }}>{p.solarGeneration?.toLocaleString()}</td>
                    <td style={{ color: '#2196f3' }}>{p.windGeneration?.toLocaleString()}</td>
                    <td style={{ color: '#9c27b0' }}>{p.conventionalGeneration?.toLocaleString()}</td>
                    <td style={{ color: p.surplus >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {p.surplus >= 0 ? '+' : ''}{p.surplus?.toLocaleString()}
                    </td>
                    <td style={{ color: p.curtailment > 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                      {p.curtailment?.toLocaleString()}
                    </td>
                    <td>{p.temperature}</td>
                    <td>{p.cloudCover}</td>
                    <td>{p.windSpeed}</td>
                    <td>
                      {p.isAnomaly && <span className="badge badge-warning" style={{ fontSize: '9px' }}>⚠ ANOMALY</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!showRaw && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Click "Show Table" to inspect raw simulation data, or "Export CSV" to download all 96 data points.
          </div>
        )}
      </div>
    </div>
  );
}
