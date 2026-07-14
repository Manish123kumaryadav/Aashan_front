import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const { notify } = useCart();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true); setError('');
    try {
      if (isRegister) await register({ name: data.get('name'), email: data.get('identity'), password: data.get('password'), role_id: 2 });
      else await login(data.get('identity'), data.get('password'));
      notify(isRegister ? 'Account created successfully' : 'Login successful');
      navigate('/dashboard');
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  };

  return <section className="auth-page">
    <div className="auth-copy"><span className="sale-label">Welcome to Aashanway</span><h1>{isRegister ? 'Join your local marketplace' : 'Welcome back'}</h1><p>{isRegister ? 'Create your account to buy, sell and connect with trusted people near you.' : 'Login to manage orders, listings, chats and saved products.'}</p><ul><li>Verified local sellers</li><li>Secure marketplace experience</li><li>Fast buyer and seller communication</li></ul></div>
    <form className="auth-card" onSubmit={submit}><h2>{isRegister ? 'Create account' : 'Login'}</h2><p>{isRegister ? 'Enter your details to get started.' : 'Enter your account details.'}</p>
      {isRegister && <label>Full name<input name="name" type="text" placeholder="Your full name" autoComplete="name" required/></label>}
      <label>Email or phone<input name="identity" type="text" placeholder="name@example.com" autoComplete="username" required/></label>
      <label>Password<div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 8 characters" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength="8" required/><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
      {isRegister && <label className="check"><input type="checkbox" required/><span>I agree to the Terms and Privacy Policy.</span></label>}
      {error && <div className="form-error">{error}</div>}
      <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}</button>
      <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Aashanway?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Create account'}</Link></p>
    </form>
  </section>;
}
