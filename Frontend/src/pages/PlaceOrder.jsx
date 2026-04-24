import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, Lock, CheckCircle } from 'lucide-react';
import API from '../api/axios';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await API.get('/cart');
        if (!res.data.cart || res.data.cart.cartItems.length === 0) {
          navigate('/cart');
        }
        setCart(res.data.cart);
      } catch (err) {
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      if (paymentMethod === 'cod') {
        await API.post('/order/orders', { shippingAddress, paymentMethod: 'cod' });
        setSuccess(true);
        setTimeout(() => navigate('/orders'), 3000);
      } else if (paymentMethod === 'razorpay') {
        const res = await API.post('/payment/create-order', { shippingAddress });
        const { razorpayOrder } = res.data;

        // Guard: Razorpay SDK might not have loaded from CDN yet
        if (!window.Razorpay) {
          setError('Payment gateway is not loaded. Please refresh the page and try again.');
          setPlacing(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
          amount: razorpayOrder.amount,
          currency: 'INR',
          name: 'ShopEase',
          description: 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              await API.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              setSuccess(true);
              setTimeout(() => navigate('/orders'), 3000);
            } catch (verifyErr) {
              setError(verifyErr.response?.data?.message || 'Payment verification failed. Contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              setPlacing(false);
              setError('Payment was cancelled.');
            }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: '#FF6B35' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        // Don't call setPlacing(false) here — modal is still open
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  if (success) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '40px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
        <CheckCircle size={44} color="var(--color-success)" />
      </div>
      <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--color-text)' }}>Order Placed!</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', maxWidth: '360px' }}>
        Your order has been successfully placed. You'll receive a confirmation shortly.
      </p>
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Redirecting to your orders...</p>
    </div>
  );

  const delivery = (cart?.totalPrice || 0) >= 499 ? 0 : 49;
  const finalTotal = (cart?.totalPrice || 0) + delivery;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingTop: '32px', paddingBottom: '60px' }}>
      <div className="page-container">
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Checkout</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          Complete your order below
        </p>

        {error && <div className="alert alert-error" style={{ marginBottom: '24px' }}>⚠️ {error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

          {/* Left: Form */}
          <form onSubmit={handlePlaceOrder}>

            {/* Delivery Address */}
            <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={16} color="var(--color-primary)" />
                </div>
                <h2 style={{ fontWeight: '700', fontSize: '16px' }}>Delivery Address</h2>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Delivery Address</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="House no., Street, Area, City, State, PIN code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={16} color="var(--color-accent)" />
                </div>
                <h2 style={{ fontWeight: '700', fontSize: '16px' }}>Payment Method</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                  { value: 'razorpay', label: 'Pay Online', desc: 'Cards, UPI, Netbanking & more', icon: '💳' }
                ].map(method => (
                  <label
                    key={method.value}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                      border: `2px solid ${paymentMethod === method.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)', cursor: 'pointer',
                      background: paymentMethod === method.value ? '#FFF8F5' : '#fff',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio" name="payment" value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '22px' }}>{method.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '14px' }}>{method.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{method.desc}</div>
                    </div>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === method.value ? 'var(--color-primary)' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === method.value && (
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={placing} style={{ gap: '10px' }}>
              <Lock size={16} />
              {placing ? 'Placing Order...' : `Place Order — ₹${finalTotal.toLocaleString()}`}
            </button>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
              <Lock size={11} /> Your payment information is encrypted and secure
            </p>
          </form>

          {/* Right: Order Summary */}
          <div>
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '18px' }}>Order Summary</h2>

              {/* Cart Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {cart?.cartItems?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#f8f9fa', flexShrink: 0 }}>
                      <img
                        src={item.product?.images?.[0]?.url || ''}
                        alt={item.product?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>₹{(item.product?.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <hr className="divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>₹{(cart?.totalPrice || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Delivery</span>
                  <span style={{ fontWeight: '600', color: delivery === 0 ? 'var(--color-success)' : 'inherit' }}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
              </div>

              <hr className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '800', fontSize: '15px' }}>Total</span>
                <span style={{ fontWeight: '800', fontSize: '20px' }}>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
              {[
                { icon: <Truck size={14} />, text: 'Estimated delivery in 2–5 business days' },
                { icon: <Lock size={14} />, text: 'Secure 256-bit SSL encrypted payment' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
