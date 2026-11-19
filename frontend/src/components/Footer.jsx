import React from 'react';
import { 
  BadgeQuality, BadgePrices, BadgeDeals,
  FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon 
} from './Icons';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer-container">
      {/* Top Badges Row */}
      <div className="footer-top-row">
        <div className="footer-badges-col">
          <div className="footer-badge-item">
            <div className="badge-icon-box">
              <BadgeQuality />
            </div>
            <div className="badge-text-box">
              <h5 className="badge-heading">Top Quality</h5>
              <p className="badge-sub">Best quality products</p>
            </div>
          </div>

          <div className="footer-badge-item">
            <div className="badge-icon-box">
              <BadgePrices />
            </div>
            <div className="badge-text-box">
              <h5 className="badge-heading">Best Prices</h5>
              <p className="badge-sub">Unbeatable prices</p>
            </div>
          </div>

          <div className="footer-badge-item">
            <div className="badge-icon-box">
              <BadgeDeals />
            </div>
            <div className="badge-text-box">
              <h5 className="badge-heading">Great Deals</h5>
              <p className="badge-sub">Exciting daily deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Columns (from About Us & Contact Us design) */}
      <div className="footer-middle-row">
        <div className="footer-brand-col">
          <div className="footer-brand-title">UNIMART</div>
          <p className="footer-brand-tagline">
            Your one-stop shop for quality products at the best prices.
          </p>
          <div className="footer-social-row">
            <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href="#twitter" className="social-icon-btn" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#youtube" className="social-icon-btn" aria-label="YouTube">
              <YoutubeIcon />
            </a>
          </div>
        </div>

        <div className="footer-nav-col">
          <h5 className="footer-col-title">Quick Links</h5>
          <ul className="footer-link-list">
            <li><button onClick={() => onNavigate('home')} className="footer-link-btn">Home</button></li>
            <li><button onClick={() => onNavigate('shop')} className="footer-link-btn">Shop</button></li>
            <li><button onClick={() => onNavigate('categories')} className="footer-link-btn">Categories</button></li>
            <li><button onClick={() => onNavigate('favourites')} className="footer-link-btn">Favourites</button></li>
            <li><button onClick={() => onNavigate('about')} className="footer-link-btn">About Us</button></li>
            <li><button onClick={() => onNavigate('contact')} className="footer-link-btn">Contact</button></li>
          </ul>
        </div>

        <div className="footer-nav-col">
          <h5 className="footer-col-title">Customer Service</h5>
          <ul className="footer-link-list">
            <li><button onClick={() => onNavigate('contact')} className="footer-link-btn">Help Center</button></li>
            <li><a href="#shipping" className="footer-link-btn">Shipping Policy</a></li>
            <li><a href="#return" className="footer-link-btn">Return Policy</a></li>
            <li><a href="#terms" className="footer-link-btn">Terms & Conditions</a></li>
            <li><a href="#privacy" className="footer-link-btn">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright, Links & Payment Badges */}
      <div className="footer-bottom-row">
        <p className="copyright-text">
          © 2024 UNIMART. All Rights Reserved.
        </p>

        <div className="footer-links">
          <a href="#privacy" className="footer-link">Privacy Policy</a>
          <a href="#terms" className="footer-link">Terms & Conditions</a>
          <a href="#shipping" className="footer-link">Shipping Policy</a>
          <a href="#return" className="footer-link">Return Policy</a>
        </div>

        {/* Payment Gateway Badges */}
        <div className="payment-badges-row">
          <span className="pay-badge visa">VISA</span>
          <span className="pay-badge mc">Mastercard</span>
          <span className="pay-badge pp">PayPal</span>
          <span className="pay-badge ap">Apple Pay</span>
          <span className="pay-badge gp">G Pay</span>
        </div>
      </div>
    </footer>
  );
}
