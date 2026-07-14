import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const money = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

export default function CartPage() {
  const cart = useCart(); const { isAuthenticated } = useAuth(); const navigate = useNavigate();
  if (!cart.items.length) return <section className="empty-cart panel"><div className="empty-cart-icon">🛒</div><h1>Your cart is empty</h1><p>Add products from the marketplace to continue.</p><Link to="/">Start shopping</Link></section>;
  const checkout = () => navigate(isAuthenticated ? '/checkout' : '/login', { state: { from: '/checkout' } });
  return <div className="commerce-page"><div className="commerce-heading"><div><span>SHOPPING CART</span><h1>Your Cart</h1><p>{cart.cartCount} item{cart.cartCount === 1 ? '' : 's'} ready for checkout</p></div><Link to="/">Continue shopping</Link></div>
    <div className="cart-layout"><section className="cart-items">{cart.items.map((item) => <article className="cart-item" key={item.id}><div className="cart-image">{item.image ? <img src={item.image} alt={item.title}/> : <span>{item.title.slice(0,2)}</span>}</div><div className="cart-product"><b className={`product-type ${item.type}`}>{item.type}</b><h2>{item.title}</h2><p>{item.condition} · {item.location}</p><strong>{money(item.type === 'rental' ? item.rentalRate : item.price)}{item.type === 'rental' && '/day'}</strong></div><div className="quantity-control"><button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button><span>{item.quantity}</span><button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button></div><button className="remove-item" onClick={() => cart.removeFromCart(item.id)}>Remove</button></article>)}</section>
      <aside className="price-card"><h2>Price details</h2><Price label="Subtotal" value={cart.subtotal}/><Price label="Platform fee" value={cart.platformFee}/><Price label="Delivery" value={cart.deliveryFee} free={!cart.deliveryFee}/><div className="price-total"><span>Total amount</span><strong>{money(cart.total)}</strong></div><button onClick={checkout}>{isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}</button><small>🔒 Secure checkout powered by Razorpay</small></aside>
    </div>
  </div>;
}

function Price({ label, value, free }) { return <div className="price-row"><span>{label}</span><b>{free ? 'FREE' : money(value)}</b></div>; }
