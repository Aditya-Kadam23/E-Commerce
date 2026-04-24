import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ShoppingBag, Mail, Lock, User, MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.post('/api/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F7F8FA 0%, #EEF2FF 100%)',
      backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(255,107,53,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(108,99,255,0.08) 0%, transparent 50%)',
      padding: '40px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--color-primary), #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: '800', fontSize: '22px', color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
            Shop<span style={{ color: 'var(--color-primary)' }}>Ease</span>
          </span>
        </div>

        <div className="card" style={{ padding: '36px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-text)', marginBottom: '6px' }}>
            Create account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '28px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text" name="name" className="form-input"
                  placeholder="John Doe" value={formData.name}
                  onChange={handleChange} style={{ paddingLeft: '38px' }} required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email" name="email" className="form-input"
                  placeholder="you@example.com" value={formData.email}
                  onChange={handleChange} style={{ paddingLeft: '38px' }} required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'} name="password" className="form-input"
                  placeholder="Min. 6 characters" value={formData.password}
                  onChange={handleChange} style={{ paddingLeft: '38px', paddingRight: '40px' }}
                  minLength={6} required
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Delivery Address <span style={{ color: 'var(--color-text-muted)', fontWeight: '400' }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-muted)' }} />
                <textarea
                  name="address" className="form-input" rows="2"
                  placeholder="Your delivery address..."
                  value={formData.address} onChange={handleChange}
                  style={{ paddingLeft: '38px', minHeight: '68px' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Creating account...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Create Account <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          By registering, you agree to our{' '}
          <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Terms</a>
          {' '}and{' '}
          <a href="#" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
