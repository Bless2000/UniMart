import React from 'react';
import FeaturesBar from '../components/FeaturesBar';
import { CircleArrowRight, TagIcon, ArrowRight } from '../components/Icons';
import { services } from '../data/catalog';

export default function CategoriesPage({ onNavigate }) {
  const allCategories = [
    { id: 'services', name: 'Services', count: services.length, emoji: '🛠️' },
    { id: 'phones', name: 'Phones & Tablets', count: 24, img: '/images/cat-phones.png' },
    { id: 'electronics', name: 'Electronics', count: 18, img: '/images/cat-electronics.png' },
    { id: 'fashion', name: 'Fashion', count: 22, img: '/images/cat-fashion.png' },
    { id: 'home', name: 'Home & Living', count: 16, img: '/images/cat-home.png' },
    { id: 'beauty', name: 'Beauty & Health', count: 14, img: '/images/cat-beauty.png' },
    { id: 'food', name: 'Food & Health', count: 20, img: '/images/cat-food.png' },
    { id: 'gaming', name: 'Gaming', count: 12, img: '/images/cat-gaming.png' },
    { id: 'accessories', name: 'Accessories', count: 14, img: '/images/cat-accessories.png' },
    { id: 'appliances', name: 'Appliances', count: 15, img: '/images/cat-appliances.png' },
    { id: 'sports', name: 'Sports & Outdoors', count: 11, img: '/images/cat-sports.png' },
    { id: 'auto', name: 'Automotive', count: 10, img: '/images/cat-auto.png' },
    { id: 'toys', name: 'Toys & Kids', count: 13, img: '/images/cat-toys.png' },
    { id: 'books', name: 'Books & Stationery', count: 17, img: '/images/cat-books.png' }
  ];

  return (
    <div className="page-wrapper categories-page">
      {/* HEADER SECTION */}
      <div className="categories-header-wrap">
        <div className="shop-breadcrumbs">
          <button onClick={() => onNavigate('home')} className="crumb-link">Home</button>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Categories</span>
        </div>

        <div className="categories-hero-banner">
          <div className="categories-hero-text">
            <h1 className="categories-hero-title">
              All <span className="highlight-yellow">Categories</span>
            </h1>
            <p className="categories-hero-subtitle">
              Browse our wide range of categories and find exactly what you need.
            </p>
          </div>

          <div className="categories-hero-img-wrap">
            <img 
              src="/images/about-hero.png" 
              alt="UniMart Categories" 
              className="categories-hero-img" 
            />
          </div>
        </div>
      </div>

      {/* 12 CATEGORIES GRID */}
      <section className="categories-grid-container">
        <div className="categories-catalog-grid">
          {allCategories.map(cat => (
            <div 
              key={cat.id} 
              className="catalog-category-card"
              onClick={() => onNavigate(cat.id === 'services' ? 'home' : 'shop', cat.id === 'services' ? 'services' : null)}
            >
              <div className="catalog-img-container">
                <div className="catalog-img-glow"></div>
                {cat.img ? (
                  <img src={cat.img} alt={cat.name} className="catalog-cat-thumb" />
                ) : (
                  <span className="catalog-cat-emoji">{cat.emoji}</span>
                )}
              </div>

              <div className="catalog-info-wrap">
                <h3 className="catalog-cat-name">{cat.name}</h3>
                <span className="catalog-cat-count">
                  {cat.count} {cat.id === 'services' ? 'Services' : 'Products'}
                </span>
                <div className="catalog-arrow-btn">
                  <CircleArrowRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST DEALS IN EVERY CATEGORY BANNER */}
      <section className="category-deals-banner-wrap">
        <div className="category-deals-banner">
          <div className="banner-left-wrap">
            <div className="deals-tag-icon-circle">
              <TagIcon />
            </div>
            <div className="deals-banner-texts">
              <h3 className="deals-banner-title">Best Deals in Every Category</h3>
              <p className="deals-banner-sub">
                Shop now and enjoy amazing discounts on top quality products.
              </p>
            </div>
          </div>

          <button 
            className="btn-primary deals-cta-btn"
            onClick={() => onNavigate('shop')}
          >
            Shop Deals Now <ArrowRight />
          </button>
        </div>
      </section>

      <FeaturesBar />
    </div>
  );
}
