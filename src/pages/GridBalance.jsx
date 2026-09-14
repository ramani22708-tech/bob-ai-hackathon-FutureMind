import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import ChartWrapper from '../components/Common/ChartWrapper';
import GridBalanceChart, { GenerationMixDonut } from '../components/Charts/GridBalanceChart';

export default function GridBalance() {
  const { gridBalance, currentData, kpis } = useSimulation();

  const gb = gridBalance;
  const surplusMW = gb?.surplus || 0;
  const rm = gb?.reserveMargin || 0;

  const statusColor =
    gb?.status === 'critical' ? 'var(--accent-red)' :
    gb?.status === 'warning' ? 'var(--accent-amber)' :
    'var(--accent-green)';

  // Risk periods: find data points where reserve margin would be < 8%
  const riskPeriods = currentData.filter(p => {
    const total = p.solarGeneration + p.windGeneration + p.conventionalGeneration;
    const rm = ((total - p.demand) / p.demand) * 100;
    return rm < 8;
  });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">⚖️ Grid Balance</h1>
            <p className="page-subtitle">Generation-demand equilibrium, reserve margin, and risk analysis — Simulated Data</p>
          </div>
          <span className="sim-tag">Simulated Data</span>
        </div>
      </div>

      {/* Balance Formula */}
      <div className="card" style={{ marginBottom: '20px', background: 'rgba(33,150,243,0.05)', border: '1px solid rgba(33,150,243,0.15)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
          Grid Balance Formulas
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span>Total Generation = Conventional + Solar + Wind</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>Surplus = Generation − Demand</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>Reserve Margin = Surplus / Demand × 100%</span>
        </div>
      </div>

      {/* Real-time Balance Gauge Row */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        {/* Surplus/Deficit Gauge */}
        <div className="card" style={{ border: `1px solid ${statusColor}44` }}>
          <div className="kpi-label">Grid Balance</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: surplusMW >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', lineHeight: 1.1 }}>
            {surplusMW >= 0 ? '+' : ''}{surplusMW?.toLocaleString()}
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>MW</span>
          </div>
          <div style={{ fontSize: '12px', color: surplusMW >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px', fontWeight: 600 }}>
            {surplusMW >= 0 ? '↑ Surplus' : '↓ Deficit'}
          </div>
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Balance indicator
            </div>
            <div style={{
              height: '8px',
              background: 'var(--grid-line)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, 50 + (surplusMW / 400) * 50))}%`,
                background: surplusMW >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                borderRadius: '4px',
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>
              <span>Deficit</span><span>Balanced</span><span>Surplus</span>
            </div>
          </div>
        </div>

        {/* Reserve Margin */}
        <div className="card">
          <div className="kpi-label">Reserve Margin</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: rm < 8 ? 'var(--accent-red)' : rm < 12 ? 'var(--accent-amber)' : 'var(--accent-green)', lineHeight: 1.1 }}>
            {rm}
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '2px' }}>%</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Target: ≥ 8%</div>
          <div style={{ marginTop: '10px' }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{
                width: `${Math.min(100, rm * 4)}%`,
                background: rm < 8 ? 'var(--accent-red)' : rm < 12 ? 'var(--accent-amber)' : 'var(--accent-green)',
              }} />
            </div>
          </div>
          {rm < 8 && <span className="badge badge-critical" style={{ marginTop: '8px' }}>Below Minimum</span>}
          {rm >= 8 && rm < 12 && <span className="badge badge-warning" style={{ marginTop: '8px' }}>Approaching Min</span>}
          {rm >= 12 && <span className="badge badge-normal" style={{ marginTop: '8px' }}>Adequate</span>}
        </div>

        {/* Total Generation */}
        <div className="card">
          <div className="kpi-label">Total Generation</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {gb?.total?.toLocaleString()} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>MW</span>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[
              { label: 'Conventional', val: gb?.conventionalGeneration, color: '#9c27b0' },
              { label: 'Solar', val: gb?.solarGeneration, color: '#ffc107' },
              { label: 'Wind', val: gb?.windGeneration, color: '#2196f3' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color, fontWeight: 700 }}>{val?.toLocaleString()} MW</span>
              </div>
            ))}
          </div>
        </div>

        {/* Renewable Fraction + Carbon */}
        <div className="card">
          <div className="kpi-label">Renewable Fraction</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1.1 }}>
            {gb?.renewableFraction} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ marginTop: '6px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Carbon Intensity</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '2px' }}>
              {gb?.carbonIntensity} <span style={{ fontSize: '11px' }}>gCO₂e/kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Chart */}
      <ChartWrapper
        title="Demand vs Generation Components"
        subtitle="Stacked area chart — conventional, wind, solar vs demand (Simulated Data)"
      >
        <GridBalanceChart data={currentData} height={300} />
      </ChartWrapper>

      {/* Generation Mix Donut + Risk Periods */}
      <div className="grid-2" style={{ marginTop: '20px' }}>
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Generation Mix</div>
              <div className="chart-sub">Current period generation breakdown</div>
            </div>
          </div>
          <GenerationMixDonut
            solar={gb?.solarGeneration}
            wind={gb?.windGeneration}
            conventional={gb?.conventionalGeneration}
            height={240}
          />
        </div>

        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">⚠ Risk Period Timeline</div>
              <div className="chart-sub">Periods where reserve margin falls below 8%</div>
            </div>
            {riskPeriods.length > 0 && (
              <span className="badge badge-warning">{riskPeriods.length} periods</span>
            )}
          </div>
          {riskPeriods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
              No reserve margin risk periods detected in the selected time range
            </div>
          ) : (
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {riskPeriods.map((p, i) => {
                const total = p.solarGeneration + p.windGeneration + p.conventionalGeneration;
                const rm = Math.round(((total - p.demand) / p.demand) * 100 * 10) / 10;
                return (
                  <div key={i} className="alert-item warning" style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className="alert-title">{p.label}</span>
                      <span style={{ color: 'var(--accent-amber)', fontWeight: 700, fontSize: '12px' }}>RM: {rm}%</span>
                    </div>
                    <div className="alert-meta">Demand: {p.demand?.toLocaleString()} MW · Generation: {total?.toLocaleString()} MW</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Formula reminder */}
          <div style={{ marginTop: '16px', padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Reserve Margin = (Gen − Demand) / Demand × 100% | Target: ≥ 8%
          </div>
        </div>
      </div>
    </div>
  );
}
