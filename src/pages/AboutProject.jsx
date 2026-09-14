import React from 'react';

export default function AboutProject() {
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">ℹ️ About GridWise AI</h1>
            <p className="page-subtitle">IBM BoB AI Innovation Hackathon 2026 — Problem U2</p>
          </div>
          <span className="badge badge-purple">Hackathon 2026</span>
        </div>
      </div>

      {/* Hero Card */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #0a0f1e, #0d1529)', border: '1px solid rgba(33,150,243,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>GridWise AI</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
              Smarter Energy. Stronger Grid. Greener Future.
            </div>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.75', maxWidth: '700px' }}>
          GridWise AI is an AI-powered grid management prototype designed to optimise load distribution across transmission and distribution networks while maximising renewable energy utilisation. It addresses real-world challenges in modern electricity grids: balancing variable renewable generation, minimising curtailment, detecting anomalies, and providing actionable operational guidance.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Hackathon Info */}
        <div className="card">
          <div className="chart-title" style={{ marginBottom: '14px' }}>🏆 Hackathon Details</div>
          {[
            { label: 'Event', val: 'IBM BoB AI Innovation Hackathon 2026' },
            { label: 'Problem', val: 'U2 — Grid Load Optimisation & Renewable Energy Performance Advisor' },
            { label: 'Industry', val: 'Utilities — Power, Energy, Transmission & Distribution' },
            { label: 'Category', val: 'AI-Powered Energy Management' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '80px', flexShrink: 0 }}>{item.label}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="card">
          <div className="chart-title" style={{ marginBottom: '14px' }}>🛠 Technology Stack</div>
          {[
            { icon: '⚛️', name: 'React 18', desc: 'UI framework with hooks' },
            { icon: '⚡', name: 'Vite 4', desc: 'Build tool & dev server' },
            { icon: '📊', name: 'Recharts 2', desc: 'All data visualisation' },
            { icon: '🎨', name: 'Plain CSS', desc: 'Custom design system' },
            { icon: '🧠', name: 'Rule-Based AI', desc: 'Transparent NLG & detection' },
            { icon: '📦', name: 'Zero Backend', desc: 'Fully client-side simulation' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{t.icon}</span>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="chart-title" style={{ marginBottom: '16px' }}>🏗 System Architecture</div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          padding: '20px',
          lineHeight: '1.8',
          overflow: 'auto',
        }}>
          <pre style={{ margin: 0, color: 'inherit' }}>{`
┌─────────────────────────────────────────────────────────────────────┐
│                        GridWise AI Platform                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   React UI Layer                              │   │
│  │  Overview │ Demand │ Renewable │ Grid │ AI │ Curtailment │…  │   │
│  └──────────────────────┬────────────────────────────────────────┘  │
│                          │ useSimulation()                            │
│  ┌───────────────────────▼────────────────────────────────────────┐  │
│  │              SimulationContext (Global State)                    │  │
│  │  currentData · kpis · forecastResult · anomalies · alerts      │  │
│  │  gridBalance · curtailmentData · recommendations · brief        │  │
│  └────┬──────────────┬──────────────┬────────────┬───────────────┘  │
│       │              │              │            │                    │
│  ┌────▼───┐  ┌───────▼────┐  ┌────▼────┐  ┌──▼──────────────┐    │
│  │  Data   │  │  Utils /   │  │ Charts  │  │   Components    │    │
│  │  Layer  │  │  AI Logic  │  │ Recharts│  │  KPI│Alert│Card │    │
│  │         │  │            │  │         │  │                  │    │
│  │ simData │  │calculations│  │ Demand  │  │   Layout/       │    │
│  │ assets  │  │ forecasting│  │ Balance │  │   Sidebar/      │    │
│  │ alerts  │  │ anomaly    │  │ Curtail │  │   Header        │    │
│  │         │  │ aiInsights │  │ Renew.  │  │                  │    │
│  └─────────┘  └────────────┘  └─────────┘  └──────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
`}</pre>
        </div>
      </div>

      {/* Features */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="chart-title" style={{ marginBottom: '14px' }}>✨ Key Features</div>
        <div className="grid-3">
          {[
            { icon: '📊', title: 'Real-Time Dashboard', desc: '9 KPI cards, live grid status, demand vs generation charts, and active alerts' },
            { icon: '📈', title: 'Demand Forecasting', desc: 'Transparent weighted moving average with temperature/DOW adjustments and confidence intervals' },
            { icon: '☀️', title: 'Asset Monitoring', desc: '6 renewable assets with performance ratios, availability tracking, and anomaly flags' },
            { icon: '⚖️', title: 'Grid Balance Analysis', desc: 'Real-time surplus/deficit gauge, generation mix donut, reserve margin, and risk periods' },
            { icon: '🤖', title: 'Rule-Based AI', desc: 'Transparent NLG insights, pattern-matched chatbot, root cause analysis — all data-driven' },
            { icon: '✂️', title: 'Curtailment Optimisation', desc: 'AI-generated minimisation strategies including flex load, storage, and interconnector options' },
            { icon: '📋', title: 'Operator Brief', desc: 'Printable 9-section structured report with executive summary, recommendations, and outlook' },
            { icon: '🧪', title: 'Scenario Simulation', desc: 'Demand spike, solar/wind underperformance, grid constraint triggers with real-time UI updates' },
            { icon: '🔍', title: 'Anomaly Detection', desc: 'Z-score and threshold-based statistical detection with root cause ranking' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{f.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Transparency */}
      <div className="card" style={{ marginBottom: '20px', background: 'rgba(156,39,176,0.05)', border: '1px solid rgba(156,39,176,0.2)' }}>
        <div className="chart-title" style={{ marginBottom: '12px', color: '#ce93d8' }}>🧠 AI Transparency Statement</div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
          GridWise AI uses <strong>rule-based AI</strong> — transparent, deterministic, and fully auditable algorithms — rather than generative AI models. Every insight, recommendation, anomaly flag, and forecast can be traced directly to the underlying data and explicit logic rules. This design choice reflects the reality of mission-critical energy infrastructure, where explainability, reliability, and regulatory compliance are paramount.
        </p>
        <div className="grid-3" style={{ marginTop: '14px' }}>
          {[
            { title: 'Anomaly Detection', method: 'Z-score (|z| > 2.5) + Threshold (actual < 70% expected)' },
            { title: 'Demand Forecasting', method: 'Weighted Moving Average + Hour/DOW/Temperature factors' },
            { title: 'Insights Generation', method: 'Template-based NLG with live data interpolation' },
          ].map((m, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '6px', padding: '10px 12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ce93d8', marginBottom: '4px' }}>{m.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.method}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: 'rgba(255,193,7,0.05)', border: '1px solid rgba(255,193,7,0.2)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '6px', textTransform: 'uppercase' }}>
          ⚠ Disclaimer
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
          All data presented in GridWise AI is <strong>simulated and generated programmatically</strong> for demonstration purposes only. This application does not connect to any real power grid, energy management system, or live data source. All figures, asset names, locations, and operational readings are fictional. This prototype was created for the IBM BoB AI Innovation Hackathon 2026 and is not intended for use in production energy infrastructure.
        </p>
      </div>
    </div>
  );
}
