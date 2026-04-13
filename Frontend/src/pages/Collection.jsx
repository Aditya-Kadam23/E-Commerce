import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Star } from 'lucide-react';
import API from '../api/axios';
import { CategoryContext } from '../context/CategoryContext';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, increaseQuantity, decreaseQuantity } from '../cart/cartSlice';
import Footer from './Footer';
import Pagination from './Pagination';

const StarRating = ({ rating = 0 }) => (
  <span>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? '#F6AD55' : '#E2E8F0', fontSize: '12px' }}>★</span>
    ))}
  </span>
);

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [allPages, setAllPages] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { selectedCategory, setSelectedCategory, searchItems } = useContext(CategoryContext);
  const dispatch = useDispatch();
  const cartItems = useSelector(s => s.cart.cartItems);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, search: searchItems });
        if (selectedCategory) params.set('category', selectedCategory);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        const res = await API.get(`/products?${params}`);
        setProducts(res.data.products);
        setAllPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, searchItems, page, minPrice, maxPrice]);

  useEffect(() => { setPage(1); }, [selectedCategory, searchItems, minPrice, maxPrice]);

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      dispatch(addToCart({ productId, quantity: 1 }));
    } catch (err) { console.error(err); }
  };

  const getQty = (productId) => cartItems.find(i => i.productId === productId)?.quantity || 0;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '20px 0' }}>
        <div className="page-container">
          <h1 style={{ fontSize: '22px', fontWeight: '800' }}>All Collections</h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Browse our full range of products</p>
        </div>
      </div>

      <div className="page-container" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '28px', alignItems: 'start' }}>

          {/* Sidebar Filters */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <Filter size={15} />
                <h2 style={{ fontWeight: '700', fontSize: '15px' }}>Filters</h2>
              </div>

              {/* Categories */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Category</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px', borderRadius: 'var(--radius-sm)', background: !selectedCategory ? '#FFF8F5' : 'transparent' }}>
                    <input type="radio" name="cat" value="" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} style={{ accentColor: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '13px', fontWeight: !selectedCategory ? '600' : '400', color: !selectedCategory ? 'var(--color-primary)' : 'var(--color-text)' }}>All Products</span>
                  </label>
                  {CATEGORIES.map(cat => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px', borderRadius: 'var(--radius-sm)', background: selectedCategory === cat ? '#FFF8F5' : 'transparent' }}>
                      <input type="radio" name="cat" value={cat} checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} style={{ accentColor: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '13px', fontWeight: selectedCategory === cat ? '600' : '400', color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-text)' }}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="divider" />

              {/* Price Range */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Price Range</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" className="form-input" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ flex: 1, padding: '8px 10px', fontSize: '13px' }} />
                  <input type="number" className="form-input" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ flex: 1, padding: '8px 10px', fontSize: '13px' }} />
                </div>
              </div>

              <button onClick={() => { setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); }} className="btn btn-ghost btn-sm btn-full">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                {loading ? 'Loading...' : `${products.length} products`}
              </span>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' }}>
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <div className="skeleton" style={{ height: '200px' }} />
                    <div style={{ padding: '12px' }}>
                      <div className="skeleton" style={{ height: '12px', marginBottom: '8px', borderRadius: '6px' }} />
                      <div className="skeleton" style={{ height: '16px', width: '60%', borderRadius: '6px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-title">No products found</h3>
                <p className="empty-state-desc">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px' }}>
                  {products.map((product) => {
                    const qty = getQty(product._id);
                    return (
                      <div key={product._id} className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
                        <div className="product-card-img-wrap" style={{ height: '200px' }}>
                          <img
                            src={product.images?.[0]?.url || `https://placehold.co/300x400/f8f9fa/ccc?text=${encodeURIComponent(product.name)}`}
                            alt={product.name} className="product-card-img" style={{ height: '100%' }}
                          />
                          {product.stock === 0 && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#fff', fontWeight: '700', fontSize: '12px', background: '#333', padding: '3px 10px', borderRadius: '20px' }}>Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <div className="product-card-body">
                          <div className="product-card-category">{product.category}</div>
                          <h2 className="product-card-name">{product.name}</h2>
                          <div className="product-card-rating">
                            <StarRating rating={product.rating} />
                            <span>({product.numReviews || 0})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                            <span className="product-card-price">₹{product.price.toLocaleString()}</span>
                            {product.stock > 0 && (
                              qty > 0 ? (
                                <div className="qty-control" onClick={(e) => e.stopPropagation()}>
                                  <button className="qty-btn" onClick={(e) => { e.stopPropagation(); dispatch(decreaseQuantity({ productId: product._id })); }}>−</button>
                                  <span className="qty-value">{qty}</span>
                                  <button className="qty-btn" onClick={(e) => { e.stopPropagation(); dispatch(increaseQuantity({ productId: product._id })); }}>+</button>
                                </div>
                              ) : (
                                <button onClick={(e) => handleAddToCart(product._id, e)} className="btn btn-primary btn-sm" style={{ padding: '5px 10px', fontSize: '12px' }}>Add</button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: '32px' }}>
                  <Pagination page={page} setPage={setPage} allPages={allPages} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Collection;
