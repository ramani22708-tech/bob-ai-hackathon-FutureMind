import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-overlay" style={{ flexDirection: 'column', gap: '12px' }}>
      <div className="spinner" />
      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{message}</span>
    </div>
  );
}
