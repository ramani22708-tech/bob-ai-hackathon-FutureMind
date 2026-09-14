import React from 'react';

/**
 * KPICard — displays a single KPI metric with icon, value, label, trend.
 */
export default function KPICard({ title, value, unit, trend, trendLabel, icon, color, sub, badge }) {
  const cardStyle = {
    '--kpi-color': color || 'var(--accent-blue)',
  };

  const trendClass =
    trend === 'up' ? 'trend-up' :
    trend === 'down' ? 'trend-down' :
    'trend-neutral';

  const trendArrow =
    trend === 'up' ? '↑' :
    trend === 'down' ? '↓' :
    '→';

  return (
    <div className="kpi-card card-hover" style={cardStyle}>
      <div className="kpi-header">
        {icon && (
          <div className="kpi-icon" style={{ background: `${color || 'var(--accent-blue)'}18` }}>
            <span style={{ color: color || 'var(--accent-blue)', fontSize: '18px' }}>{icon}</span>
          </div>
        )}
        {badge && <span className={`badge badge-${badge.type}`}>{badge.label}</span>}
      </div>

      <div className="kpi-value" style={{ color: color || 'var(--text-primary)' }}>
        {value !== undefined && value !== null ? value.toLocaleString() : '--'}
        {unit && <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '3px' }}>{unit}</span>}
      </div>

      <div className="kpi-label">{title}</div>

      {trendLabel && (
        <div className={`kpi-trend ${trendClass}`}>
          <span>{trendArrow}</span>
          <span>{trendLabel}</span>
        </div>
      )}

      {sub && <div className="card-sub">{sub}</div>}
    </div>
  );
}
