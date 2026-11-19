import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { sellers } from '../data/catalog';
import { useOrderStore, formatMoney, paymentMeta } from '../data/orderStore';
import { formatDate } from '../utils/format';

const sellerIdentity = () => localStorage.getItem('unimart_seller_identity') || sellers[0];

export default function TransactionsPage({ buyerName, onNavigate }) {
  const { orders } = useOrderStore();
  const [view, setView] = useState('buyer');
  const [seller, setSeller] = useState(sellerIdentity);

  const rows = (
    view === 'buyer' ? orders.filter((o) => o.buyer === buyerName) : orders.filter((o) => o.seller === seller)
  ).sort((a, b) => b.createdAt - a.createdAt);

  const total = rows.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="page-wrapper transactions-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Transaction History</span>
      </div>

      <div className="page-heading-row">
        <div>
          <h1 className="page-heading">
            Transaction <span className="highlight-yellow">History</span>
          </h1>
          <p className="page-subheading">
            Every order is kept permanently with its payment and dispute outcome.
          </p>
        </div>
      </div>

      <div className="page-tabs">
        <button className={`page-tab ${view === 'buyer' ? 'active' : ''}`} onClick={() => setView('buyer')}>
          As Buyer
          <span className="page-tab-count">{orders.filter((o) => o.buyer === buyerName).length}</span>
        </button>
        <button className={`page-tab ${view === 'seller' ? 'active' : ''}`} onClick={() => setView('seller')}>
          As Seller
          <span className="page-tab-count">{orders.filter((o) => o.seller === seller).length}</span>
        </button>
      </div>

      {view === 'seller' && (
        <label className="checkout-field transaction-seller-select">
          <span className="checkout-label">Seller identity</span>
          <select
            className="auth-input"
            value={seller}
            onChange={(e) => {
              setSeller(e.target.value);
              localStorage.setItem('unimart_seller_identity', e.target.value);
            }}
          >
            {sellers.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
      )}

      <div className="txn-summary">
        <div>
          <span>Transactions</span>
          <strong>{rows.length}</strong>
        </div>
        <div>
          <span>Lifetime value</span>
          <strong>{formatMoney(total)}</strong>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="favourites-empty">
          <div className="favourites-empty-icon">🧾</div>
          <h3>No transactions yet</h3>
          <p>Completed and active orders appear here with their full history.</p>
          <button className="btn-primary" onClick={() => onNavigate('shop')}>Browse Listings</button>
        </div>
      ) : (
        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Item</th>
                <th>{view === 'buyer' ? 'Seller' : 'Buyer'}</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} onClick={() => onNavigate('order-detail', null, { orderId: order.id })}>
                  <td className="txn-id">{order.id}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1}` : ''}</td>
                  <td>{view === 'buyer' ? order.seller : order.buyer}</td>
                  <td>{order.paymentMethod === 'cod' ? 'Cash' : 'Paystack'} · {paymentMeta[order.paymentStatus]}</td>
                  <td className="txn-amount">{formatMoney(order.total)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
