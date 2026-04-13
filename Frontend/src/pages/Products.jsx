import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ArrowLeft, Shield, Truck, RotateCcw, Check } from 'lucide-react';
import API from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../cart/cartSlice';

const StarRating = ({ rating = 0, size = 16 }) => (
  <span style={{ fontSize: size + 'px' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? '#F6AD55' : '#E2E8F0' }}>★</span>
    ))}
  </span>
);

const Products = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(s => s.cart.cartItems);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const cartQty = cartItems.find(i => i.productId === productId)?.quantity || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          API.get(`/products/${productId}`),
          API.get(`/products/${productId}/reviews`)
        ]);
        setProduct(prodRes.data.product);
        setReviews(revRes.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await API.post('/cart/add', { productId, quantity: 1 });
      dispatch(addToCart({ productId, quantity: 1 }));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await API.post(`/products/${productId}/reviews`, reviewForm);
      setReviews(prev => [...prev, res.data.review]);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
    </div>
  );

  if (!product) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div className="empty-state-icon">😕</div>
      <h3 className="empty-state-title">Product not found</h3>
      <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="page-container" style={{ paddingTop: '24px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
            <ArrowLeft size={15} /> Back
          </button>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            / {product.category} / {product.name}
          </span>
        </div>

        {/* Main Product Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '60px' }}>

          {/* Left: Images */}
          <div>
            {/* Main Image */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#f8f9fa', aspectRatio: '1', marginBottom: '12px', border: '1px solid var(--color-border)' }}>
              <img
                src={product.images?.[selectedImg]?.url || `https://placehold.co/600x600/f8f9fa/ccc?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    style={{
                      width: '68px', height: '68px', borderRadius: 'var(--radius-md)',
                      overflow: 'hidden', cursor: 'pointer',
                      border: `2px solid ${selectedImg === i ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text)', marginTop: '8px', lineHeight: '1.25' }}>
              {product.name}
            </h1>

            {/* Rating Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <StarRating rating={product.rating} />
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                {product.rating?.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ margin: '20px 0' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-text)' }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: '8px' }}>incl. all taxes</span>
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)' }} />
              <span style={{ fontSize: '13px', fontWeight: '600', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '28px' }}>
              {product.description}
            </p>

            {/* CTA Buttons */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg btn-full"
                  style={{ gap: '10px' }}
                >
                  {addedToCart ? (
                    <><Check size={18} /> Added to Cart</>
                  ) : (
                    <><ShoppingBag size={18} /> Add to Cart {cartQty > 0 && `(${cartQty} in cart)`}</>
                  )}
                </button>
                <button
                  onClick={() => { handleAddToCart(); navigate('/cart'); }}
                  className="btn btn-outline btn-lg btn-full"
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '24px' }}>
              {[
                { icon: <Truck size={16} />, text: 'Free delivery above ₹499' },
                { icon: <Shield size={16} />, text: 'Secure payments' },
                { icon: <RotateCcw size={16} />, text: '30-day returns' }
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 8px', background: '#F7F8FA', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ color: 'var(--color-primary)' }}>{b.icon}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '500' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '40px' }}>
          <h2 className="section-title" style={{ marginBottom: '28px' }}>
            Customer Reviews
            {reviews.length > 0 && <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-muted)', marginLeft: '12px', textDecoration: 'none' }}>({reviews.length})</span>}
          </h2>

          {/* Review List */}
          {reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {reviews.map((review, i) => (
                <div key={i} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                        {review.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{review.user?.name || 'User'}</div>
                        <StarRating rating={review.rating} size={13} />
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '32px' }}>No reviews yet. Be the first to review!</p>
          )}

          {/* Write Review */}
          <div className="card" style={{ padding: '28px', maxWidth: '600px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '17px', marginBottom: '20px' }}>Write a Review</h3>
            {reviewError && <div className="alert alert-error">{reviewError}</div>}
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s} type="button"
                      onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                      style={{ fontSize: '26px', background: 'none', border: 'none', cursor: 'pointer', color: s <= reviewForm.rating ? '#F6AD55' : '#E2E8F0', transition: 'color 0.15s' }}
                    >★</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-input" rows={4}
                  placeholder="Share your experience with this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={reviewLoading}>
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
