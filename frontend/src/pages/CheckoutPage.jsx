import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, DeliveryIcon, ShieldIcon, MapPinIcon } from '../components/Icons';
import { formatMoney, placeOrders } from '../data/orderStore';

const PICKUP_POINTS = ['Main Library entrance', 'Unity Hall front desk', 'SGS Building lobby'];

export default function CheckoutPage({ params, cartItems, buyerName, onClearCart, onNavigate, triggerToast }) {
  const direct = params?.mode === 'direct';
  const items = direct ? params.items : cartItems;
  const agreedPrice = direct ? params.agreedPrice || null : null;

  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState('Unity Hall, Block B, Room 214');
  const [pickupPoint, setPickupPoint] = useState(PICKUP_POINTS[0]);
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!items || items.length === 0) {
    return (
      <div className="page-wrapper checkout-page">
        <div className="detail-missing">
          <h2>Nothing to check out</h2>
          <p>Add a product or book a campus service first.</p>
          <button className="btn-primary" onClick={() => onNavigate('shop')}>
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  const groups = new Map();
  items.forEach((item) => {
    const seller = item.seller || 'UniMart Campus Store';
    if (!groups.has(seller)) groups.set(seller, []);
    groups.get(seller).push(item);
  });

  const pricedItems = items.map((item) => ({
    ...item,
    price: items.length === 1 && agreedPrice ? agreedPrice : item.numericPrice ?? Number(String(item.price).replace(/[^0-9.]/g, '')),
    qty: item.qty || 1
  }));

  const subtotal = pricedItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = deliveryType === 'pickup' || subtotal >= 50 ? 0 : 10;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (deliveryType === 'delivery' && !address.trim()) {
      triggerToast('Enter a delivery address or choose campus pickup.');
      return;
    }

    setSubmitting(true);
    const created = placeOrders({
      items: pricedItems,
      paymentMethod,
      deliveryType,
      deliveryAddress: deliveryType === 'pickup' ? `Pickup · ${pickupPoint}` : address.trim(),
      buyerName,
      agreedPrice,
      note
    });

    if (!direct) onClearCart();

    triggerToast(
      created.length > 1
        ? `${created.length} orders created — one per seller.`
        : `${created[0].id} created. ${paymentMethod === 'cod' ? 'Pay cash on delivery.' : 'Complete payment to notify the seller.'}`
    );

    if (created.length === 1) {
      onNavigate('order-detail', null, { orderId: created[0].id });
    } else {
      onNavigate('orders');
    }
    setSubmitting(false);
  };

  return (
    <div className="page-wrapper checkout-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('shop')}>Shop</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Checkout</span>
      </div>

      <button className="detail-back-btn" onClick={() => onNavigate(direct ? 'product' : 'shop', null, direct ? { productId: items[0].id } : null)}>
        <ChevronLeft /> Back
      </button>

      <div className="page-heading-row">
        <div>
          <h1 className="page-heading">
            Secure <span className="highlight-yellow">Checkout</span>
          </h1>
          <p className="page-subheading">
            {groups.size > 1
              ? `Your cart has items from ${groups.size} sellers, so it will be split into ${groups.size} separate orders.`
              : 'One order, one seller — with its own payment and dispute timeline.'}
          </p>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          <section className="checkout-card">
            <h2 className="checkout-card-title">1. Delivery method</h2>

            <div className="choice-grid">
              <button
                className={`choice-card ${deliveryType === 'delivery' ? 'active' : ''}`}
                onClick={() => setDeliveryType('delivery')}
              >
                <DeliveryIcon />
                <strong>Campus delivery</strong>
                <span>GH₵10 · free over GH₵50</span>
              </button>
              <button
                className={`choice-card ${deliveryType === 'pickup' ? 'active' : ''}`}
                onClick={() => setDeliveryType('pickup')}
              >
                <MapPinIcon />
                <strong>Campus pickup</strong>
                <span>Free · collect from the seller</span>
              </button>
            </div>

            {deliveryType === 'delivery' ? (
              <label className="checkout-field">
                <span className="checkout-label">Delivery address</span>
                <input
                  className="auth-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Hostel, block and room number"
                />
              </label>
            ) : (
              <label className="checkout-field">
                <span className="checkout-label">Pickup point</span>
                <select className="auth-input" value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)}>
                  {PICKUP_POINTS.map((point) => (
                    <option key={point} value={point}>{point}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="checkout-field">
              <span className="checkout-label">Note for the seller (optional)</span>
              <textarea
                className="auth-input checkout-textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Call me when you reach the hostel gate"
                rows={3}
              />
            </label>
          </section>

          <section className="checkout-card">
            <h2 className="checkout-card-title">2. Payment method</h2>

            <div className="choice-grid">
              <button
                className={`choice-card ${paymentMethod === 'paystack' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paystack')}
              >
                <ShieldIcon />
                <strong>Paystack</strong>
                <span>Card, Mobile Money or bank · paid before dispatch</span>
              </button>
              <button
                className={`choice-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <DeliveryIcon />
                <strong>Cash on Delivery</strong>
                <span>Pay the seller when you receive the item</span>
              </button>
            </div>

            <p className="checkout-hint">
              {paymentMethod === 'paystack'
                ? 'A Paystack webhook confirms payment and moves each order from pending payment to paid.'
                : 'Cash on delivery orders go straight to the seller for processing. The seller marks cash collected at delivery.'}
            </p>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2 className="checkout-card-title">Order summary</h2>

          {Array.from(groups.entries()).map(([seller, sellerItems]) => (
            <div key={seller} className="checkout-group">
              <div className="checkout-group-head">
                <span className="detail-avatar small">{seller.charAt(0)}</span>
                <div>
                  <strong>{seller}</strong>
                  <span>Separate order</span>
                </div>
              </div>

              {sellerItems.map((item) => {
                const unitPrice = pricedItems.find((p) => p.id === item.id)?.price;
                return (
                  <div key={item.id} className="checkout-line">
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="checkout-thumb" />
                    ) : (
                      <span className="checkout-thumb emoji">{item.emoji}</span>
                    )}
                    <div className="checkout-line-info">
                      <strong>{item.name}</strong>
                      <span>Qty {item.qty || 1}</span>
                    </div>
                    <span className="checkout-line-price">
                      {formatMoney(unitPrice * (item.qty || 1))}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>{deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}</span>
              <span>{deliveryFee === 0 ? 'Free' : formatMoney(deliveryFee)}</span>
            </div>
            {agreedPrice && (
              <div className="summary-row agreed">
                <span>Negotiated price applied</span>
                <span>{formatMoney(agreedPrice)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          <button className="btn-primary checkout-place-btn" onClick={handlePlaceOrder} disabled={submitting}>
            {submitting ? 'Placing order...' : paymentMethod === 'cod' ? 'Place Order · Pay on Delivery' : 'Place Order · Pay with Paystack'}
            <ArrowRight />
          </button>

          <p className="checkout-legal">
            You can cancel before the seller starts processing. After delivery you have 10 days to raise a dispute.
          </p>
        </aside>
      </div>
    </div>
  );
}
