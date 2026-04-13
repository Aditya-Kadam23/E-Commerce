import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '32px 0', marginBottom: '40px' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>Contact Us</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Have a question or need help? We're here 6 days a week.
          </p>
        </div>
      </div>

      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '32px' }}>

          {/* Left: Contact Info */}
          <div>
            <div className="card" style={{ padding: '28px', marginBottom: '16px' }}>
              <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '20px' }}>Get in Touch</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  { icon: <Mail size={18} />, label: 'Email', value: 'support@shopease.in', color: '#6C63FF' },
                  { icon: <Phone size={18} />, label: 'Phone', value: '+91 98765 43210', color: '#FF6B35' },
                  { icon: <MapPin size={18} />, label: 'Address', value: '123 Commerce Street, Mumbai, Maharashtra 400001', color: '#38A169' },
                  { icon: <Clock size={18} />, label: 'Working Hours', value: 'Mon – Sat: 9:00 AM – 6:00 PM IST', color: '#3182CE' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: item.color + '18', color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text)' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '14px' }}>Frequently Asked Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { q: 'When will my order arrive?', a: 'Delivery takes 2–5 business days.' },
                  { q: 'How can I track my order?', a: 'Check your Orders page for live status.' },
                  { q: 'What is your return policy?', a: 'We offer hassle-free 30-day returns.' },
                ].map((faq, i) => (
                  <div key={i} style={{ padding: '12px', background: '#F7F8FA', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>{faq.q}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontWeight: '700', fontSize: '18px', marginBottom: '24px' }}>Send us a Message</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll get back to you within 24 hours.'); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" placeholder="John" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-input">
                  <option>Order Issue</option>
                  <option>Product Query</option>
                  <option>Return / Refund</option>
                  <option>Payment Problem</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={5} placeholder="Describe your issue or question in detail..." required />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ gap: '10px' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
