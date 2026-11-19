import React from 'react';
import { HeartIcon, CartBtnIcon, ArrowRight } from '../components/Icons';
import { products, services } from '../data/catalog';

export default function FavouritesPage({ onNavigate, onAddToCart, wishlist, onToggleWishlist }) {
  const savedProducts = products.filter((product) => wishlist.has(product.id));
  const savedServices = services.filter((service) => wishlist.has(service.id));
  const totalSaved = savedProducts.length + savedServices.length;

  return (
    <div className="page-wrapper favourites-page">
      <div className="shop-breadcrumbs">
        <button onClick={() => onNavigate('home')} className="crumb-link">Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Favourites</span>
      </div>

      <div className="favourites-header">
        <div className="favourites-title-wrap">
          <h1 className="favourites-title">
            My <span className="highlight-yellow">Favourites</span>
          </h1>
          <p className="favourites-subtitle">
            {totalSaved === 0
              ? 'Everything you save will be kept here for later.'
              : `${totalSaved} ${totalSaved === 1 ? 'item' : 'items'} saved for later.`}
          </p>
        </div>

        <button className="btn-primary" onClick={() => onNavigate('shop')}>
          Continue Shopping <ArrowRight />
        </button>
      </div>

      {totalSaved === 0 ? (
        <div className="favourites-empty">
          <div className="favourites-empty-icon">
            <HeartIcon />
          </div>
          <h3>No favourites yet</h3>
          <p>
            Tap the heart on any product or service and it will show up here, ready to add to your cart.
          </p>
          <button className="btn-primary" onClick={() => onNavigate('shop')}>
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {savedProducts.length > 0 && (
            <section className="favourites-section">
              <h2 className="section-title favourites-section-title">
                Saved <span className="highlight-yellow">Products</span>
              </h2>

              <div className="products-grid favourites-grid">
                {savedProducts.map((prod) => (
                  <div key={prod.id} className="product-card">
                    <button
                      className="wishlist-toggle active"
                      onClick={() => onToggleWishlist(prod.id, prod.name)}
                      aria-label="Remove from favourites"
                    >
                      <HeartIcon filled />
                    </button>

                    <div className="product-img-wrapper">
                      <img src={prod.img} alt={prod.name} className="product-thumb" />
                    </div>

                    <div className="product-details">
                      <h3 className="product-title">{prod.name}</h3>
                      <div className="product-pricing">
                        <span className="current-price">{prod.price}</span>
                        <span className="original-price">{prod.originalPrice}</span>
                      </div>
                      <button className="btn-add-to-cart" onClick={() => onAddToCart(prod)}>
                        <CartBtnIcon /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {savedServices.length > 0 && (
            <section className="favourites-section">
              <h2 className="section-title favourites-section-title">
                Saved <span className="highlight-yellow">Services</span>
              </h2>

              <div className="services-grid favourites-services-grid">
                {savedServices.map((svc) => (
                  <div key={svc.id} className="service-card">
                    <button
                      className="wishlist-toggle active"
                      onClick={() => onToggleWishlist(svc.id, svc.name)}
                      aria-label="Remove from favourites"
                    >
                      <HeartIcon filled />
                    </button>

                    <div className="service-icon-wrap">
                      <span className="service-emoji">{svc.emoji}</span>
                    </div>

                    <h3 className="service-name">{svc.name}</h3>
                    <p className="service-desc">{svc.description}</p>

                    <div className="service-footer">
                      <div className="service-pricing">
                        <span className="current-price">{svc.price}</span>
                        <span className="service-unit">{svc.unit}</span>
                      </div>
                      <button className="btn-add-to-cart" onClick={() => onAddToCart(svc)}>
                        <CartBtnIcon /> Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
