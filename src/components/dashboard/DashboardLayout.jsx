import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const sellerMenu = [
  ['Dashboard', '/dashboard'], ['Add Product', '/dashboard/products/new'], ['Product List', '/dashboard/products'],
];
const adminMenu = [
  ['Dashboard', '/dashboard'], ['Product List', '/dashboard/products'], ['Approvals', '/dashboard/approvals'],
];

export default function DashboardLayout() {
  const { role, loading, error, refreshProducts } = useInventory();
  const { user, logout: clearSession } = useAuth();
  const { notify } = useCart();
  const navigate = useNavigate();
  const menu = role === 'admin' ? adminMenu : sellerMenu;
  const logout = () => { clearSession(); notify('Logged out successfully'); navigate('/login'); };
  return <div className="seller-dashboard-app">
    <header className="dashboard-topbar"><Link to="/dashboard" className="dashboard-brand"><span>A</span><div><strong>Aashanway</strong><small>{role === 'admin' ? 'Admin Dashboard' : 'Seller Dashboard'}</small></div></Link><div className="dashboard-top-actions"><Link to="/">View website</Link><button onClick={logout}>Logout</button><span>{(user?.name || 'User').slice(0,2).toUpperCase()}</span></div></header>
    <section className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <div className="seller-profile"><span>{(user?.name || 'User').slice(0,2).toUpperCase()}</span><div><strong>{role === 'admin' ? 'Admin Panel' : user?.name || 'Seller'}</strong><small>{role === 'admin' ? 'Marketplace Admin' : 'Verified Seller'}</small></div></div>
      <nav>{menu.map(([label, path]) => <NavLink key={path} to={path} end={path === '/dashboard'}>{label}</NavLink>)}</nav>
      <div className="role-switch"><label>Logged in as</label><strong>{role === 'admin' ? 'Administrator' : 'Seller'}</strong><small>Role backend account se mila hai</small></div>
    </aside>
    <main className="dashboard-main"><div className="dashboard-mobile-title"><strong>Seller Dashboard</strong><span>{role}</span></div>{loading && <div className="api-banner">Loading products...</div>}{error && <div className="api-banner error">{error}<button onClick={refreshProducts}>Retry</button></div>}<Outlet/></main>
    </section>
  </div>;
}
