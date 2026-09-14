import React from 'react';

export default function ChartWrapper({ title, subtitle, children, actions, simTag = true }) {
  return (
    <div className="card" style={{ overflow: 'visible' }}>
      <div className="chart-header">
        <div>
          <div className="chart-title">{title}</div>
          {subtitle && <div className="chart-sub">{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {simTag && <span className="sim-tag">Simulated Data</span>}
          {actions}
        </div>
      </div>
      <div className="chart-wrapper">
        {children}
      </div>
    </div>
  );
}
