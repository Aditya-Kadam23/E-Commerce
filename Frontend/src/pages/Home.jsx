import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, TrendingUp, Zap, Shield, Truck } from 'lucide-react';
import API from '../api/axios';
import { CategoryContext } from '../context/CategoryContext';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, increaseQuantity, decreaseQuantity } from '../cart/cartSlice';
import Footer from './Footer';
import Pagination from './Pagination';

// Star Rating Component
const StarRating = ({ rating = 0 }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= full ? '#F6AD55' : (i === full + 1 && hasHalf ? '#F6AD55' : '#E2E8F0'), fontSize: '13px' }}>★</span>
      ))}
    </span>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [allPages, setAllPages] = useState(1);
  const { selectedCategory, searchItems } = useContext(CategoryContext);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/api/products?category=${selectedCategory}&search=${searchItems}&page=${page}`);
        setProducts(res.data.products);
        setAllPages(res.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchItems, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(1);
  }, [selectedCategory, searchItems]);

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      // BUG FIX: was using raw axios without auth token — now uses API instance
      await API.post('/api/cart/add', { productId, quantity: 1 });
      dispatch(addToCart({ productId, quantity: 1 }));
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const getCartQty = (productId) =>
    cartItems.find(i => i.productId === productId)?.quantity || 0;

  const features = [
    { icon: <Truck size={20} />, title: 'Free Delivery', desc: 'On orders above ₹499' },
    { icon: <Shield size={20} />, title: 'Secure Payment', desc: '100% safe transactions' },
    { icon: <Zap size={20} />, title: 'Fast Shipping', desc: 'Delivered in 2–5 days' },
    { icon: <TrendingUp size={20} />, title: 'Best Prices', desc: 'Guaranteed lowest price' },
  ];

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* Hero Banner */}
      {!searchItems && !selectedCategory && (
        <div style={{
          background: 'linear-gradient(135deg, #1A202C 0%, #2D3748 50%, #1A202C 100%)',
          padding: '64px 0', marginBottom: '0', position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,107,53,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-80px', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(108,99,255,0.1)', pointerEvents: 'none' }} />

          <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', borderRadius: '20px', padding: '6px 14px', marginBottom: '20px' }}>
                <Zap size={13} color="var(--color-primary)" />
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>New Arrivals Every Week</span>
              </div>
              <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#fff', lineHeight: '1.15', marginBottom: '16px', letterSpacing: '-1px' }}>
                Shop the Latest<br />
                <span style={{ background: 'linear-gradient(90deg, var(--color-primary), #FF8C5A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Trends & Deals
                </span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', marginBottom: '32px', lineHeight: '1.6' }}>
                Thousands of products. Unbeatable prices. Delivered to your door.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary btn-lg" style={{ animation: 'pulse-orange 2s infinite' }}>
                  <ShoppingBag size={18} /> Shop Now
                </button>
                <button className="btn btn-ghost btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                  View Collections
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Strip */}
      {!searchItems && !selectedCategory && (
        <div style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)' }}>
          <div className="page-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '16px 0' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRight: i < 3 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ color: 'var(--color-primary)', flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-text)' }}>{f.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="page-container" style={{ padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 className="section-title">
              {selectedCategory ? selectedCategory : searchItems ? `Results for "${searchItems}"` : 'All Products'}
            </h2>
          </div>
          {products.length > 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Page {page} of {allPages}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {Array(10).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <div className="skeleton" style={{ height: '220px' }} />
                <div style={{ padding: '12px' }}>
                  <div className="skeleton" style={{ height: '12px', marginBottom: '8px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '60%', borderRadius: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-desc">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {products.map((product, idx) => {
              const qty = getCartQty(product._id);
              return (
                <div
                  key={product._id}
                  className="product-card animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {/* Image */}
                  <div className="product-card-img-wrap" style={{ height: '220px' }}>
                    <img
                      src={product.images?.[0]?.url || `https://placehold.co/300x400/f8f9fa/ccc?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="product-card-img"
                      style={{ height: '100%' }}
                    />
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="product-card-badge" style={{ background: 'var(--color-warning)', color: '#fff' }}>
                        Only {product.stock} left
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontWeight: '700', fontSize: '13px', background: '#333', padding: '4px 12px', borderRadius: '20px' }}>Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="product-card-body">
                    <div className="product-card-category">{product.category}</div>
                    <h2 className="product-card-name">{product.name}</h2>

                    {/* Rating */}
                    <div className="product-card-rating">
                      <StarRating rating={product.rating} />
                      <span>({product.numReviews || 0})</span>
                    </div>

                    {/* Price + Cart Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', gap: '8px' }}>
                      <span className="product-card-price">₹{product.price.toLocaleString()}</span>

                      {product.stock > 0 && (
                        qty > 0 ? (
                          <div className="qty-control" onClick={(e) => e.stopPropagation()}>
                            <button className="qty-btn" onClick={(e) => { e.stopPropagation(); dispatch(decreaseQuantity({ productId: product._id })); }}>−</button>
                            <span className="qty-value">{qty}</span>
                            <button className="qty-btn" onClick={(e) => { e.stopPropagation(); dispatch(increaseQuantity({ productId: product._id })); }}>+</button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleAddToCart(product._id, e)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Add
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <Pagination page={page} setPage={setPage} allPages={allPages} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
