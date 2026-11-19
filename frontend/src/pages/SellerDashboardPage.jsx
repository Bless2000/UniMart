import React, { useState } from 'react';
import { ArrowRight, DeliveryIcon } from '../components/Icons';
import StatusBadge from '../components/StatusBadge';
import { sellers } from '../data/catalog';
import {
  useOrderStore,
  formatMoney,
  startProcessing,
  markOutForDelivery,
  markCashCollected,
  getSellerOrders
} from '../data/orderStore';
import { formatDate } from '../utils/format';

const identity = () => localStorage.getItem('unimart_seller_identity') || sellers[0];

const TABS = [
  { id: 'active', label: 'To Fulfil' },
  { id: 'all', label: 'All Orders' },
  { id: 'disputes', label: 'Disputes' }
];

export default function SellerDashboardPage({ onNavigate, triggerToast }) {
  const { orders } = useOrderStore();
  const [seller, setSeller] = useState(identity);
  const [tab, setTab] = useState('active');

  const mine = getSellerOrders(orders, seller).sort((a, b) => b.createdAt - a.createdAt);
  const toFulfil = mine.filter((o) => ['paid', 'cod_pending', 'processing', 'out_for_delivery'].includes(o.status));
  const disputes = mine.filter((o) => o.status === 'disputed' || o.status.startsWith('resolved'));
  const revenue = mine
    .filter((o) => ['delivered', 'completed', 'resolved_seller'].includes(o.status))
    .reduce((acc, o) => acc + o.total, 0);

  const visible = tab === 'active' ? toFulfil : tab === 'disputes' ? disputes : mine;

  const handleSellerChange = (name) => {
    setSeller(name);
    localStorage.setItem('unimart_seller_identity', name);
  };

  return (
    <div className="page-wrapper dashboard-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Seller Dashboard</span>
      </div>

      <div className="page-heading-row">
        <div>
          <h1 className="page-heading">
            Seller <span className="highlight-yellow">Dashboard</span>
          </h1>
          <p className="page-subheading">
            Acknowledge paid orders, dispatch them, and mark cash collected on delivery.
          </p>
        </div>

        <label className="dashboard-identity">
          <span>Viewing as</span>
          <select className="auth-input" value={seller} onChange={(e) => handleSellerChange(e.target.value)}>
            {sellers.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="demo-note">
        Demo dashboard — seller identity is chosen locally because accounts do not have roles yet.
      </p>

      <div className="dash-stats">
        <div className="dash-stat">
          <span>Awaiting action</span>
          <strong>{toFulfil.length}</strong>
        </div>
        <div className="dash-stat">
          <span>Open disputes</span>
          <strong>{mine.filter((o) => o.status === 'disputed').length}</strong>
        </div>
        <div className="dash-stat">
          <span>Settled revenue</span>
          <strong>{formatMoney(revenue)}</strong>
        </div>
        <div className="dash-stat">
          <span>Listings sold</span>
          <strong>{mine.filter((o) => o.status !== 'cancelled').length}</strong>
        </div>
      </div>

      <div className="page-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`page-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            <span className="page-tab-count">
              {t.id === 'active' ? toFulfil.length : t.id === 'disputes' ? disputes.length : mine.length}
            </span>
          </button>
        ))}
        <button className="page-tab" onClick={() => onNavigate('transactions')}>
          Transaction History <ArrowRight />
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="favourites-empty">
          <div className="favourites-empty-icon">🗂️</div>
          <h3>{tab === 'disputes' ? 'No disputes' : 'Nothing waiting on you'}</h3>
          <p>
            {tab === 'disputes'
              ? 'Disputes raised by buyers against this seller will appear here.'
              : 'New orders from buyers will show up in this queue.'}
          </p>
        </div>
      ) : (
        <div className="dash-orders">
          {visible.map((order) => (
            <article key={order.id} className="dash-order-card">
              <div className="dash-order-head">
                <div>
                  <span className="order-id">{order.id}</span>
                  <span className="order-date">
                    {formatDate(order.createdAt)} · {order.buyer}
                  </span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="dash-order-body">
                <div className="order-thumbs">
                  {order.items.slice(0, 2).map((item) =>
                    item.img ? (
                      <img key={item.id} src={item.img} alt={item.name} className="order-thumb" />
                    ) : (
                      <span key={item.id} className="order-thumb emoji">{item.emoji}</span>
                    )
                  )}
                </div>
                <div className="order-card-info">
                  <strong>{order.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}</strong>
                  <span>
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid with Paystack'} ·{' '}
                    {order.deliveryType === 'pickup' ? 'Campus pickup' : 'Campus delivery'}
                  </span>
                  <span>{order.deliveryAddress}</span>
                </div>
                <div className="order-card-total">
                  <span>Total</span>
                  <strong>{formatMoney(order.total)}</strong>
                </div>
              </div>

              <div className="dash-order-actions">
                {(order.status === 'paid' || order.status === 'cod_pending') && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      startProcessing(order.id);
                      triggerToast(`${order.id} moved to processing.`);
                    }}
                  >
                    Acknowledge & Prepare
                  </button>
                )}

                {order.status === 'processing' && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      markOutForDelivery(order.id);
                      triggerToast(`${order.id} marked out for delivery.`);
                    }}
                  >
                    <DeliveryIcon /> Mark Out for Delivery
                  </button>
                )}

                {order.status === 'out_for_delivery' && order.paymentMethod === 'cod' && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      markCashCollected(order.id);
                      triggerToast('Cash collection recorded and order marked delivered.');
                    }}
                  >
                    Mark Delivered · Cash Collected
                  </button>
                )}

                {order.status === 'pending_payment' && (
                  <span className="dash-waiting">Waiting for the buyer's Paystack payment</span>
                )}

                {order.status === 'out_for_delivery' && order.paymentMethod !== 'cod' && (
                  <span className="dash-waiting">Waiting for the buyer to confirm receipt</span>
                )}

                {order.status === 'disputed' && (
                  <span className="dash-waiting danger">Frozen — an administrator is reviewing this dispute</span>
                )}

                <button
                  className="btn-outline"
                  onClick={() => onNavigate('order-detail', null, { orderId: order.id })}
                >
                  Open Order <ArrowRight />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
