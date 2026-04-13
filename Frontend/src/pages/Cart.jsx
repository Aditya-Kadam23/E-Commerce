import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import API from '../api/axios';
import { useDispatch } from 'react-redux';
import { removeFromCart } from '../cart/cartSlice';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      // BUG FIX: was using raw axios without token — now uses API instance
      const res = await API.get('/cart');
      setCart(res.data.cart);
      setTotal(res.data.totalAmount || 0);
    } catch (err) {
      console.error('Error fetching cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      dispatch(removeFromCart({ productId }));
      fetchCart();
    } catch (err) {
      console.error('Remove error', err);
    }
  };

  if (loading) return (
    <div className="loading-center" style={{ minHeight: '70vh' }}>
      <div className="spinner" />
    </div>
  );

  const hasItems = cart && cart.cartItems && cart.cartItems.length > 0;
  const delivery = total >= 499 ? 0 : 49;
  const finalTotal = total + delivery;

  return (
    <div style={{ minHeight: '70vh', background: 'var(--color-bg)', paddingTop: '32px', paddingBottom: '60px' }}>
      <div className="page-container">
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Shopping Cart</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          {hasItems ? `${cart.cartItems.length} item${cart.cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
        </p>

        {!hasItems ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-desc">Looks like you haven't added anything yet</p>
            <button className="btn btn-primary btn-lg" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
              <ShoppingBag size={18} /> Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

            {/* Cart Items */}
            <div>
              {cart.cartItems.map((item) => (
                <div key={item._id} className="card" style={{ marginBottom: '12px', padding: '0' }}>
                  <div style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                    {/* Image */}
                    <div style={{ width: '120px', height: '120px', flexShrink: 0, background: '#f8f9fa', borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)', overflow: 'hidden' }}>
                      <img
                        // BUG FIX: was item.product.images[0] (string), model stores {url, public_id}
                        src={item.product?.images?.[0]?.url || `https://placehold.co/120x120/f8f9fa/ccc?text=Item`}
                        alt={item.product?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h2 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: 'var(--color-text)' }}>
                          {item.product?.name}
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                          ₹{item.product?.price?.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '700', fontSize: '16px' }}>
                          ₹{(item.product?.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemove(item.product?._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: '13px', fontWeight: '500' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '80px' }}>
              <h2 style={{ fontWeight: '700', fontSize: '17px', marginBottom: '20px' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Subtotal ({cart.cartItems.length} items)</span>
                  <span style={{ fontWeight: '600' }}>₹{total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Delivery</span>
                  <span style={{ fontWeight: '600', color: delivery === 0 ? 'var(--color-success)' : 'var(--color-text)' }}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
                {delivery > 0 && (
                  <div style={{ background: '#FFF8F5', border: '1px solid #FFD4C2', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-primary)' }}>
                    <Tag size={12} /> Add ₹{(499 - total).toLocaleString()} more for free delivery!
                  </div>
                )}
              </div>

              <hr className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: '700', fontSize: '16px' }}>Total</span>
                <span style={{ fontWeight: '800', fontSize: '20px' }}>₹{finalTotal.toLocaleString()}</span>
              </div>

              <button
                onClick={() => navigate('/place-order')}
                className="btn btn-primary btn-full btn-lg"
                style={{ gap: '8px' }}
              >
                Proceed to Checkout <ArrowRight size={17} />
              </button>

              <button
                onClick={() => navigate('/')}
                className="btn btn-ghost btn-full"
                style={{ marginTop: '10px' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;