import React, { useState } from 'react';
import { ArrowRight, ShieldIcon } from '../components/Icons';
import StatusBadge from '../components/StatusBadge';
import {
  useOrderStore,
  formatMoney,
  paymentMeta,
  disputeReasons,
  resolveDispute
} from '../data/orderStore';
import { formatDate, formatDateTime } from '../utils/format';

export default function AdminDashboardPage({ onNavigate, triggerToast }) {
  const { orders } = useOrderStore();
  const [tab, setTab] = useState('disputes');
  const [statusFilter, setStatusFilter] = useState('all');

  const disputes = orders.filter((o) => o.status === 'disputed' || o.status.startsWith('resolved'));
  const openDisputes = disputes.filter((o) => o.status === 'disputed');
  const volume = orders
    .filter((o) => !['cancelled'].includes(o.status))
    .reduce((acc, o) => acc + o.total, 0);

  const transactionRows = orders
    .filter((o) => statusFilter === 'all' || o.status === statusFilter)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="page-wrapper dashboard-page admin-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Admin</span>
      </div>

      <div className="page-heading-row">
        <div>
          <h1 className="page-heading">
            Admin <span className="highlight-yellow">Panel</span>
          </h1>
          <p className="page-subheading">
            Review disputed transactions manually and close them in the buyer's or seller's favour.
          </p>
        </div>
        <ShieldIcon />
      </div>

      <p className="demo-note">
        Demo dashboard — all platform transactions are shown from local data until admin roles exist.
      </p>

      <div className="dash-stats">
        <div className="dash-stat">
          <span>Open disputes</span>
          <strong>{openDisputes.length}</strong>
        </div>
        <div className="dash-stat">
          <span>Resolved disputes</span>
          <strong>{disputes.length - openDisputes.length}</strong>
        </div>
        <div className="dash-stat">
          <span>Transactions</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="dash-stat">
          <span>Platform volume</span>
          <strong>{formatMoney(volume)}</strong>
        </div>
      </div>

      <div className="page-tabs">
        <button className={`page-tab ${tab === 'disputes' ? 'active' : ''}`} onClick={() => setTab('disputes')}>
          Disputes <span className="page-tab-count">{openDisputes.length}</span>
        </button>
        <button className={`page-tab ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>
          All Transactions <span className="page-tab-count">{orders.length}</span>
        </button>
      </div>

      {tab === 'disputes' ? (
        disputes.length === 0 ? (
          <div className="favourites-empty">
            <div className="favourites-empty-icon">⚖️</div>
            <h3>No disputes to review</h3>
            <p>Buyer disputes appear here as soon as they are raised.</p>
          </div>
        ) : (
          <div className="dispute-queue">
            {disputes.map((order) => (
              <article key={order.id} className={`admin-dispute-card ${order.status}`}>
                <div className="dash-order-head">
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">
                      Raised {formatDateTime(order.dispute?.raisedAt)} · {formatMoney(order.total)}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="admin-dispute-grid">
                  <div>
                    <span className="admin-label">Buyer</span>
                    <strong>{order.buyer}</strong>
                  </div>
                  <div>
                    <span className="admin-label">Seller</span>
                    <strong>{order.seller}</strong>
                  </div>
                  <div>
                    <span className="admin-label">Reason</span>
                    <strong>{disputeReasons.find((r) => r.id === order.dispute?.reason)?.label}</strong>
                  </div>
                  <div>
                    <span className="admin-label">Payment</span>
                    <strong>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paystack'} ·{' '}
                      {paymentMeta[order.paymentStatus]}
                    </strong>
                  </div>
                </div>

                <blockquote className="admin-dispute-note">“{order.dispute?.note}”</blockquote>

                <div className="admin-dispute-items">
                  {order.items.map((item) => (
                    <span key={item.id} className="filter-chip">
                      {item.name} ×{item.qty} · {formatMoney(item.price * item.qty)}
                    </span>
                  ))}
                </div>

                <div className="dash-order-actions">
                  {order.status === 'disputed' ? (
                    <>
                      <button
                        className="btn-primary"
                        onClick={() => {
                          resolveDispute(order.id, 'buyer');
                          triggerToast(`${order.id} resolved in the buyer's favour — refund issued.`);
                        }}
                      >
                        Resolve for Buyer · Refund {formatMoney(order.total)}
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => {
                          resolveDispute(order.id, 'seller');
                          triggerToast(`${order.id} resolved in the seller's favour.`);
                        }}
                      >
                        Resolve for Seller · Archive
                      </button>
                    </>
                  ) : (
                    <span className="dash-waiting">
                      Closed {formatDate(order.dispute?.resolvedAt)} ·{' '}
                      {order.status === 'resolved_buyer'
                        ? `Refund of ${formatMoney(order.total)} issued`
                        : 'No refund issued'}
                    </span>
                  )}

                  <button
                    className="btn-ghost"
                    onClick={() => onNavigate('order-detail', null, { orderId: order.id })}
                  >
                    Open Transaction <ArrowRight />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )
      ) : (
        <>
          <label className="checkout-field transaction-seller-select">
            <span className="checkout-label">Filter by status</span>
            <select
              className="auth-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              {['pending_payment', 'paid', 'cod_pending', 'processing', 'out_for_delivery', 'delivered', 'completed', 'disputed', 'resolved_buyer', 'resolved_seller', 'cancelled'].map((status) => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </label>

          <div className="txn-table-wrap">
            <table className="txn-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Buyer</th>
                  <th>Seller</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactionRows.map((order) => (
                  <tr key={order.id} onClick={() => onNavigate('order-detail', null, { orderId: order.id })}>
                    <td className="txn-id">{order.id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.buyer}</td>
                    <td>{order.seller}</td>
                    <td>{order.paymentMethod === 'cod' ? 'Cash' : 'Paystack'} · {paymentMeta[order.paymentStatus]}</td>
                    <td className="txn-amount">{formatMoney(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
