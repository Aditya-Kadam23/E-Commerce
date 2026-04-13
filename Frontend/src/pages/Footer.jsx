import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#0F172A', color: '#94A3B8', marginTop: '60px' }}>
      {/* Main Footer */}
      <div className="page-container" style={{ paddingTop: '48px', paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--color-primary), #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: '800', fontSize: '18px', color: '#fff' }}>
                Shop<span style={{ color: 'var(--color-primary)' }}>Ease</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.7', maxWidth: '260px' }}>
              Your one-stop destination for quality products. Thousands of items, unbeatable prices, delivered to your door.
            </p>
            {/* Newsletter */}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E0', marginBottom: '10px' }}>Get exclusive deals in your inbox</p>
              <div style={{ display: 'flex', gap: '0' }}>
                <input
                  type="email" placeholder="Enter your email"
                  style={{ flex: 1, padding: '10px 14px', background: '#1E293B', border: '1px solid #334155', borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                />
                <button style={{ padding: '10px 16px', background: 'var(--color-primary)', border: 'none', borderRadius: '0 8px 8px 0', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Collections', to: '/collection' },
                { label: 'My Orders', to: '/orders' },
                { label: 'My Cart', to: '/cart' },
                { label: 'Contact Us', to: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Support</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['FAQs', 'Returns & Refunds', 'Shipping Policy', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: '📍', text: '123 Commerce Street, Mumbai, MH 400001' },
                { icon: '📞', text: '+91 98765 43210' },
                { icon: '✉️', text: 'support@shopease.in' },
                { icon: '🕐', text: 'Mon–Sat: 9AM – 6PM IST' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', lineHeight: '1.5' }}>
                  <span style={{ flexShrink: 0 }}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid #1E293B', padding: '16px 0' }}>
        <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ fontSize: '13px' }}>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Visa', 'Mastercard', 'UPI', 'RuPay'].map(m => (
              <span key={m} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;