import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { useCart } from '../../context/CartContext';

export default function ProductApprovalPage() {
  const { products, role, reviewProduct } = useInventory();
  const { notify } = useCart();
  const [reviewingId, setReviewingId] = useState('');
  const pending = products.filter((product) => product.status === 'pending');
  const review = async (id, status) => {
    const reason = status === 'rejected' ? window.prompt('Rejection reason seller ko bheja jayega:') : '';
    if (status === 'rejected' && reason === null) return;
    if (status === 'rejected' && reason.trim().length < 3) { notify('Please enter a valid rejection reason'); return; }
    try { setReviewingId(id); await reviewProduct(id, status, reason); notify(`Product ${status} successfully`); }
    catch (error) { notify(error.message); }
    finally { setReviewingId(''); }
  };
  if (role !== 'admin') return <div className="dashboard-panel access-message"><h2>Admin access required</h2><p>Product approvals sirf Admin role ke liye available hain.</p><Link to="/dashboard">Back to dashboard</Link></div>;
  return <div className="dashboard-page"><div className="dashboard-heading"><div><span>ADMIN REVIEW</span><h1>Product Approvals</h1><p>Seller ke submitted products verify karke approve ya reject karein.</p></div><b className="pending-count">{pending.length} pending</b></div>
    <section className="approval-grid">{pending.map((product) => <article className="approval-card" key={product.id}><div className={`approval-image ${product.type}`}>{product.image ? <img src={product.image} alt={product.title}/> : product.type.toUpperCase()}</div><div className="approval-content"><div><b className={`product-type ${product.type}`}>{product.type}</b><span>{product.createdAt}</span></div><h2>{product.title}</h2><p>{product.description}</p><dl><div><dt>Seller</dt><dd>{product.seller}</dd></div><div><dt>Category</dt><dd>{product.category}</dd></div><div><dt>Condition</dt><dd>{product.condition}</dd></div><div><dt>Price</dt><dd>{product.type === 'rental' ? `Rs ${product.rentalRate}/day` : `Rs ${product.price.toLocaleString('en-IN')}`}</dd></div></dl><div className="approval-actions"><button className="reject" disabled={reviewingId === product.id} onClick={() => review(product.id,'rejected')}>Reject</button><button className="accept" disabled={reviewingId === product.id} onClick={() => review(product.id,'approved')}>{reviewingId === product.id ? 'Processing...' : 'Approve Product'}</button></div></div></article>)}{!pending.length && <div className="dashboard-panel table-empty">All caught up — no products pending approval.</div>}</section>
  </div>;
}
