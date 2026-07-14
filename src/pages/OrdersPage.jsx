import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { orderService.list().then(setOrders).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false)); }, []);
  return <div className="commerce-page"><div className="commerce-heading"><div><span>YOUR PURCHASES</span><h1>My Orders</h1><p>Track purchases, delivery and payment status.</p></div><Link to="/">Shop more</Link></div>{loading ? <div className="empty">Loading orders...</div> : error ? <div className="form-error">{error}</div> : orders.length ? <section className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-top"><div><small>ORDER ID</small><strong>{order.id}</strong></div><b className={`status ${order.status === 'delivered' ? 'approved' : 'pending'}`}>{order.status}</b></div><div className="order-product"><div className="cart-image">{order.listing?.image ? <img src={order.listing.image} alt={order.listing.title}/> : 'A'}</div><div><h2>{order.listing?.title || 'Product'}</h2><p>Quantity: {order.quantity} · {order.paymentMethod || 'razorpay'}</p><strong>Rs {Number(order.total).toLocaleString('en-IN')}</strong></div></div><div className="order-footer"><span>{order.eta}</span><span>Placed {order.createdAt}</span></div></article>)}</section> : <section className="empty-cart panel"><h1>No orders yet</h1><p>Your completed purchases will appear here.</p><Link to="/">Explore products</Link></section>}</div>;
}
