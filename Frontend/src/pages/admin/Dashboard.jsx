import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, IndianRupee, Package, TrendingUp, Plus, X } from 'lucide-react';
import API from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, products: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '', images: [] });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          API.get('/order/admin/orders'),
          API.get('/user/admin/users'),
          API.get('/products'),
        ]);
        const orders = ordersRes.data.orders || [];
        const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
        setStats({
          users: usersRes.data.users?.length || 0,
          orders: orders.length,
          revenue: totalRevenue,
          products: productsRes.data.totalProducts || 0
        });
      } catch (err) {
        console.error('Stats error:', err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData(prev => ({ ...prev, images: files }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    setFormSuccess('');
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    for (let i = 0; i < formData.images.length; i++) {
      data.append('images', formData.images[i]);
    }
    try {
      await API.post('/api/products', data);
      setFormSuccess('Product added successfully!');
      setFormData({ name: '', description: '', price: '', category: '', stock: '', images: [] });
      setShowAddProduct(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: statsLoading ? '...' : stats.users.toLocaleString(), icon: <Users size={22} />, color: '#6C63FF', bg: '#EDE9FE' },
    { title: 'Total Orders', value: statsLoading ? '...' : stats.orders.toLocaleString(), icon: <ShoppingBag size={22} />, color: '#FF6B35', bg: '#FFF3EE' },
    { title: 'Total Revenue', value: statsLoading ? '...' : `₹${stats.revenue.toLocaleString()}`, icon: <IndianRupee size={22} />, color: '#38A169', bg: '#F0FFF4' },
    { title: 'Total Products', value: statsLoading ? '...' : stats.products.toLocaleString(), icon: <Package size={22} />, color: '#3182CE', bg: '#EBF8FF' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text)' }}>Dashboard</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Welcome back, Admin!</p>
        </div>
        <button onClick={() => setShowAddProduct(true)} className="btn btn-primary" style={{ gap: '8px' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((card, i) => (
          <div key={i} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: '500' }}>{card.title}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text)', marginTop: '2px' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Success Message */}
      {formSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>✅ {formSuccess}</div>
      )}

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Manage Products', desc: 'View, edit, delete products', path: '/admin/products', icon: <Package size={20} />, color: '#FF6B35', bg: '#FFF3EE' },
          { label: 'Manage Orders', desc: 'Update order & payment status', path: '/admin/orders', icon: <ShoppingBag size={20} />, color: '#6C63FF', bg: '#EDE9FE' },
          { label: 'Manage Users', desc: 'View all registered users', path: '/admin/users', icon: <Users size={20} />, color: '#38A169', bg: '#F0FFF4' },
        ].map((card, i) => (
          <a key={i} href={card.path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '20px', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                {card.icon}
              </div>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{card.label}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{card.desc}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowAddProduct(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '24px' }}>Add New Product</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required placeholder="e.g. iPhone 15 Pro" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input" rows={3} value={formData.description} onChange={handleChange} placeholder="Describe the product..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} required placeholder="999" min="1" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} required placeholder="50" min="0" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select name="category" className="form-input" value={formData.category} onChange={handleChange} required>
                  <option value="">Select category...</option>
                  {['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Product Images</label>
                <input type="file" name="images" multiple accept="image/*" onChange={handleChange} className="form-input" style={{ padding: '8px' }} />
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Upload up to 5 images</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Uploading...' : 'Add Product'}
                </button>
                <button type="button" onClick={() => setShowAddProduct(false)} className="btn btn-ghost btn-lg" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
