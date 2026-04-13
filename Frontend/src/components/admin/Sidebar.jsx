import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, ClipboardList, LogOut, Package } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ClipboardList size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--color-primary), #FF8C5A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#fff', letterSpacing: '-0.3px' }}>ShopEase</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <p style={{ fontSize: '10px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 8px', marginBottom: '8px', marginTop: '4px' }}>
          Navigation
        </p>
        <ul style={{ listStyle: 'none' }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
            return (
              <li key={item.name} style={{ marginBottom: '4px' }}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                    borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                    transition: 'all 0.2s',
                    background: isActive ? 'rgba(255,107,53,0.15)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : '#94A3B8',
                    borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                  }}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
            borderRadius: '10px', background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#64748B', fontWeight: '600', fontSize: '14px',
            width: '100%', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;