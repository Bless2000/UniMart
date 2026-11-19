import React, { useState } from 'react';
import {
  HeartIcon,
  CartBtnIcon,
  ChatIcon,
  StarIcon,
  ArrowRight,
  DeliveryIcon,
  ShieldIcon,
  ChevronLeft
} from '../components/Icons';
import { findCatalogItem } from '../data/catalog';
import { startConversation } from '../data/orderStore';

export default function ProductPage({ productId, buyerName, onNavigate, onAddToCart, wishlist, onToggleWishlist }) {
  const item = findCatalogItem(Number(productId));
  const [qty, setQty] = useState(1);

  if (!item) {
    return (
      <div className="page-wrapper product-detail-page">
        <div className="detail-missing">
          <h2>Listing not found</h2>
          <p>This item may have been removed by the seller.</p>
          <button className="btn-primary" onClick={() => onNavigate('shop')}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isService = item.category === 'services';
  const saved = wishlist.has(item.id);

  const handleOrderNow = () => {
    onNavigate('checkout', null, {
      mode: 'direct',
      items: [{ ...item, qty }]
    });
  };

  const handleChat = () => {
    const conversationId = startConversation(item.id, buyerName);
    onNavigate('chat', null, { conversationId });
  };

  return (
    <div className="page-wrapper product-detail-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="crumb-sep">&gt;</span>
        <button className="crumb-link" onClick={() => onNavigate('shop')}>Shop</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">{item.name}</span>
      </div>

      <button className="detail-back-btn" onClick={() => onNavigate('shop')}>
        <ChevronLeft /> Back to listings
      </button>

      <div className="product-detail-grid">
        <div className="product-detail-media">
          {isService ? (
            <span className="detail-service-emoji">{item.emoji}</span>
          ) : (
            <img src={item.img} alt={item.name} className="detail-img" />
          )}
          {item.originalPrice && (
            <span className="detail-discount">
              Save {Math.round(((item.numericPrice ? item.originalPrice.replace(/[^0-9.]/g, '') - item.numericPrice : 0) /
                item.originalPrice.replace(/[^0-9.]/g, '')) * 100)}%
            </span>
          )}
        </div>

        <div className="product-detail-info">
          <span className="detail-category">{isService ? 'Campus Service' : 'Campus Listing'}</span>
          <h1 className="detail-title">{item.name}</h1>

          <div className="product-rating">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < item.rating} />
              ))}
            </div>
            <span className="rating-count">
              {item.rating}.0 · {item.ratingCount} reviews
            </span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">{item.price}</span>
            {item.originalPrice && <span className="original-price">{item.originalPrice}</span>}
            {item.unit && <span className="service-unit">{item.unit}</span>}
          </div>

          <p className="detail-description">
            {item.description ||
              'Sold by a verified UniMart campus seller. Inspect the item on pickup or delivery and confirm receipt in the app.'}
          </p>

          <div className="detail-seller-row">
            <div className="detail-avatar">{(item.seller || 'U').charAt(0)}</div>
            <div>
              <span className="detail-seller-label">Sold by</span>
              <strong className="detail-seller-name">{item.seller || 'UniMart Campus Store'}</strong>
            </div>
            <button className="btn-ghost detail-chat-btn" onClick={handleChat}>
              <ChatIcon /> Chat Seller
            </button>
          </div>

          <div className="detail-qty-row">
            <span className="detail-qty-label">Quantity</span>
            <div className="detail-qty-control">
              <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-primary detail-order-btn" onClick={handleOrderNow}>
              Order Now <ArrowRight />
            </button>
            <button className="btn-outline detail-cart-btn" onClick={() => onAddToCart({ ...item, qty })}>
              <CartBtnIcon /> Add to Cart
            </button>
            <button
              className={`detail-wishlist-btn ${saved ? 'active' : ''}`}
              onClick={() => onToggleWishlist(item.id, item.name)}
              aria-label="Save to favourites"
            >
              <HeartIcon filled={saved} />
            </button>
          </div>

          <div className="detail-trust-grid">
            <div className="detail-trust-item">
              <DeliveryIcon />
              <div>
                <strong>Campus delivery or pickup</strong>
                <span>Free delivery on orders over GH₵50</span>
              </div>
            </div>
            <div className="detail-trust-item">
              <ShieldIcon />
              <div>
                <strong>Buyer protection</strong>
                <span>10-day dispute window after delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
