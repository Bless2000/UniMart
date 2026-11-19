import React, { useState } from 'react';
import { ArrowRight, DeliveryIcon } from '../components/Icons';
import StatusBadge from '../components/StatusBadge';
import { formatMoney, useOrderStore, getBuyerOrders } from '../data/orderStore';
import { formatDate } from '../utils/format';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'disputed', label: 'Disputed' },
  { id: 'cancelled', label: 'Cancelled' }
];

const ACTIVE = ['pending_payment', 'paid', 'cod_pending', 'processing', 'out_for_delivery'];

export default function OrdersPage({ buyerName, onNavigate }) {
  const { orders } = useOrderStore();
  const [tab, setTab] = useState('all');
  const myOrders = getBuyerOrders(orders, buyerName).sort((a, b) => b.createdAt - a.createdAt);

  const filtered = myOrders.filter((o) => {
    if (tab === 'all') return true;
    if (tab === 'active') return ACTIVE.includes(o.status);
    if (tab === 'delivered') return o.status === 'delivered' || o.status === 'completed';
    if (tab === 'disputed') return o.status === 'disputed' || o.status.startsWith('resolved');
    return o.status === 'cancelled';
  });

  const awaitingAction = myOrders.filter(
    (o) => o.status === 'pending_payment' || o.status === 'out_for_delivery'
  ).length;

  return (
    <div className="page-wrapper orders-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">My Orders</span>
      </div>

      <div className="page-heading-row">
        <div>
          <h1 className="page-heading">
            My <span className="highlight-yellow">Orders</span>
          </h1>
          <p className="page-subheading">
            Track every purchase and booking, confirm delivery and open a dispute within 10 days.
          </p>
        </div>
        <button className="btn-primary" onClick={() => onNavigate('shop')}>
          Continue Shopping <ArrowRight />
        </button>
      </div>

      {awaitingAction > 0 && (
        <div className="orders-alert">
          <DeliveryIcon />
          <span>
            {awaitingAction} {awaitingAction === 1 ? 'order needs' : 'orders need'} your attention —
            complete payment or confirm receipt.
          </span>
        </div>
      )}

      <div className="page-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`page-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className="page-tab-count">
              {t.id === 'all'
                ? myOrders.length
                : myOrders.filter((o) => {
                    if (t.id === 'active') return ACTIVE.includes(o.status);
                    if (t.id === 'delivered') return o.status === 'delivered' || o.status === 'completed';
                    if (t.id === 'disputed') return o.status === 'disputed' || o.status.startsWith('resolved');
                    return o.status === 'cancelled';
                  }).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="favourites-empty">
          <div className="favourites-empty-icon">📦</div>
          <h3>No orders here yet</h3>
          <p>When you buy a product or book a campus service it will appear in this list.</p>
          <button className="btn-primary" onClick={() => onNavigate('shop')}>Browse Listings</button>
        </div>
      ) : (
        <div className="orders-list">
          {filtered.map((order) => {
            const itemCount = order.items.reduce((acc, item) => acc + item.qty, 0);
            return (
              <article key={order.id} className="order-card">
                <div className="order-card-head">
                  <div>
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">Placed {formatDate(order.createdAt)}</span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="order-card-body">
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
                    <strong>
                      {order.items[0].name}
                      {itemCount > 1 ? ` +${itemCount - 1} more` : ''}
                    </strong>
                    <span>Seller: {order.seller}</span>
                    <span>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paystack'} · {order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
                    </span>
                  </div>

                  <div className="order-card-total">
                    <span>Total</span>
                    <strong>{formatMoney(order.total)}</strong>
                  </div>

                  <button
                    className="btn-outline order-open-btn"
                    onClick={() => onNavigate('order-detail', null, { orderId: order.id })}
                  >
                    View Order <ArrowRight />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
