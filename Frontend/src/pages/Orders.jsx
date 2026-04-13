import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const statusConfig = {
  processing: { label: 'Processing', icon: <Clock size={14} />, style: 'badge-warning' },
  shipped:    { label: 'Shipped',    icon: <Truck size={14} />, style: 'badge-info' },
  delivered:  { label: 'Delivered', icon: <CheckCircle size={14} />, style: 'badge-success' },
  cancelled:  { label: 'Cancelled', icon: <XCircle size={14} />, style: 'badge-error' },
};

const paymentConfig = {
  pending: { label: 'Pending',   style: 'badge-warning' },
  paid:    { label: 'Paid',      style: 'badge-success' },
  failed:  { label: 'Failed',    style: 'badge-error' },
  cod:     { label: 'Cash on Delivery', style: 'badge-gray' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await API.get('/order/orders');
        setOrders(res.data.orderData || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingTop: '32px', paddingBottom: '60px' }}>
      <div className="page-container">
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>My Orders</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''} placed` : 'No orders yet'}
        </p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No orders yet</h3>
            <p className="empty-state-desc">When you place an order, it will appear here.</p>
            <button className="btn btn-primary btn-lg" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
              <ShoppingBag size={18} /> Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const orderStatus = statusConfig[order.orderStatus] || statusConfig.processing;
              const payStatus = paymentConfig[order.paymentStatus] || paymentConfig.pending;
              const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <div key={order._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  {/* Order Header */}
                  <div style={{ padding: '16px 24px', background: '#FAFAFA', borderBottom: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Order ID</div>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-text)', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Placed On</div>
                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{date}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Total</div>
                        <div style={{ fontWeight: '700', fontSize: '15px' }}>₹{order.totalPrice.toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className={`badge ${orderStatus.style}`} style={{ gap: '5px', display: 'inline-flex', alignItems: 'center' }}>
                        {orderStatus.icon} {orderStatus.label}
                      </span>
                      <span className={`badge ${payStatus.style}`}>{payStatus.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {order.orderItems.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#f8f9fa', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                            {item.product?.images?.[0]?.url ? (
                              <img src={item.product.images[0].url} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={20} color="#ccc" />
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.product?.name || 'Product'}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Qty: {item.quantity} · ₹{item.price.toLocaleString()}</div>
                          </div>
                          <div style={{ fontWeight: '700', fontSize: '14px' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div style={{ marginTop: '14px', padding: '10px 14px', background: '#F7F8FA', borderRadius: 'var(--radius-md)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '14px' }}>📍</span>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', marginBottom: '2px' }}>DELIVERY ADDRESS</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text)' }}>{order.shippingAddress}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
