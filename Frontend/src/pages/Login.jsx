import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,107,53,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(108,99,255,0.08) 0%, transparent 50%)'
    }}>

      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'none', background: 'linear-gradient(135deg, var(--color-primary) 0%, #FF8C5A 100%)',
        alignItems: 'center', justifyContent: 'center', padding: '60px',
        flexDirection: 'column', textAlign: 'center'
      }} className="login-left-panel">
        <ShoppingBag size={64} color="rgba(255,255,255,0.9)" />
        <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: '800', marginTop: '24px', lineHeight: '1.2' }}>
          Welcome to ShopEase
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginTop: '12px', maxWidth: '300px' }}>
          Discover thousands of products at the best prices.
        </p>
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '260px' }}>
          {['Free Delivery on orders ₹499+', 'Easy 30-day returns', 'Secure payments', 'Exclusive member deals'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', backdropFilter: 'blur(10px)' }}>
              <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>✓</span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo for mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px', justifyContent: 'center' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--color-primary), #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: '800', fontSize: '22px', color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
              Shop<span style={{ color: 'var(--color-primary)' }}>Ease</span>
            </span>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text)', marginBottom: '6px' }}>
              Sign in
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>
                Create one
              </Link>
            </p>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '38px' }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                  <a href="#" style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: '500', textDecoration: 'none' }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '38px', paddingRight: '40px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Signing in...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Sign In <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            By signing in, you agree to our{' '}
            <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;