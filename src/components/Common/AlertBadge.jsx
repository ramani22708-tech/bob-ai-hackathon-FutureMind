import React from 'react';
import { getSeverityColor } from '../../data/alerts';

export default function AlertBadge({ severity, label }) {
  return (
    <span className={`badge badge-${severity}`}>
      {label || severity?.toUpperCase()}
    </span>
  );
}
