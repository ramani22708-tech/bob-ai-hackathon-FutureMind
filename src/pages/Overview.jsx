import React, { useMemo } from 'react';
import { useSimulation } from '../context/SimulationContext';
import KPICard from '../components/Common/KPICard';
import ChartWrapper from '../components/Common/ChartWrapper';
import StatusIndicator from '../components/Common/StatusIndicator';
import GridBalanceChart from '../components/Charts/GridBalanceChart';
import { CurtailmentTrendLine } from '../components/Charts/CurtailmentChart';

export default function Overview({ onNavigate }) {
  const {
    kpis,
    currentData,
    allAlerts,
    recommendations,
    assetPerformance,
    gridBalance,
    curtailmentData,
    anomalies,
  } = useSimulation();

  const unacknowledgedAlerts = allAlerts.filter(a => !a.acknowledged).slice(0, 5);

  const gridStatusColor =
    gridBalance?.status === 'critical' ? 'var(--accent-red)' :
    gridBalance?.status === 'warning' ? 'var(--accent-amber)' :
    'var(--accent-green)';

  // Build chart data for last 24h overview
  const chartData = currentData.slice(-48);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">⚡ GridWise AI — Overview</h1>
            <p className="page-subtitle">Real-time grid monitoring, AI insights, and asset health summary</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="sim-tag">Simulated Data</span>
            <span className="ai-tag">AI-Powered</span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              background: gridBalance?.status === 'critical' ? 'rgba(244,67,54,0.15)' :
                          gridBalance?.status === 'warning' ? 'rgba(255,193,7,0.12)' :
                          'rgba(0,230,118,0.1)',
              color: gridStatusColor,
              border: `1px solid ${gridStatusColor}44`,
            }}>
              Grid: {gridBalance?.status?.toUpperCase() || 'NORMAL'}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards — 3-col grid */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <KPICard
          title="Current Demand"
          value={kpis.currentDemand}
          unit="MW"
          color="var(--accent-blue)"
          icon="🔌"
          trend={kpis.currentDemand > kpis.avgDemand ? 'up' : 'down'}
          trendLabel={`${kpis.avgDemand?.toLocaleString()} MW avg`}
          sub="Live load demand"
        />
        <KPICard
          title="Solar Generation"
          value={kpis.currentSolar}
          unit="MW"
          color="var(--accent-amber)"
          icon="☀️"
          trend="neutral"
          trendLabel={`${kpis.avgSolar} MW avg 24h`}
          sub="3 assets — 470 MW capacity"
        />
        <KPICard
          title="Wind Generation"
          value={kpis.currentWind}
          unit="MW"
          color="var(--accent-blue)"
          icon="💨"
          trend="neutral"
          trendLabel={`${kpis.avgWind} MW avg 24h`}
          sub="3 assets — 560 MW capacity"
        />
        <KPICard
          title="Renewable Fraction"
          value={kpis.renewablePct}
          unit="%"
          color="var(--accent-green)"
          icon="♻️"
          trend={kpis.renewablePct > 50 ? 'up' : 'neutral'}
          trendLabel="of total generation"
          sub="Solar + Wind share"
        />
        <KPICard
          title="Reserve Margin"
          value={kpis.reserveMargin}
          unit="%"
          color={kpis.reserveMargin < 8 ? 'var(--accent-red)' : kpis.reserveMargin < 12 ? 'var(--accent-amber)' : 'var(--accent-green)'}
          icon="🛡️"
          trend={kpis.reserveMargin < 8 ? 'down' : 'up'}
          trendLabel="Target ≥ 8%"
          sub="N-1 contingency buffer"
          badge={kpis.reserveMargin < 8 ? { type: 'critical', label: 'Low' } : kpis.reserveMargin < 12 ? { type: 'warning', label: 'Caution' } : null}
        />
        <KPICard
          title="Grid Balance"
          value={kpis.gridBalance}
          unit="MW"
          color={kpis.gridBalance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
          icon="⚖️"
          trend={kpis.gridBalance >= 0 ? 'up' : 'down'}
          trendLabel={kpis.gridBalance >= 0 ? 'Generation surplus' : 'Generation deficit'}
          sub="Total generation − Demand"
        />
        <KPICard
          title="Curtailment"
          value={kpis.curtailmentTotal}
          unit="MW"
          color="var(--accent-red)"
          icon="✂️"
          trend="neutral"
          trendLabel={`${kpis.curtailmentPct}% of renewable`}
          sub="Renewable energy wasted"
        />
        <KPICard
          title="Carbon Intensity"
          value={kpis.carbonIntensity}
          unit="gCO₂e/kWh"
          color="var(--accent-purple)"
          icon="🌿"
          trend={kpis.carbonIntensity < 200 ? 'up' : 'down'}
          trendLabel={kpis.carbonIntensity < 200 ? 'Low carbon' : 'High conventional'}
          sub="Grid carbon footprint"
        />
        <KPICard
          title="Peak Demand (24h)"
          value={kpis.peakDemand}
          unit="MW"
          color="var(--accent-amber)"
          icon="📈"
          trend="neutral"
          trendLabel={`at ${kpis.peakTime}`}
          sub="Maximum load in 24h window"
        />
      </div>

      {/* Main Grid — 2 columns */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Demand vs Generation Chart */}
        <ChartWrapper
          title="Demand vs Generation (Last 24h)"
          subtitle="Stacked generation sources vs demand — Simulated Data"
        >
          <GridBalanceChart data={chartData} height={280} />
        </ChartWrapper>

        {/* Active Alerts */}
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Active Alerts</div>
              <div className="chart-sub">{unacknowledgedAlerts.length} unacknowledged alerts</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('insights')}>
              View All →
            </button>
          </div>
          {unacknowledgedAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
              No active alerts
            </div>
          ) : (
            unacknowledgedAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.severity}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span className="alert-title">{alert.title}</span>
                  <span className={`badge badge-${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                </div>
                <p className="alert-meta" style={{ marginTop: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {alert.message.slice(0, 110)}...
                </p>
                <div className="alert-meta">{new Date(alert.timestamp).toLocaleString('en-GB')}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Second row */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* AI Recommendations */}
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">🤖 AI Recommendations</div>
              <div className="chart-sub">Rule-based load balancing guidance</div>
            </div>
            <span className="ai-tag">Rule-Based AI</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
              }}>
                {rec}
              </div>
            ))}
            {recommendations.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>✅ No immediate actions required.</div>
            )}
          </div>
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '12px' }}
            onClick={() => onNavigate('insights')}
          >
            Open AI Insights →
          </button>
        </div>

        {/* Curtailment Trend */}
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Curtailment Trend</div>
              <div className="chart-sub">Renewable energy curtailment over time</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('curtailment')}>
              Analyse →
            </button>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-red)' }}>
                {kpis.curtailmentTotal?.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: 500 }}>MW</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Curtailed (24h)</div>
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent-amber)' }}>
                {kpis.curtailmentPct}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Of Available Renewable</div>
            </div>
          </div>
          <CurtailmentTrendLine data={curtailmentData} height={90} />
        </div>
      </div>

      {/* Asset Health Table */}
      <div className="card">
        <div className="chart-header">
          <div>
            <div className="chart-title">Asset Health Summary</div>
            <div className="chart-sub">Fleet-wide renewable asset status</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('renewable')}>
            Full Details →
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Availability</th>
              <th>Actual / Expected</th>
            </tr>
          </thead>
          <tbody>
            {assetPerformance.map(asset => (
              <tr key={asset.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{asset.type === 'solar' ? '☀️' : '💨'}</span>
                    <span style={{ fontWeight: 600 }}>{asset.name}</span>
                    {anomalies.some(a => a.assetId === asset.id) && (
                      <span className="badge badge-warning" style={{ fontSize: '9px', padding: '1px 5px' }}>ANOMALY</span>
                    )}
                  </div>
                </td>
                <td style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{asset.type}</td>
                <td style={{ color: 'var(--text-muted)' }}>{asset.zone}</td>
                <td><StatusIndicator status={asset.status} label={asset.status} /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-bar" style={{ width: '60px' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.round(asset.performanceRatio * 100)}%`,
                          background: asset.performanceRatio > 0.85 ? 'var(--accent-green)' :
                                      asset.performanceRatio > 0.7 ? 'var(--accent-amber)' :
                                      'var(--accent-red)',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{Math.round(asset.performanceRatio * 100)}%</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{asset.availability}%</td>
                <td>
                  <span style={{
                    color: asset.actual < asset.expected * 0.75 ? 'var(--accent-red)' :
                           asset.actual < asset.expected * 0.9 ? 'var(--accent-amber)' :
                           'var(--accent-green)',
                    fontWeight: 600,
                    fontSize: '12px',
                  }}>
                    {asset.actual?.toLocaleString()} / {asset.expected?.toLocaleString()} MW
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
