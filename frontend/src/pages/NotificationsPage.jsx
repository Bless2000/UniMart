import React from 'react';
import { ArrowRight } from '../components/Icons';
import { useOrderStore, markNotificationsRead, markNotificationRead } from '../data/orderStore';
import { formatDateTime } from '../utils/format';

export default function NotificationsPage({ onNavigate }) {
  const { notifications } = useOrderStore();
  const mine = notifications.filter((n) => n.audience.includes('buyer'));
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="page-wrapper notifications-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Notifications</span>
      </div>

      <div className="page-heading-row">
        <div>
          <h1 className="page-heading">
            <span className="highlight-yellow">Notifications</span>
          </h1>
          <p className="page-subheading">
            Order status changes, dispute updates and buyer protection reminders.
          </p>
        </div>
        {unread > 0 && (
          <button className="btn-outline" onClick={markNotificationsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {mine.length === 0 ? (
        <div className="favourites-empty">
          <div className="favourites-empty-icon">🔔</div>
          <h3>You're all caught up</h3>
          <p>New order and dispute updates will show up here.</p>
          <button className="btn-primary" onClick={() => onNavigate('orders')}>View My Orders</button>
        </div>
      ) : (
        <div className="notifications-list">
          {mine.map((notification) => (
            <button
              key={notification.id}
              className={`notification-item ${notification.read ? '' : 'unread'}`}
              onClick={() => {
                markNotificationRead(notification.id);
                if (notification.orderId) {
                  onNavigate('order-detail', null, { orderId: notification.orderId });
                }
              }}
            >
              <span className="notification-dot" />
              <div className="notification-copy">
                <strong>{notification.title}</strong>
                <p>{notification.body}</p>
                <span className="notification-time">{formatDateTime(notification.at)}</span>
              </div>
              {notification.orderId && <ArrowRight />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
