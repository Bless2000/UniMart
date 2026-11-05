import React, { useState } from 'react';
import { MenuIcon, SearchIcon, UserIcon, HeartIcon, CartIcon } from './Icons';

export default function Navbar({ activePage, onNavigate, cartCount, wishlistCount, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'categories', label: 'Categories' },
    { id: 'deals', label: 'Deals' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button 
            className="menu-button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>

          <div className="brand-logo" onClick={() => handleNavClick('home')}>
            <img src="/images/unimart-logo.png" alt="UniMart" className="logo-img" />
          </div>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="navbar-right">
          {searchOpen ? (
            <div className="search-bar-inline">
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="search-inline-input"
              />
              <button className="search-inline-close" onClick={() => setSearchOpen(false)}>✕</button>
            </div>
          ) : (
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
          )}

          <button className="icon-btn" aria-label="Account" onClick={() => handleNavClick('about')}>
            <UserIcon />
          </button>

          <button className="icon-btn wishlist-icon-btn" aria-label="Wishlist" onClick={() => handleNavClick('shop')}>
            <HeartIcon filled={wishlistCount > 0} />
            {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
          </button>

          <button className="icon-btn cart-icon-btn" aria-label="Shopping Cart" onClick={onOpenCart}>
            <CartIcon />
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-header">
            <img src="/images/unimart-logo.png" alt="UniMart" className="mobile-logo-img" />
            <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)}>✕</button>
          </div>
          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`mobile-nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mobile-drawer-footer">
            <p>Campus Marketplace for Students & Staff</p>
          </div>
        </div>
      )}
    </header>
  );
}
