import React from 'react';
import { ShieldIcon, DeliveryIcon, ReturnsIcon, SupportIcon } from './Icons';

export default function FeaturesBar() {
  return (
    <section className="features-bar-section">
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon">
            <ShieldIcon />
          </div>
          <div className="feature-info">
            <h4 className="feature-title">Secure Payment</h4>
            <p className="feature-subtitle">100% secure payment</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <DeliveryIcon />
          </div>
          <div className="feature-info">
            <h4 className="feature-title">Free Delivery</h4>
            <p className="feature-subtitle">On orders over GH₵50</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <ReturnsIcon />
          </div>
          <div className="feature-info">
            <h4 className="feature-title">Easy Returns</h4>
            <p className="feature-subtitle">30-day return policy</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <SupportIcon />
          </div>
          <div className="feature-info">
            <h4 className="feature-title">24/7 Support</h4>
            <p className="feature-subtitle">Dedicated support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
