import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className="footer"><div className="footer-inner">
    <div className="footer-about"><strong>Aashanway</strong><p>Buy, sell and discover trusted products near you. Simple, local and secure.</p></div>
    <div><b>Marketplace</b><Link to="/">Explore</Link><Link to="/dashboard/products/new">Sell product</Link><Link to="/dashboard">Seller dashboard</Link></div>
    <div><b>Company</b><Link to="/plans">Plans</Link><Link to="/chat">Support</Link><a href="mailto:support@aashanway.com">Contact us</a></div>
    <div><b>Account</b><Link to="/login">Login</Link><Link to="/register">Register</Link><Link to="/plans">Membership</Link></div>
  </div><p className="copyright">© 2026 Aashanway. All rights reserved.</p></footer>;
}
