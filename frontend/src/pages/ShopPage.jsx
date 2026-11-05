import React, { useState, useMemo } from 'react';
import FeaturesBar from '../components/FeaturesBar';
import { 
  HeartIcon, CartBtnIcon, StarIcon, ChevronDown, 
  GridIcon, ListIcon, FilterIcon, DeliveryIcon 
} from '../components/Icons';

export default function ShopPage({ onNavigate, onAddToCart, wishlist, onToggleWishlist, triggerToast }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1500);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedRating, setSelectedRating] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [activePageNum, setActivePageNum] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Full products dataset matching shop.jpeg
  const shopProducts = useMemo(() => [
    {
      id: 1,
      name: 'Smart Watch Series 8',
      price: '$199.99',
      numericPrice: 199.99,
      originalPrice: '$249.99',
      rating: 5,
      ratingCount: 128,
      img: '/images/prod-watch.png',
      category: 'electronics',
      brand: 'apple'
    },
    {
      id: 2,
      name: 'Noise Cancelling Headphones',
      price: '$129.99',
      numericPrice: 129.99,
      originalPrice: '$169.99',
      rating: 5,
      ratingCount: 96,
      img: '/images/prod-headphones.png',
      category: 'electronics',
      brand: 'sony'
    },
    {
      id: 3,
      name: 'Sport Running Shoes',
      price: '$79.99',
      numericPrice: 79.99,
      originalPrice: '$99.99',
      rating: 5,
      ratingCount: 152,
      img: '/images/prod-shoes.png',
      category: 'fashion',
      brand: 'nike'
    },
    {
      id: 4,
      name: 'Travel Backpack',
      price: '$49.99',
      numericPrice: 49.99,
      originalPrice: '$69.99',
      rating: 4,
      ratingCount: 88,
      img: '/images/prod-backpack.png',
      category: 'fashion',
      brand: 'adidas'
    },
    {
      id: 5,
      name: "Men's Hoodie",
      price: '$39.99',
      numericPrice: 39.99,
      originalPrice: '$59.99',
      rating: 5,
      ratingCount: 112,
      img: '/images/shop-hoodie.png',
      category: 'fashion',
      brand: 'nike'
    },
    {
      id: 6,
      name: 'iPhone 14 Pro Max',
      price: '$999.99',
      numericPrice: 999.99,
      originalPrice: '$1,099.99',
      rating: 5,
      ratingCount: 76,
      img: '/images/shop-iphone.png',
      category: 'phones',
      brand: 'apple'
    },
    {
      id: 7,
      name: 'Premium Fragrance Set',
      price: '$29.99',
      numericPrice: 29.99,
      originalPrice: '$49.99',
      rating: 4,
      ratingCount: 64,
      img: '/images/shop-fragrance.png',
      category: 'beauty',
      brand: 'other'
    },
    {
      id: 8,
      name: 'Wireless Game Controller',
      price: '$59.99',
      numericPrice: 59.99,
      originalPrice: '$79.99',
      rating: 5,
      ratingCount: 97,
      img: '/images/shop-controller.png',
      category: 'gaming',
      brand: 'sony'
    },
    {
      id: 9,
      name: 'Sony Alpha a7 III Camera',
      price: '$1,299.99',
      numericPrice: 1299.99,
      originalPrice: '$1,499.99',
      rating: 5,
      ratingCount: 38,
      img: '/images/shop-camera.png',
      category: 'electronics',
      brand: 'sony'
    },
    {
      id: 10,
      name: 'Wireless Earbuds',
      price: '$49.99',
      numericPrice: 49.99,
      originalPrice: '$69.99',
      rating: 4,
      ratingCount: 85,
      img: '/images/shop-earbuds.png',
      category: 'electronics',
      brand: 'samsung'
    },
    {
      id: 11,
      name: 'LED Desk Lamp',
      price: '$24.99',
      numericPrice: 24.99,
      originalPrice: '$39.99',
      rating: 4,
      ratingCount: 54,
      img: '/images/shop-lamp.png',
      category: 'home',
      brand: 'other'
    },
    {
      id: 12,
      name: 'Luxury Watch',
      price: '$149.99',
      numericPrice: 149.99,
      originalPrice: '$199.99',
      rating: 5,
      ratingCount: 62,
      img: '/images/shop-luxury-watch.png',
      category: 'accessories',
      brand: 'other'
    }
  ], []);

  // Compute category counts dynamically
  const shopCategories = useMemo(() => [
    { id: 'all', label: 'All Categories', count: shopProducts.length },
    { id: 'phones', label: 'Phones & Tablets', count: shopProducts.filter(p => p.category === 'phones').length },
    { id: 'electronics', label: 'Electronics', count: shopProducts.filter(p => p.category === 'electronics').length },
    { id: 'fashion', label: 'Fashion', count: shopProducts.filter(p => p.category === 'fashion').length },
    { id: 'home', label: 'Home & Living', count: shopProducts.filter(p => p.category === 'home').length },
    { id: 'beauty', label: 'Beauty & Health', count: shopProducts.filter(p => p.category === 'beauty').length },
    { id: 'gaming', label: 'Gaming', count: shopProducts.filter(p => p.category === 'gaming').length },
    { id: 'accessories', label: 'Accessories', count: shopProducts.filter(p => p.category === 'accessories').length }
  ], [shopProducts]);

  // Brand list with counts
  const brands = useMemo(() => [
    { id: 'apple', label: 'Apple', count: shopProducts.filter(p => p.brand === 'apple').length },
    { id: 'sony', label: 'Sony', count: shopProducts.filter(p => p.brand === 'sony').length },
    { id: 'nike', label: 'Nike', count: shopProducts.filter(p => p.brand === 'nike').length },
    { id: 'samsung', label: 'Samsung', count: shopProducts.filter(p => p.brand === 'samsung').length },
    { id: 'adidas', label: 'Adidas', count: shopProducts.filter(p => p.brand === 'adidas').length },
    { id: 'other', label: 'Other Brands', count: shopProducts.filter(p => p.brand === 'other').length }
  ], [shopProducts]);

  // Ratings
  const ratings = [
    { stars: 5, count: shopProducts.filter(p => p.rating === 5).length },
    { stars: 4, count: shopProducts.filter(p => p.rating >= 4).length },
    { stars: 3, count: shopProducts.filter(p => p.rating >= 3).length },
    { stars: 2, count: shopProducts.filter(p => p.rating >= 2).length },
    { stars: 1, count: shopProducts.filter(p => p.rating >= 1).length }
  ];

  // FILTER & SORT ENGINE
  const filteredProducts = useMemo(() => {
    return shopProducts.filter(product => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 2. Price Filter
      if (product.numericPrice > priceRange) {
        return false;
      }

      // 3. Brand Filter
      if (selectedBrands.size > 0 && !selectedBrands.has(product.brand)) {
        return false;
      }

      // 4. Rating Filter
      if (selectedRating !== null && product.rating < selectedRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      if (sortBy === 'price-low') {
        return a.numericPrice - b.numericPrice;
      }
      if (sortBy === 'price-high') {
        return b.numericPrice - a.numericPrice;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating || b.ratingCount - a.ratingCount;
      }
      if (sortBy === 'newest') {
        return b.id - a.id;
      }
      // 'featured'
      return a.id - b.id;
    });
  }, [shopProducts, selectedCategory, priceRange, selectedBrands, selectedRating, sortBy]);

  const toggleBrand = (brandId) => {
    setSelectedBrands(prev => {
      const next = new Set(prev);
      if (next.has(brandId)) {
        next.delete(brandId);
      } else {
        next.add(brandId);
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setPriceRange(1500);
    setSelectedBrands(new Set());
    setSelectedRating(null);
    setSortBy('featured');
    triggerToast('All filters reset');
  };

  const handleApplyFilters = () => {
    triggerToast(`Found ${filteredProducts.length} matching products`);
    setMobileFilterOpen(false);
  };

  const displayedBrands = showAllBrands ? brands : brands.slice(0, 5);

  return (
    <div className="page-wrapper shop-page">
      <div className="shop-header-wrapper">
        <div className="shop-breadcrumbs">
          <button onClick={() => onNavigate('home')} className="crumb-link">Home</button>
          <span className="crumb-sep">&gt;</span>
          <span className="crumb-current">Shop</span>
        </div>

        <div className="shop-header-row">
          <div className="shop-title-col">
            <h1 className="shop-main-title">Shop</h1>
            <p className="shop-subtitle">
              Browse our wide range of high-quality products at unbeatable prices.
            </p>
          </div>

          <div className="shop-promo-card">
            <div className="promo-text-wrap">
              <div className="promo-icon-wrap">
                <DeliveryIcon />
              </div>
              <div className="promo-texts">
                <h4>Free Delivery</h4>
                <p>On all orders over $50</p>
              </div>
            </div>
            <img 
              src="/images/special-offer-bag.png" 
              alt="Free Delivery Special" 
              className="shop-promo-img" 
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Bar */}
      <div className="mobile-filter-bar">
        <button className="mobile-filter-btn" onClick={() => setMobileFilterOpen(true)}>
          <FilterIcon /> Filters & Categories
          {(selectedCategory !== 'all' || selectedBrands.size > 0 || selectedRating !== null || priceRange < 1500) && (
            <span className="filter-active-dot">•</span>
          )}
        </button>
        <span className="mobile-product-count">
          {filteredProducts.length} Products
        </span>
      </div>

      {/* MAIN CONTENT: SIDEBAR + PRODUCT GRID */}
      <div className="shop-body-layout">
        {/* SIDEBAR FILTERS (Desktop + Mobile Drawer) */}
        <aside className={`shop-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-mobile-header">
            <h3>Filters</h3>
            <button className="sidebar-close-btn" onClick={() => setMobileFilterOpen(false)}>✕</button>
          </div>

          {/* Categories Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Categories</h4>
            <div className="filter-options-list">
              {shopCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-filter-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="cat-filter-label">{cat.label}</span>
                  <span className="cat-filter-count">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Filter by Price</h4>
            <div className="price-slider-wrap">
              <input
                type="range"
                min="10"
                max="1500"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-range-slider"
              />
              <div className="price-slider-values">
                <span>$10</span>
                <span className="active-price-val">${priceRange}</span>
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Brand</h4>
            <div className="brand-options-list">
              {displayedBrands.map(brand => (
                <label key={brand.id} className="brand-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedBrands.has(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                    className="custom-checkbox"
                  />
                  <span className="checkbox-brand-name">{brand.label}</span>
                  <span className="checkbox-brand-count">({brand.count})</span>
                </label>
              ))}
              {brands.length > 5 && (
                <button 
                  className="show-more-brands-btn"
                  onClick={() => setShowAllBrands(!showAllBrands)}
                >
                  {showAllBrands ? 'Show Less' : 'Show More'} <ChevronDown />
                </button>
              )}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Customer Rating</h4>
            <div className="rating-options-list">
              {ratings.map(r => (
                <button
                  key={r.stars}
                  className={`rating-filter-item ${selectedRating === r.stars ? 'active' : ''}`}
                  onClick={() => setSelectedRating(selectedRating === r.stars ? null : r.stars)}
                >
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < r.stars} />
                    ))}
                    <span className="rating-and-up">& Up</span>
                  </div>
                  <span className="rating-filter-count">({r.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Apply & Clear Buttons */}
          <div className="sidebar-action-btns">
            <button 
              className="btn-apply-filters"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
            <button 
              className="btn-clear-filters"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="sidebar-backdrop" onClick={() => setMobileFilterOpen(false)}></div>
        )}

        {/* MAIN PRODUCT GRID SECTION */}
        <main className="shop-products-main">
          {/* Controls Bar */}
          <div className="products-controls-bar">
            <div className="controls-left">
              <div className="view-mode-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <GridIcon />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <ListIcon />
                </button>
              </div>
              <span className="products-counter-text">
                Showing {filteredProducts.length === 0 ? 0 : 1} - {filteredProducts.length} of {filteredProducts.length} products
              </span>
            </div>

            <div className="controls-right">
              <div className="sort-dropdown-wrap">
                <span className="sort-label">Sort by:</span>
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Pills (if any) */}
          {(selectedCategory !== 'all' || selectedBrands.size > 0 || selectedRating !== null || priceRange < 1500) && (
            <div className="active-filters-chips-row">
              <span className="active-filters-title">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="filter-chip">
                  Category: {shopCategories.find(c => c.id === selectedCategory)?.label}
                  <button onClick={() => setSelectedCategory('all')} className="chip-remove">✕</button>
                </span>
              )}
              {priceRange < 1500 && (
                <span className="filter-chip">
                  Under ${priceRange}
                  <button onClick={() => setPriceRange(1500)} className="chip-remove">✕</button>
                </span>
              )}
              {Array.from(selectedBrands).map(b => (
                <span key={b} className="filter-chip">
                  {brands.find(brand => brand.id === b)?.label || b}
                  <button onClick={() => toggleBrand(b)} className="chip-remove">✕</button>
                </span>
              ))}
              {selectedRating !== null && (
                <span className="filter-chip">
                  {selectedRating}★ & Up
                  <button onClick={() => setSelectedRating(null)} className="chip-remove">✕</button>
                </span>
              )}
              <button onClick={handleClearFilters} className="clear-all-chips-btn">
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="no-products-found">
              <div className="no-products-icon">🔍</div>
              <h3>No products match your filters</h3>
              <p>Try broadening your price range, clearing brand selections, or choosing another category.</p>
              <button className="btn-primary" onClick={handleClearFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`shop-products-grid ${viewMode === 'list' ? 'list-layout' : ''}`}>
              {filteredProducts.map(prod => (
                <div key={prod.id} className="shop-product-card">
                  <button 
                    className={`wishlist-toggle ${wishlist.has(prod.id) ? 'active' : ''}`}
                    onClick={() => onToggleWishlist(prod.id, prod.name)}
                    aria-label="Wishlist"
                  >
                    <HeartIcon filled={wishlist.has(prod.id)} />
                  </button>

                  <div className="product-img-wrapper">
                    <img src={prod.img} alt={prod.name} className="product-thumb" />
                  </div>

                  <div className="product-details">
                    <h3 className="product-title" title={prod.name}>{prod.name}</h3>
                    <div className="product-rating">
                      <div className="stars-row">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < prod.rating} />
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
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="shop-pagination-wrap">
              <button 
                className="page-btn nav"
                disabled={activePageNum === 1}
                onClick={() => setActivePageNum(prev => Math.max(1, prev - 1))}
              >
                &lt;
              </button>
              <button 
                className={`page-btn ${activePageNum === 1 ? 'active' : ''}`}
                onClick={() => setActivePageNum(1)}
              >
                1
              </button>
              <button 
                className={`page-btn ${activePageNum === 2 ? 'active' : ''}`}
                onClick={() => setActivePageNum(2)}
              >
                2
              </button>
              <button 
                className={`page-btn ${activePageNum === 3 ? 'active' : ''}`}
                onClick={() => setActivePageNum(3)}
              >
                3
              </button>
              <span className="pagination-ellipsis">...</span>
              <button 
                className={`page-btn ${activePageNum === 10 ? 'active' : ''}`}
                onClick={() => setActivePageNum(10)}
              >
                10
              </button>
              <button 
                className="page-btn nav"
                disabled={activePageNum === 10}
                onClick={() => setActivePageNum(prev => Math.min(10, prev + 1))}
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>

      <FeaturesBar />
    </div>
  );
}
