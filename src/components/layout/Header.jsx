import { useCart } from '../../context/CartContext';
import Icon from '../ui/Icon';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useCurrentLocation from '../../hooks/useCurrentLocation';

export default function Header() {
  const { cartCount, notify } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { location, loading, refreshLocation } = useCurrentLocation();
  return <header className="header"><div className="header-inner">
    <Link to="/" className="brand"><div className="brand-mark"><span>A</span><small>▦</small></div><b>Aashanway</b></Link>
    <nav className="desktop-nav"><NavLink to="/" end>Home</NavLink><NavLink to="/orders">Orders</NavLink><NavLink to="/post">Sell</NavLink><NavLink to="/chat">Chat</NavLink><NavLink to="/plans">Plans</NavLink><NavLink to="/dashboard">Seller Dashboard</NavLink></nav>
    <button className="location" type="button" onClick={refreshLocation} disabled={loading} title="Refresh current location. Address data © OpenStreetMap contributors"><strong>{loading ? 'Finding location...' : 'Current location'}</strong><span><Icon name="pin" size={16}/>{location}<b>⌄</b></span></button>
    <Link className="round-button" to="/cart" aria-label="Cart"><Icon name="cart"/>{cartCount > 0 && <b className="cart-count">{cartCount}</b>}</Link>
    <div className="auth-actions">{isAuthenticated ? <Link className="register-link" to="/dashboard">{user?.name || 'Dashboard'}</Link> : <><Link to="/login">Login</Link><Link className="register-link" to="/register">Register</Link></>}</div>
    <button className="round-button mobile-logout" onClick={() => notify('Logout action selected')} aria-label="Log out"><Icon name="logout"/></button>
  </div>
  </header>;
}
