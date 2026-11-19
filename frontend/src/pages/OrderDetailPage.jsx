import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChatIcon, ShieldIcon, DeliveryIcon } from '../components/Icons';
import StatusBadge from '../components/StatusBadge';
import OrderTimeline from '../components/OrderTimeline';
import {
  useOrderStore,
  formatMoney,
  paymentMeta,
  disputeReasons,
  canCancel,
  canDispute,
  disputeDaysLeft,
  markPaid,
  confirmReceipt,
  cancelOrder,
  raiseDispute,
  startConversation
} from '../data/orderStore';
import { formatDateTime } from '../utils/format';

export default function OrderDetailPage({ orderId, buyerName, onNavigate, triggerToast }) {
  const { orders } = useOrderStore();
  const order = orders.find((o) => o.id === orderId);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [reason, setReason] = useState('faulty');
  const [note, setNote] = useState('');

  if (!order) {
    return (
      <div className="page-wrapper order-detail-page">
        <div className="detail-missing">
          <h2>Order not found</h2>
          <p>That order may belong to another account.</p>
          <button className="btn-primary" onClick={() => onNavigate('orders')}>Back to My Orders</button>
        </div>
      </div>
    );
  }

  const daysLeft = disputeDaysLeft(order);
  const isBuyer = order.buyer === buyerName;

  const handleChatSeller = () => {
    const listingId = order.items[0].id;
    const conversationId = startConversation(listingId, buyerName);
    onNavigate('chat', null, { conversationId });
  };

  const handleDispute = (e) => {
    e.preventDefault();
    if (note.trim().length < 10) {
      triggerToast('Describe the problem in at least 10 characters.');
      return;
    }
    raiseDispute(order.id, { reason, note: note.trim() });
    setShowDisputeForm(false);
    setNote('');
    triggerToast('Dispute raised. An administrator will review it.');
  };

  return (
    <div className="page-wrapper order-detail-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('orders')}>My Orders</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">{order.id}</span>
      </div>

      <button className="detail-back-btn" onClick={() => onNavigate('orders')}>
        <ChevronLeft /> All orders
      </button>

      <div className="order-detail-head">
        <div>
          <h1 className="page-heading">Order {order.id}</h1>
          <p className="page-subheading">
            Placed {formatDateTime(order.createdAt)} · Seller {order.seller}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.status === 'delivered' && daysLeft > 0 && (
        <div className="order-note info">
          <ShieldIcon />
          <span>
            Buyer protection is active. You have <strong>{daysLeft} days</strong> left to raise a dispute.
          </span>
        </div>
      )}

      {order.status === 'out_for_delivery' && (
        <div className="order-note warning">
          <DeliveryIcon />
          <span>
            The seller has dispatched this order. Confirm receipt once you have it — otherwise it
            auto-confirms 3 days after dispatch.
          </span>
        </div>
      )}

      <div className="order-detail-layout">
        <div className="order-detail-main">
          <section className="checkout-card">
            <h2 className="checkout-card-title">Progress</h2>
            <OrderTimeline order={order} />
          </section>

          <section className="checkout-card">
            <h2 className="checkout-card-title">Items</h2>
            {order.items.map((item) => (
              <div key={item.id} className="checkout-line">
                {item.img ? (
                  <img src={item.img} alt={item.name} className="checkout-thumb" />
                ) : (
                  <span className="checkout-thumb emoji">{item.emoji}</span>
                )}
                <div className="checkout-line-info">
                  <strong>{item.name}</strong>
                  <span>
                    {formatMoney(item.price)} × {item.qty}
                    {item.unit ? ` · ${item.unit}` : ''}
                  </span>
                </div>
                <span className="checkout-line-price">{formatMoney(item.price * item.qty)}</span>
              </div>
            ))}
          </section>

          <section className="checkout-card">
            <h2 className="checkout-card-title">Delivery</h2>
            <div className="detail-list">
              <div className="detail-list-row">
                <span>Method</span>
                <strong>{order.deliveryType === 'pickup' ? 'Campus pickup' : 'Campus delivery'}</strong>
              </div>
              <div className="detail-list-row">
                <span>Destination</span>
                <strong>{order.deliveryAddress}</strong>
              </div>
              <div className="detail-list-row">
                <span>Buyer</span>
                <strong>{order.buyer}</strong>
              </div>
            </div>
          </section>

          {(order.dispute || order.status.startsWith('resolved')) && (
            <section className="checkout-card dispute-card">
              <h2 className="checkout-card-title">Dispute</h2>
              <div className="detail-list">
                <div className="detail-list-row">
                  <span>Reason</span>
                  <strong>
                    {disputeReasons.find((r) => r.id === order.dispute?.reason)?.label || '—'}
                  </strong>
                </div>
                <div className="detail-list-row">
                  <span>Raised</span>
                  <strong>{formatDateTime(order.dispute?.raisedAt)}</strong>
                </div>
              </div>
              <p className="dispute-note">“{order.dispute?.note}”</p>

              {order.status === 'disputed' && (
                <p className="dispute-status">An administrator is reviewing this dispute. The transaction is frozen.</p>
              )}
              {order.status === 'resolved_buyer' && (
                <p className="dispute-status success">
                  Resolved in your favour — {formatMoney(order.total)} refunded.
                </p>
              )}
              {order.status === 'resolved_seller' && (
                <p className="dispute-status">Resolved in the seller's favour. No refund was issued.</p>
              )}
            </section>
          )}
        </div>

        <aside className="order-detail-side">
          <section className="checkout-card">
            <h2 className="checkout-card-title">Payment</h2>
            <div className="detail-list">
              <div className="detail-list-row">
                <span>Method</span>
                <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paystack'}</strong>
              </div>
              <div className="detail-list-row">
                <span>Status</span>
                <strong>{paymentMeta[order.paymentStatus] || order.paymentStatus}</strong>
              </div>
              <div className="detail-list-row">
                <span>Subtotal</span>
                <strong>{formatMoney(order.subtotal)}</strong>
              </div>
              <div className="detail-list-row">
                <span>Delivery</span>
                <strong>{order.deliveryFee === 0 ? 'Free' : formatMoney(order.deliveryFee)}</strong>
              </div>
              <div className="detail-list-row total">
                <span>Total</span>
                <strong>{formatMoney(order.total)}</strong>
              </div>
            </div>
          </section>

          <section className="checkout-card order-actions-card">
            <h2 className="checkout-card-title">Actions</h2>

            {order.status === 'pending_payment' && isBuyer && (
              <button
                className="btn-primary order-action-btn"
                onClick={() => {
                  markPaid(order.id);
                  triggerToast('Payment confirmed. The seller has been notified.');
                }}
              >
                Pay with Paystack <ArrowRight />
              </button>
            )}

            {order.status === 'out_for_delivery' && isBuyer && (
              <button
                className="btn-primary order-action-btn"
                onClick={() => {
                  confirmReceipt(order.id);
                  triggerToast('Receipt confirmed. Your 10-day protection window is open.');
                }}
              >
                Confirm Receipt <ArrowRight />
              </button>
            )}

            {canDispute(order) && !showDisputeForm && (
              <button className="btn-outline order-action-btn" onClick={() => setShowDisputeForm(true)}>
                <ShieldIcon /> Raise a Dispute
              </button>
            )}

            {showDisputeForm && (
              <form className="dispute-form" onSubmit={handleDispute}>
                <label className="checkout-field">
                  <span className="checkout-label">What went wrong?</span>
                  <select className="auth-input" value={reason} onChange={(e) => setReason(e.target.value)}>
                    {disputeReasons.map((r) => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </label>
                <label className="checkout-field">
                  <span className="checkout-label">Explain the issue</span>
                  <textarea
                    className="auth-input checkout-textarea"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Describe what happened and what resolution you expect."
                  />
                </label>
                <div className="dispute-form-actions">
                  <button type="submit" className="btn-primary">Submit Dispute</button>
                  <button type="button" className="btn-outline" onClick={() => setShowDisputeForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {canCancel(order) && (
              <button
                className="btn-outline order-action-btn danger"
                onClick={() => {
                  cancelOrder(order.id);
                  triggerToast(`${order.id} cancelled.`);
                }}
              >
                Cancel Order
              </button>
            )}

            <button className="btn-ghost order-action-btn" onClick={handleChatSeller}>
              <ChatIcon /> Chat with {order.seller}
            </button>

            <button className="btn-ghost order-action-btn" onClick={() => onNavigate('transactions')}>
              View Transaction History
            </button>
          </section>

          <section className="checkout-card">
            <h2 className="checkout-card-title">Status history</h2>
            <ul className="status-history">
              {[...order.history].reverse().map((entry, index) => (
                <li key={`${entry.status}-${index}`}>
                  <span className="history-dot" />
                  <div>
                    <strong>{entry.status.replace(/_/g, ' ')}</strong>
                    <span>{formatDateTime(entry.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
