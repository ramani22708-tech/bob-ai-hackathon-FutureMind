import React, { useState, useRef } from 'react';
import { useSimulation } from '../context/SimulationContext';

export default function OperatorBrief() {
  const { operatorBrief, kpis, gridBalance, anomalies, allAlerts } = useSimulation();
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const briefRef = useRef(null);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(true);
      setGenerating(false);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!operatorBrief) return;
    const text = operatorBrief.sections
      .map(s => `[Section ${s.id}] ${s.title}\n${s.content}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(`GridWise AI — Operator Brief\nGenerated: ${operatorBrief.generatedAt}\n\n${text}`)
      .then(() => alert('Brief copied to clipboard!'));
  };

  const criticalCount = allAlerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const warningCount = allAlerts.filter(a => a.severity === 'warning' && !a.acknowledged).length;

  const statusColor =
    gridBalance?.status === 'critical' ? '#f44336' :
    gridBalance?.status === 'warning' ? '#ffc107' :
    '#00e676';

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">📋 Operator Brief</h1>
            <p className="page-subtitle">AI-generated structured operational report — Sections A through I</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="sim-tag">Simulated Data</span>
            <span className="ai-tag">Rule-Based AI</span>
          </div>
        </div>
      </div>

      {/* Generate controls */}
      <div className="card no-print" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '⏳ Generating...' : '📋 Generate Operator Brief'}
          </button>
          {generated && (
            <>
              <button className="btn btn-secondary" onClick={handlePrint}>
                🖨 Print / PDF
              </button>
              <button className="btn btn-ghost" onClick={handleCopy}>
                📋 Copy to Clipboard
              </button>
            </>
          )}
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
            {generated && `Generated: ${operatorBrief?.generatedAt}`}
          </div>
        </div>
      </div>

      {!generated && !generating && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Ready to Generate
          </div>
          <div style={{ fontSize: '13px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.65' }}>
            Click "Generate Operator Brief" to create a structured 9-section operational report based on the current simulation state.
          </div>
        </div>
      )}

      {generating && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px', width: '40px', height: '40px', borderWidth: '3px' }} />
          <div style={{ color: 'var(--text-muted)' }}>Analysing grid state and generating brief...</div>
        </div>
      )}

      {/* Generated Brief */}
      {generated && operatorBrief && (
        <div ref={briefRef}>
          {/* Brief Header */}
          <div className="card" style={{ marginBottom: '20px', border: '1px solid rgba(33,150,243,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                  ⚡ GridWise AI — Operational Status Report
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Generated: {operatorBrief.generatedAt} · Simulated Data · Rule-Based AI Analysis
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: `${statusColor}18`,
                  border: `1px solid ${statusColor}44`,
                  color: statusColor,
                  fontWeight: 800,
                  fontSize: '14px',
                }}>
                  Grid: {gridBalance?.status?.toUpperCase() || 'NORMAL'}
                </div>
                {criticalCount > 0 && (
                  <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(244,67,54,0.12)', border: '1px solid rgba(244,67,54,0.3)', color: '#f44336', fontWeight: 700, fontSize: '13px' }}>
                    🔴 {criticalCount} Critical Alert{criticalCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Summary stats row */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
              {[
                { label: 'Demand', val: `${kpis.currentDemand?.toLocaleString()} MW` },
                { label: 'Generation', val: `${kpis.totalGeneration?.toLocaleString()} MW` },
                { label: 'Renewable', val: `${kpis.renewablePct}%` },
                { label: 'Reserve Margin', val: `${kpis.reserveMargin}%` },
                { label: 'Carbon', val: `${kpis.carbonIntensity} gCO₂e/kWh` },
                { label: 'Anomalies', val: anomalies.length },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sections A–I */}
          <div className="card" style={{ padding: '28px 32px' }}>
            {operatorBrief.sections.map(section => (
              <div key={section.id} className="brief-section">
                <div className="brief-section-title">
                  Section {section.id}: {section.title}
                </div>
                <div className="brief-text" style={{ whiteSpace: 'pre-line' }}>
                  {section.content}
                </div>
              </div>
            ))}

            {/* Footer */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              GridWise AI — IBM BoB AI Innovation Hackathon 2026 · Problem U2: Grid Load Optimisation &amp; Renewable Energy Performance Advisor · <strong>All data is simulated for demonstration purposes.</strong> · Rule-Based AI Analysis
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
