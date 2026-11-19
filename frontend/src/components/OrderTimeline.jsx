import React from 'react';
import { statusMeta } from '../data/orderStore';

const FLOW = {
  paystack: ['pending_payment', 'paid', 'processing', 'out_for_delivery', 'delivered', 'completed'],
  cod: ['cod_pending', 'processing', 'out_for_delivery', 'delivered', 'completed']
};

export default function OrderTimeline({ order }) {
  const steps = FLOW[order.paymentMethod] || FLOW.paystack;
  const reached = new Set(order.history.map((h) => h.status));

  return (
    <ol className="order-timeline">
      {steps.map((step, index) => {
        const entry = [...order.history].reverse().find((h) => h.status === step);
        const done = reached.has(step);
        return (
          <li key={step} className={`timeline-step ${done ? 'done' : ''}`}>
            <span className="timeline-marker">{done ? '✓' : index + 1}</span>
            <div className="timeline-copy">
              <strong>{statusMeta[step]?.label || step}</strong>
              <span>
                {entry
                  ? new Date(entry.at).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Not reached yet'}
                {entry?.auto ? ' · auto-confirmed' : ''}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
