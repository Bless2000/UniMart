import React, { useState } from 'react';
import FeaturesBar from '../components/FeaturesBar';
import { PlayIcon, HeartIcon, CartBtnIcon, StarIcon, ArrowRight, ChevronLeft, ChevronRight } from '../components/Icons';

export default function HomePage({ onNavigate, onAddToCart, wishlist, onToggleWishlist, triggerToast }) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Categories Data
  const categories = [
    { id: 'phones', name: 'Phones & Tablets', img: '/images/cat-phones.png' },
    { id: 'electronics', name: 'Electronics', img: '/images/cat-electronics.png' },
    { id: 'fashion', name: 'Fashion', img: '/images/cat-fashion.png' },
    { id: 'home', name: 'Home & Living', img: '/images/cat-home.png' },
    { id: 'beauty', name: 'Beauty & Health', img: '/images/cat-beauty.png' },
    { id: 'gaming', name: 'Gaming', img: '/images/cat-gaming.png' }
  ];

  // Best Selling Products Data
  const products = [
    {
      id: 1,
      name: 'Smart Watch Series 8',
      price: 'GH₵199.99',
      originalPrice: 'GH₵249.99',
      ratingCount: 128,
      img: '/images/prod-watch.png'
    },
    {
      id: 2,
      name: 'Noise Cancelling Headphones',
      price: 'GH₵129.99',
      originalPrice: 'GH₵169.99',
      ratingCount: 96,
      img: '/images/prod-headphones.png'
    },
    {
      id: 3,
      name: 'Sport Running Shoes',
      price: 'GH₵79.99',
      originalPrice: 'GH₵99.99',
      ratingCount: 152,
      img: '/images/prod-shoes.png'
    },
    {
      id: 4,
      name: 'Travel Backpack',
      price: 'GH₵49.99',
      originalPrice: 'GH₵69.99',
      ratingCount: 88,
      img: '/images/prod-backpack.png'
    }
  ];

  return (
    <div className="page-wrapper home-page">
      {/* Video Modal */}
      {videoModalOpen && (
        <div className="modal-overlay" onClick={() => setVideoModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setVideoModalOpen(false)}>✕</button>
            <div className="video-placeholder">
              <div className="video-center-icon">
                <PlayIcon />
              </div>
              <h3>UniMart Official Brand Video</h3>
              <p>Discover how UniMart empowers students and campus communities.</p>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text-col">
            <h1 className="hero-heading">
              Shop the <span className="highlight-yellow">Best.</span><br />
              Live the <span className="highlight-yellow">Best.</span>
            </h1>
            <p className="hero-description">
              Discover top-quality products at unbeatable prices. Your one-stop shop for everything you need.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => onNavigate('shop')}>
                Shop Now
              </button>
              <button className="btn-video" onClick={() => setVideoModalOpen(true)}>
                <PlayIcon />
                <span>Watch Video</span>
              </button>
            </div>
          </div>

          <div className="hero-image-col">
            <div className="hero-glow-bg"></div>
            <img 
              src="/images/hero-products.png" 
              alt="Shop the Best - UniMart Products" 
              className="hero-main-img" 
            />
          </div>
        </div>
      </section>

      {/* TRUST & FEATURES BAR */}
      <FeaturesBar />

      {/* SHOP BY CATEGORIES SECTION */}
      <section className="categories-section" id="categories">
        <div className="section-header">
          <h2 className="section-title">
            Shop by <span className="highlight-yellow">Categories</span>
          </h2>
          <button onClick={() => onNavigate('categories')} className="view-all-link">
            View All Categories <ArrowRight />
          </button>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="category-card" 
              onClick={() => onNavigate('shop')}
            >
              <div className="category-img-wrapper">
                <img src={cat.img} alt={cat.name} className="category-thumb" />
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-action">
                Shop Now <ArrowRight />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLING PRODUCTS SECTION */}
      <section className="products-section" id="shop">
        <div className="section-header">
          <h2 className="section-title">
            Best Selling <span className="highlight-yellow">Products</span>
          </h2>
          <button onClick={() => onNavigate('shop')} className="view-all-link">
            View All Products <ArrowRight />
          </button>
        </div>

        <div className="products-carousel-wrapper">
          <button 
            className="carousel-nav-btn prev-btn" 
            onClick={() => triggerToast('Browsing previous products')}
            aria-label="Previous products"
          >
            <ChevronLeft />
          </button>

          <div className="products-grid">
            {products.map((prod) => (
              <div key={prod.id} className="product-card">
                <button 
                  className={`wishlist-toggle ${wishlist.has(prod.id) ? 'active' : ''}`}
                  onClick={() => onToggleWishlist(prod.id, prod.name)}
                  aria-label="Add to wishlist"
                >
                  <HeartIcon filled={wishlist.has(prod.id)} />
                </button>

                <div className="product-img-wrapper">
                  <img src={prod.img} alt={prod.name} className="product-thumb" />
                </div>

                <div className="product-details">
                  <h3 className="product-title">{prod.name}</h3>
                  <div className="product-rating">
                    <div className="stars-row">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                    <span className="rating-count">({prod.ratingCount})</span>
                  </div>
                  <div className="product-pricing">
                    <span className="current-price">{prod.price}</span>
                    <span className="original-price">{prod.originalPrice}</span>
                  </div>
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => onAddToCart(prod)}
                  >
                    <CartBtnIcon /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="carousel-nav-btn next-btn" 
            onClick={() => triggerToast('Browsing more products')}
            aria-label="Next products"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* SPECIAL OFFER BANNER */}
      <section className="special-offer-section" id="deals">
        <div className="special-offer-card">
          <div className="offer-glow-left"></div>
          <div className="offer-content">
            <span className="offer-badge">Special Offer</span>
            <h2 className="offer-title">
              Up to <span className="highlight-yellow">50% Off</span>
            </h2>
            <p className="offer-subtitle">
              Limited time offer on selected items.
            </p>
            <button 
              className="btn-primary btn-deal"
              onClick={() => onNavigate('shop')}
            >
              Shop Deals Now
            </button>
          </div>

          <div className="offer-img-col">
            <img 
              src="/images/special-offer-bag.png" 
              alt="Special Offer UniMart Luxury Shopping Bag" 
              className="offer-bag-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
