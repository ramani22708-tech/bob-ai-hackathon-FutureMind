import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import ChartWrapper from '../components/Common/ChartWrapper';
import StatusIndicator from '../components/Common/StatusIndicator';
import { AssetPerformanceBarChart } from '../components/Charts/RenewableChart';
import { generateAnomalyExplanation, generateRootCauseAnalysis } from '../utils/aiInsights';
import { getAssetById } from '../data/assets';

export default function RenewablePerformance() {
  const { assetPerformance, anomalies, historicalData, kpis } = useSimulation();
  const [selectedAsset, setSelectedAsset] = useState(null);

  const selectedData = selectedAsset ? assetPerformance.find(a => a.id === selectedAsset) : null;
  const assetAnomaly = selectedData
    ? anomalies.find(a => a.assetId === selectedData.id) || null
    : null;

  const solar = assetPerformance.filter(a => a.type === 'solar');
  const wind = assetPerformance.filter(a => a.type === 'wind');

  const statusColors = {
    operational: 'var(--accent-green)',
    warning: 'var(--accent-amber)',
    maintenance: 'var(--accent-red)',
  };

  const getPerformanceColor = (pr) =>
    pr > 0.85 ? 'var(--accent-green)' :
    pr > 0.7 ? 'var(--accent-amber)' :
    'var(--accent-red)';

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">☀️💨 Renewable Asset Performance</h1>
            <p className="page-subtitle">Asset monitoring, anomaly detection, and performance analysis — Simulated Data</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="sim-tag">Simulated Data</span>
            {anomalies.length > 0 && (
              <span className="badge badge-warning">{anomalies.length} Anomalies</span>
            )}
          </div>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        <div className="card card-hover">
          <div className="kpi-label">Total Capacity</div>
          <div className="kpi-value" style={{ fontSize: '22px', color: 'var(--accent-blue)' }}>1,030 <span style={{ fontSize: '12px' }}>MW</span></div>
          <div className="card-sub">6 assets combined</div>
        </div>
        <div className="card card-hover">
          <div className="kpi-label">Fleet Performance</div>
          <div className="kpi-value" style={{ fontSize: '22px', color: 'var(--accent-green)' }}>
            {Math.round(assetPerformance.reduce((s, a) => s + a.performanceRatio, 0) / assetPerformance.length * 100)}%
          </div>
          <div className="card-sub">Weighted avg PR</div>
        </div>
        <div className="card card-hover">
          <div className="kpi-label">Fleet Availability</div>
          <div className="kpi-value" style={{ fontSize: '22px', color: 'var(--accent-amber)' }}>
            {Math.round(assetPerformance.reduce((s, a) => s + a.availability, 0) / assetPerformance.length * 10) / 10}%
          </div>
          <div className="card-sub">Avg across fleet</div>
        </div>
        <div className="card card-hover">
          <div className="kpi-label">Anomalies Detected</div>
          <div className="kpi-value" style={{ fontSize: '22px', color: anomalies.length > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {anomalies.length}
          </div>
          <div className="card-sub">Statistical + threshold</div>
        </div>
      </div>

      {/* Solar Assets */}
      <div style={{ marginBottom: '8px' }}>
        <div className="section-title">☀️ Solar Assets</div>
      </div>
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        {solar.map(asset => (
          <AssetCard
            key={asset.id}
            asset={asset}
            anomalies={anomalies}
            selected={selectedAsset === asset.id}
            onSelect={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
            statusColors={statusColors}
            getPerformanceColor={getPerformanceColor}
          />
        ))}
      </div>

      {/* Wind Assets */}
      <div style={{ marginBottom: '8px' }}>
        <div className="section-title">💨 Wind Assets</div>
      </div>
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        {wind.map(asset => (
          <AssetCard
            key={asset.id}
            asset={asset}
            anomalies={anomalies}
            selected={selectedAsset === asset.id}
            onSelect={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
            statusColors={statusColors}
            getPerformanceColor={getPerformanceColor}
          />
        ))}
      </div>

      {/* Asset Detail Panel */}
      {selectedData && (
        <div className="card" style={{ marginBottom: '20px', border: '1px solid var(--accent-blue)' }}>
          <div className="chart-header">
            <div>
              <div className="chart-title">
                {selectedData.type === 'solar' ? '☀️' : '💨'} {selectedData.name} — Detail View
              </div>
              <div className="chart-sub">{selectedData.zone} · {selectedData.capacity} MW capacity</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <StatusIndicator status={selectedData.status} label={selectedData.status} />
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedAsset(null)}>✕ Close</button>
            </div>
          </div>

          <div className="grid-2">
            {/* Asset Metrics */}
            <div>
              <div className="grid-2" style={{ gap: '10px', marginBottom: '14px' }}>
                {[
                  { label: 'Performance Ratio', value: `${Math.round(selectedData.performanceRatio * 100)}%`, color: getPerformanceColor(selectedData.performanceRatio) },
                  { label: 'Availability', value: `${selectedData.availability}%`, color: 'var(--accent-blue)' },
                  { label: 'Actual Output', value: `${selectedData.actual?.toLocaleString()} MW`, color: 'var(--text-primary)' },
                  { label: 'Expected Output', value: `${selectedData.expected?.toLocaleString()} MW`, color: 'var(--text-muted)' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: m.color, marginTop: '2px' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.65', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '12px' }}>
                {selectedData.description}
              </div>

              {selectedData.alerts?.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  {selectedData.alerts.map(a => (
                    <span key={a} className="badge badge-warning" style={{ marginRight: '4px', textTransform: 'capitalize' }}>
                      {a.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Anomaly / AI Analysis */}
            <div>
              {assetAnomaly ? (
                <div>
                  <div className="badge badge-critical" style={{ marginBottom: '10px' }}>⚠ Anomaly Detected</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
                    {generateAnomalyExplanation(assetAnomaly, selectedData)}
                  </div>
                  <div style={{ background: 'rgba(156,39,176,0.06)', border: '1px solid rgba(156,39,176,0.2)', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#ce93d8', marginBottom: '8px', textTransform: 'uppercase' }}>
                      🤖 Root Cause Analysis
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
                      {generateRootCauseAnalysis(assetAnomaly)}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="badge badge-normal" style={{ alignSelf: 'flex-start' }}>✅ No Anomalies</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                    {selectedData.name} is operating within normal statistical bounds. No threshold violations or Z-score anomalies detected in the current monitoring period.
                  </p>
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Performance Breakdown</div>
                    {[
                      { label: 'Output vs Capacity', pct: Math.round((selectedData.actual / selectedData.capacity) * 100) },
                      { label: 'Performance Ratio', pct: Math.round(selectedData.performanceRatio * 100) },
                      { label: 'Availability', pct: Math.round(selectedData.availability) },
                    ].map((m, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                          <span>{m.label}</span><span>{m.pct}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.pct > 80 ? 'var(--accent-green)' : m.pct > 60 ? 'var(--accent-amber)' : 'var(--accent-red)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fleet Performance Chart */}
      <ChartWrapper
        title="Fleet Performance Comparison"
        subtitle="Performance Ratio % and Availability % across all 6 assets"
      >
        <AssetPerformanceBarChart assets={assetPerformance} height={260} />
      </ChartWrapper>

      {/* Anomaly Table */}
      {anomalies.length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="chart-header">
            <div className="chart-title">🔍 Detected Anomalies</div>
            <span className="ai-tag">Rule-Based AI Detection</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Time</th>
                <th>Actual</th>
                <th>Expected</th>
                <th>Deviation</th>
                <th>Z-Score</th>
                <th>Method</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.slice(0, 10).map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.assetName}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{a.label}</td>
                  <td style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{a.actual} MW</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{a.expected} MW</td>
                  <td>
                    <span className={`badge badge-${a.severity}`}>-{a.deviation}%</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{a.zScore}</td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.type}</td>
                  <td><span className={`badge badge-${a.severity}`}>{a.severity.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AssetCard({ asset, anomalies, selected, onSelect, statusColors, getPerformanceColor }) {
  const hasAnomaly = anomalies.some(a => a.assetId === asset.id);
  const prPct = Math.round(asset.performanceRatio * 100);

  return (
    <div
      className={`asset-card${selected ? ' selected' : ''}`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '16px' }}>{asset.type === 'solar' ? '☀️' : '💨'}</span>
            <span style={{ fontWeight: 700, fontSize: '13px' }}>{asset.name}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{asset.zone} · {asset.capacity} MW</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{
            background: statusColors[asset.status] + '22',
            color: statusColors[asset.status],
            border: `1px solid ${statusColors[asset.status]}44`,
            borderRadius: '4px',
            padding: '2px 7px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}>
            {asset.status}
          </span>
          {hasAnomaly && (
            <span className="badge badge-warning" style={{ fontSize: '9px', padding: '1px 5px' }}>⚠ ANOMALY</span>
          )}
        </div>
      </div>

      {/* Performance Ratio */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <span>Performance Ratio</span>
          <span style={{ color: getPerformanceColor(asset.performanceRatio), fontWeight: 700 }}>{prPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${prPct}%`,
            background: getPerformanceColor(asset.performanceRatio),
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
        <span>Avail: <strong style={{ color: 'var(--text-primary)' }}>{asset.availability}%</strong></span>
        <span>
          Output: <strong style={{ color: getPerformanceColor(asset.performanceRatio) }}>
            {asset.actual?.toLocaleString()} MW
          </strong>
        </span>
      </div>

      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
        Click for details & AI analysis
      </div>
    </div>
  );
}
