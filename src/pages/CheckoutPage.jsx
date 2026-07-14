import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/api';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script);
  });
}

const testModeCheckoutConfig = {
  display: {
    blocks: {
      testCard: {
        name: 'Test payment via card',
        instruments: [{ method: 'card' }],
      },
    },
    sequence: ['block.testCard'],
    preferences: { show_default_blocks: false },
  },
};

export default function CheckoutPage() {
  const cart = useCart(); const { user } = useAuth(); const navigate = useNavigate();
  const [paying, setPaying] = useState(false); const [error, setError] = useState('');
  if (!cart.items.length) return <section className="empty-cart panel"><h1>No items to checkout</h1><Link to="/cart">Back to cart</Link></section>;

  const pay = async (event) => {
    event.preventDefault(); setPaying(true); setError('');
    const data = new FormData(event.currentTarget);
    const deliveryAddress = `${data.get('address')}, ${data.get('city')} - ${data.get('pincode')}`;
    try {
      if (!(await loadRazorpay())) throw new Error('Razorpay Checkout could not load');
      const order = await paymentService.createRazorpayOrder(cart.items, deliveryAddress);
      const razorpay = new window.Razorpay({ key: order.keyId, amount: order.amount, currency: order.currency, name: 'Aashanway', description: order.testMode ? `${cart.cartCount} item(s) - TEST PAYMENT` : `${cart.cartCount} marketplace item(s)`, order_id: order.orderId, prefill: { name: user?.name || '', contact: data.get('phone') || user?.mobile || '' }, theme: { color: '#36d3a0' }, retry: { enabled: true }, ...(order.testMode ? { config: testModeCheckoutConfig } : {}), handler: async (response) => {
        try { const result = await paymentService.verifyRazorpayPayment(response); cart.clearCart(); navigate('/order-success', { replace: true, state: { orders: result.orders || [] } }); }
        catch (verifyError) { setError(verifyError.message); setPaying(false); }
      }, modal: { ondismiss: () => setPaying(false) } });
      razorpay.on('payment.failed', (response) => { setError(response.error?.description || 'Payment failed. Please retry.'); setPaying(false); });
      razorpay.open();
    } catch (requestError) { setError(requestError.message); setPaying(false); }
  };

  return <div className="checkout-page"><div className="commerce-heading"><div><span>SECURE CHECKOUT</span><h1>Delivery & Payment</h1><p>Complete your order securely.</p></div><Link to="/cart">Back to cart</Link></div><div className="checkout-layout"><form className="checkout-form panel" onSubmit={pay}><h2>Delivery address</h2><div className="checkout-fields"><label>Full name<input defaultValue={user?.name || ''} required/></label><label>Mobile number<input name="phone" defaultValue={user?.mobile || ''} pattern="[0-9+ -]{8,15}" required/></label><label className="wide">Address<input name="address" placeholder="House number, street and area" required/></label><label>City<input name="city" placeholder="Gurugram" required/></label><label>PIN code<input name="pincode" inputMode="numeric" pattern="[0-9]{6}" placeholder="122001" required/></label></div><div className="payment-choice"><span>✓</span><div><strong>Razorpay Secure Payment</strong><p>Test mode uses a simulated card payment. Live mode enables UPI, cards, netbanking and wallets.</p></div></div>{error && <div className="form-error">{error}</div>}<button className="pay-button" disabled={paying}>{paying ? 'Opening secure payment...' : `Pay Rs ${cart.total.toLocaleString('en-IN')}`}</button></form><aside className="checkout-summary price-card"><h2>Order summary</h2>{cart.items.map((item) => <div className="checkout-item" key={item.id}><span>{item.title} × {item.quantity}</span><b>Rs {((item.type === 'rental' ? item.rentalRate : item.price) * item.quantity).toLocaleString('en-IN')}</b></div>)}<div className="price-total"><span>Estimated total</span><strong>Rs {cart.total.toLocaleString('en-IN')}</strong></div><small>Final amount is securely recalculated by the server.</small></aside></div></div>;
}
