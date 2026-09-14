import React from 'react';

export default function StatusIndicator({ status, label }) {
  const dotClass =
    status === 'operational' || status === 'normal' ? 'green' :
    status === 'warning' ? 'amber' :
    status === 'critical' || status === 'maintenance' ? 'red' :
    'muted';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
      <span className={`status-dot ${dotClass}`} />
      {label || status}
    </span>
  );
}
