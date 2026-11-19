import React from 'react';
import { statusMeta } from '../data/orderStore';

export default function StatusBadge({ status, className = '' }) {
  const meta = statusMeta[status] || { label: status, tone: 'muted' };
  return (
    <span className={`status-badge tone-${meta.tone} ${className}`.trim()}>
      <span className="status-dot" />
      {meta.label}
    </span>
  );
}
