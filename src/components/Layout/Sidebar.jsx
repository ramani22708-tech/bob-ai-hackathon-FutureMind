import React from 'react';
import { useSimulation } from '../../context/SimulationContext';

const NAV_ITEMS = [
  {
    section: 'Monitoring',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
      { id: 'demand', label: 'Demand Forecast', icon: TrendingUpIcon },
      { id: 'renewable', label: 'Renewable Assets', icon: SunIcon },
      { id: 'gridbalance', label: 'Grid Balance', icon: ZapIcon },
    ],
  },
  {
    section: 'AI Intelligence',
    items: [
      { id: 'insights', label: 'AI Insights', icon: BrainIcon },
      { id: 'curtailment', label: 'Curtailment', icon: ScissorsIcon },
      { id: 'brief', label: 'Operator Brief', icon: FileTextIcon },
    ],
  },
  {
    section: 'Tools',
    items: [
      { id: 'simulation', label: 'Data Simulation', icon: FlaskIcon },
      { id: 'about', label: 'About Project', icon: InfoIcon },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { alertCounts, demoMode, startDemoMode } = useSimulation();
  const totalAlerts = (alertCounts.critical || 0) + (alertCounts.warning || 0);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">

        {/* IBM BoB Badge — above GridWise AI */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* IBM wordmark */}
          <div style={{
            background: '#1F70C1',
            borderRadius: '5px',
            padding: '3px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '16px',
              fontFamily: '"Segoe UI", Arial, sans-serif',
              letterSpacing: '2px',
              lineHeight: 1,
            }}>IBM</span>
          </div>
          {/* BoB wordmark */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
          }}>
            <span style={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              fontFamily: '"Segoe UI", Arial, sans-serif',
              letterSpacing: '0.5px',
            }}>BoB</span>
            <span style={{
              color: 'var(--text-muted)',
              fontWeight: 400,
              fontSize: '9px',
              letterSpacing: '0.3px',
            }}>AI Innovation</span>
          </div>
        </div>

        {/* GridWise AI logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <span className="sidebar-logo-title">GridWise AI</span>
        </div>
        <div className="sidebar-logo-sub">Grid Optimisation Platform</div>
        <div className="sim-tag" style={{ marginTop: '6px' }}>Simulated Data</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(section => (
          <div key={section.section}>
            <div className="sidebar-section-label">{section.section}</div>
            {section.items.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item${activePage === item.id ? ' active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon size={15} className="nav-icon" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.id === 'overview' && totalAlerts > 0 && (
                    <span style={{
                      background: '#f44336',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '10px',
                      minWidth: '18px',
                      textAlign: 'center',
                    }}>
                      {totalAlerts}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!demoMode && (
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '10px', fontSize: '12px' }}
            onClick={startDemoMode}
          >
            ▶ Start Demo Mode
          </button>
        )}
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          IBM BoB AI Innovation Hackathon 2026<br />
          Problem: U2 — Grid Load Optimisation<br />
          Industry: Utilities — Energy
        </div>
      </div>
    </aside>
  );
}

// ─── Inline SVG Icons ─────────────────────────────────────────────────────

function LayoutDashboardIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function TrendingUpIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}
function SunIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function ZapIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function BrainIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  );
}
function ScissorsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
      <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
      <line x1="8.12" y1="8.12" x2="12" y2="12"/>
    </svg>
  );
}
function FileTextIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function FlaskIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M10 3v7.5l-4 7a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-7V3"/>
    </svg>
  );
}
function InfoIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}
