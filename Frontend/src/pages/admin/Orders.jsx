import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import API from '../../api/axios';

const STATUS_OPTIONS = ['processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['pending', 'paid', 'failed', 'cod'];

const statusColors = {
  processing: 'badge-warning',
  shipped: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-error',
};
const paymentColors = {
  pending: 'badge-warning',
  paid: 'badge-success',
  failed: 'badge-error',
  cod: 'badge-gray',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await API.get('/order/admin/orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, paymentStatus, orderStatus) => {
    setSaving(orderId);
    try {
      const res = await API.put(`/order/admin/orders/${orderId}/status`, { paymentStatus, orderStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data.order : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Orders</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{orders.length} orders total</p>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No orders yet</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            return (
              <div key={order._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Order Header */}
                <div style={{ padding: '14px 20px', background: '#FAFAFA', borderBottom: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Order</div>
                      <div style={{ fontWeight: '700', fontSize: '13px', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Customer</div>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{order.user?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{order.user?.email}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Date</div>
                      <div style={{ fontSize: '13px', fontWeight: '500' }}>{date}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Amount</div>
                      <div style={{ fontSize: '15px', fontWeight: '800' }}>₹{order.totalPrice.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className={`badge ${statusColors[order.orderStatus] || 'badge-gray'}`}>{order.orderStatus}</span>
                    <span className={`badge ${paymentColors[order.paymentStatus] || 'badge-gray'}`}>{order.paymentStatus}</span>
                  </div>
                </div>

                {/* Order Body */}
                <div style={{ padding: '16px 20px' }}>
                  {/* Items */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {order.orderItems?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: '#F7F8FA', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                        <Package size={12} color="var(--color-text-muted)" />
                        <span style={{ fontWeight: '500' }}>{item.product?.name || 'Product'}</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>× {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status Update Controls */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Order Status</div>
                      <select
                        className="form-input"
                        style={{ padding: '8px 12px', fontSize: '13px', width: 'auto', minWidth: '160px' }}
                        defaultValue={order.orderStatus}
                        id={`order-status-${order._id}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Payment Status</div>
                      <select
                        className="form-input"
                        style={{ padding: '8px 12px', fontSize: '13px', width: 'auto', minWidth: '160px' }}
                        defaultValue={order.paymentStatus}
                        id={`payment-status-${order._id}`}
                      >
                        {PAYMENT_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={saving === order._id}
                      onClick={() => {
                        const os = document.getElementById(`order-status-${order._id}`)?.value;
                        const ps = document.getElementById(`payment-status-${order._id}`)?.value;
                        handleStatusUpdate(order._id, ps, os);
                      }}
                    >
                      {saving === order._id ? 'Saving...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
