import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import ChartWrapper from '../components/Common/ChartWrapper';
import CurtailmentChart from '../components/Charts/CurtailmentChart';

export default function CurtailmentOptimisation() {
  const { curtailmentData, curtailmentPlan, kpis, totalCurtailment } = useSimulation();

  const plan = curtailmentPlan;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">✂️ Curtailment Optimisation</h1>
            <p className="page-subtitle">Analyse renewable curtailment and implement AI-generated minimisation strategies</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="sim-tag">Simulated Data</span>
            <span className="ai-tag">Rule-Based AI</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="card" style={{ marginBottom: '20px', background: 'rgba(244,67,54,0.04)', border: '1px solid rgba(244,67,54,0.15)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Curtailment Formulas</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span>Curtailment = max(0, Available Renewable − Utilised Renewable)</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>Curtailment % = Curtailment / Available × 100</span>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        <div className="card card-hover">
          <div className="kpi-label">Total Curtailed</div>
          <div className="kpi-value" style={{ fontSize: '24px', color: 'var(--accent-red)' }}>
            {totalCurtailment?.toLocaleString()} <span style={{ fontSize: '12px' }}>MW</span>
          </div>
          <div className="card-sub">Sum over selected period</div>
        </div>
        <div className="card card-hover">
          <div className="kpi-label">Curtailment %</div>
          <div className="kpi-value" style={{ fontSize: '24px', color: 'var(--accent-amber)' }}>
            {kpis.curtailmentPct}%
          </div>
          <div className="card-sub">Of available renewable</div>
        </div>
        <div className="card card-hover">
          <div className="kpi-label">Recoverable</div>
          <div className="kpi-value" style={{ fontSize: '24px', color: 'var(--accent-green)' }}>
            {plan?.recoverable?.toLocaleString()} <span style={{ fontSize: '12px' }}>MW</span>
          </div>
          <div className="card-sub">Via flex load + storage</div>
        </div>
        <div className="card card-hover">
          <div className="kpi-label">Unavoidable</div>
          <div className="kpi-value" style={{ fontSize: '24px', color: 'var(--text-secondary)' }}>
            {plan?.unavoidable?.toLocaleString()} <span style={{ fontSize: '12px' }}>MW</span>
          </div>
          <div className="card-sub">Technical minimum constraint</div>
        </div>
      </div>

      {/* Curtailment Chart */}
      <ChartWrapper
        title="Curtailment Timeline"
        subtitle="Utilised renewable (green) vs Curtailed (red) over time — Simulated Data"
      >
        <CurtailmentChart data={curtailmentData} height={280} />
      </ChartWrapper>

      {/* AI Plan + Period Analysis */}
      <div className="grid-2" style={{ marginTop: '20px' }}>
        {/* AI Minimisation Plan */}
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">🤖 AI Curtailment Minimisation Plan</div>
              <div className="chart-sub">Rule-based prioritised strategies</div>
            </div>
            <span className="ai-tag">Rule-Based AI</span>
          </div>

          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '12px', marginBottom: '14px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
            {plan?.summary}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {plan?.strategies?.map((s, i) => (
              <div key={s.id} style={{
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 14px',
                background: 'var(--bg-secondary)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'var(--accent-blue)', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>
                      {s.priority}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.strategy}</span>
                  </div>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '12px' }}>
                    +{s.potential} MW
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 6px 28px' }}>
                  {s.description}
                </p>
                <div style={{ marginLeft: '28px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  ⏱ Implementation time: {s.implementationTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Period Analysis */}
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">📊 Period Analysis</div>
              <div className="chart-sub">Curtailment breakdown by time period</div>
            </div>
          </div>

          {/* High-curtailment periods */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Highest Curtailment Periods
            </div>
            {plan?.highPeriods?.length > 0 ? (
              plan.highPeriods.map((period, i) => (
                <div key={i} className="alert-item critical" style={{ marginBottom: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="alert-title">{period}</span>
                    <span className="badge badge-critical">High</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No high-curtailment periods detected</div>
            )}
          </div>

          <div className="divider" />

          {/* Asset breakdown */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Source Breakdown (approx.)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Solar curtailment', pct: 62, color: '#ffc107' },
                { label: 'Wind curtailment', pct: 38, color: '#2196f3' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Recovery potential */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Recovery Potential
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Flexible Load Shifting', pct: 55, mw: plan?.strategies?.[0]?.potential, color: 'var(--accent-green)' },
                { label: 'Storage Dispatch', pct: 25, mw: plan?.strategies?.[1]?.potential, color: 'var(--accent-blue)' },
                { label: 'Interconnector Export', pct: 15, mw: plan?.strategies?.[2]?.potential, color: 'var(--accent-amber)' },
                { label: 'Unavoidable', pct: 5, mw: plan?.unavoidable, color: 'var(--text-muted)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '130px', fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>{item.label}</div>
                  <div style={{ flex: 1 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: item.color, fontWeight: 700, width: '50px', textAlign: 'right' }}>
                    {item.mw} MW
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="chart-header">
          <div className="chart-title">Curtailment Data Table</div>
          <span className="sim-tag">Simulated Data</span>
        </div>
        <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Available (MW)</th>
                <th>Utilised (MW)</th>
                <th>Curtailed (MW)</th>
                <th>Curtailment %</th>
                <th>Solar (MW)</th>
                <th>Wind (MW)</th>
              </tr>
            </thead>
            <tbody>
              {curtailmentData.filter(p => p.curtailed > 0).slice(0, 20).map((p, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{p.label}</td>
                  <td>{p.available?.toLocaleString()}</td>
                  <td style={{ color: 'var(--accent-green)' }}>{p.utilised?.toLocaleString()}</td>
                  <td style={{ color: 'var(--accent-red)', fontWeight: 600 }}>{p.curtailed?.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${p.curtailmentPct > 20 ? 'badge-critical' : 'badge-warning'}`}>
                      {p.curtailmentPct}%
                    </span>
                  </td>
                  <td style={{ color: '#ffc107' }}>{p.solar?.toLocaleString()}</td>
                  <td style={{ color: '#2196f3' }}>{p.wind?.toLocaleString()}</td>
                </tr>
              ))}
              {curtailmentData.filter(p => p.curtailed > 0).length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No curtailment in selected time range</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
