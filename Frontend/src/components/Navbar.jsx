import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Package, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];
  const { selectedCategory, setSelectedCategory, searchItems, setSearchItems } = useContext(CategoryContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!token && !!user;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="page-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '64px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-primary), #FF8C5A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Package size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
              Shop<span style={{ color: 'var(--color-primary)' }}>Ease</span>
            </span>
          </Link>

          {/* Category Select */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                appearance: 'none', padding: '8px 32px 8px 12px',
                border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface)', fontSize: '13px', fontWeight: '500',
                color: 'var(--color-text)', fontFamily: 'Inter, sans-serif',
                cursor: 'pointer', outline: 'none', minWidth: '140px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={searchItems}
              onChange={(e) => setSearchItems(e.target.value)}
              placeholder="Search products..."
              style={{
                width: '100%', padding: '9px 14px 9px 38px',
                border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                fontFamily: 'Inter, sans-serif', fontSize: '14px',
                color: 'var(--color-text)', outline: 'none', transition: 'all 0.2s',
                background: '#F7F8FA'
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.background = '#F7F8FA'; }}
            />
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link to="/" style={{ padding: '8px 10px', fontWeight: '500', fontSize: '14px', color: location.pathname === '/' ? 'var(--color-primary)' : 'var(--color-text)', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', textDecoration: 'none' }}>
              Home
            </Link>
            <Link to="/collection" style={{ padding: '8px 10px', fontWeight: '500', fontSize: '14px', color: location.pathname === '/collection' ? 'var(--color-primary)' : 'var(--color-text)', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', textDecoration: 'none' }}>
              Collection
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" style={{ position: 'relative', padding: '8px', display: 'flex', alignItems: 'center', color: 'var(--color-text)', textDecoration: 'none' }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  background: 'var(--color-primary)', color: '#fff',
                  fontSize: '10px', fontWeight: '700', lineHeight: '1',
                  width: '17px', height: '17px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #fff'
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link to="/orders" style={{ display: 'flex', flexDirection: 'column', padding: '6px 10px', borderRadius: 'var(--radius-md)', textDecoration: 'none', border: '1.5px solid var(--color-border)', background: 'var(--color-surface)' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: '500' }}>Hello,</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text)', fontWeight: '700', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ padding: '8px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', alignItems: 'center' }}
                  title="Logout"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <User size={14} /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
