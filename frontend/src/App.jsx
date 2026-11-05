import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CategoriesPage from './pages/CategoriesPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import { 
  CartBtnIcon, HeartIcon, SearchIcon, UserIcon, ArrowRight
} from './components/Icons';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [toast, setToast] = useState(null);

  // Trigger temporary notification
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    triggerToast(`Added "${product.name}" to cart!`);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateQty = (productId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const toggleWishlist = (productId, productName) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        triggerToast(`Removed "${productName}" from wishlist`);
      } else {
        next.add(productId);
        triggerToast(`Added "${productName}" to wishlist!`);
      }
      return next;
    });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return acc + (priceNum * item.qty);
    }, 0).toFixed(2);
  };

  // Switch pages smoothly
  const navigateTo = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="unimart-app">
      {/* Toast Alert */}
      {toast && <div className="toast-notification">{toast}</div>}

      {/* Cart Slide-Over Drawer */}
      {cartOpen && (
        <div className="cart-drawer-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <h3>Shopping Cart ({totalCartCount})</h3>
              <button className="cart-drawer-close" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            <div className="cart-drawer-body">
              {cartItems.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon">🛒</div>
                  <h4>Your cart is empty</h4>
                  <p>Looks like you haven't added anything to your cart yet.</p>
                  <button 
                    className="btn-primary" 
                    onClick={() => { setCartOpen(false); navigateTo('shop'); }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item-row">
                      <img src={item.img} alt={item.name} className="cart-item-thumb" />
                      <div className="cart-item-info">
                        <h4 className="cart-item-title">{item.name}</h4>
                        <span className="cart-item-price">{item.price}</span>
                        <div className="cart-item-qty-row">
                          <button onClick={() => handleUpdateQty(item.id, -1)} className="qty-btn">-</button>
                          <span className="qty-val">{item.qty}</span>
                          <button onClick={() => handleUpdateQty(item.id, 1)} className="qty-btn">+</button>
                          <button onClick={() => handleRemoveFromCart(item.id)} className="remove-item-btn">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-subtotal-row">
                  <span>Subtotal</span>
                  <span className="subtotal-val">${calculateSubtotal()}</span>
                </div>
                <button 
                  className="btn-primary btn-checkout"
                  onClick={() => triggerToast('Proceeding to Paystack secure checkout...')}
                >
                  Proceed to Checkout <ArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        cartCount={totalCartCount}
        wishlistCount={wishlist.size}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Dynamic Page Views */}
      <main className="main-viewport">
        {activePage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            triggerToast={triggerToast}
          />
        )}

        {activePage === 'shop' && (
          <ShopPage
            onNavigate={navigateTo}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            triggerToast={triggerToast}
          />
        )}

        {activePage === 'categories' && (
          <CategoriesPage
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'about' && (
          <AboutUsPage
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'contact' && (
          <ContactUsPage
            triggerToast={triggerToast}
          />
        )}

        {activePage === 'deals' && (
          <ShopPage
            onNavigate={navigateTo}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            triggerToast={triggerToast}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (matches mobile design from UI Images) */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`mobile-tab-btn ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => navigateTo('home')}
        >
          <span className="tab-icon">🏠</span>
          <span className="tab-label">Home</span>
        </button>

        <button 
          className={`mobile-tab-btn ${activePage === 'shop' ? 'active' : ''}`}
          onClick={() => navigateTo('shop')}
        >
          <span className="tab-icon">🛍️</span>
          <span className="tab-label">Shop</span>
        </button>

        <button 
          className={`mobile-tab-btn ${activePage === 'categories' ? 'active' : ''}`}
          onClick={() => navigateTo('categories')}
        >
          <span className="tab-icon">📦</span>
          <span className="tab-label">Categories</span>
        </button>

        <button 
          className={`mobile-tab-btn ${activePage === 'about' ? 'active' : ''}`}
          onClick={() => navigateTo('about')}
        >
          <span className="tab-icon">ℹ️</span>
          <span className="tab-label">About</span>
        </button>

        <button 
          className={`mobile-tab-btn ${activePage === 'contact' ? 'active' : ''}`}
          onClick={() => navigateTo('contact')}
        >
          <span className="tab-icon">💬</span>
          <span className="tab-label">Contact</span>
        </button>
      </nav>

      {/* Global Footer */}
      <Footer 
        onNavigate={navigateTo} 
        triggerToast={triggerToast} 
      />
    </div>
  );
}
