import { Link } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';

export default function DashboardOverview() {
  const { products, role } = useInventory();
  const count = (status) => products.filter((product) => product.status === status).length;
  const typeCount = (type) => products.filter((product) => product.type === type).length;
  return <div className="dashboard-page">
    <div className="dashboard-heading"><div><span>{role === 'admin' ? 'ADMIN OVERVIEW' : 'SELLER OVERVIEW'}</span><h1>Dashboard</h1><p>Products aur approvals ko ek jagah se manage karein.</p></div>{role === 'seller' && <Link className="dashboard-primary" to="/dashboard/products/new">+ Add Product</Link>}</div>
    <section className="stat-grid"><Stat label="Total products" value={products.length} tone="blue"/><Stat label="Approved" value={count('approved')} tone="green"/><Stat label="Pending approval" value={count('pending')} tone="yellow"/><Stat label="Rejected" value={count('rejected')} tone="red"/></section>
    <section className="dashboard-panel"><div className="panel-title"><div><h2>Product inventory</h2><p>Type-wise active catalogue</p></div><Link to="/dashboard/products">View all</Link></div><div className="type-summary"><TypeCard type="Old products" count={typeCount('old')} detail="Pre-owned marketplace items"/><TypeCard type="New products" count={typeCount('new')} detail="Brand-new retail inventory"/><TypeCard type="Rental products" count={typeCount('rental')} detail="Products available on rent"/></div></section>
    <section className="dashboard-panel"><div className="panel-title"><div><h2>Recent products</h2><p>Latest catalogue activity</p></div></div><div className="compact-products">{products.slice(0, 5).map((product) => <div key={product.id}><span className={`type-icon ${product.type}`}>{product.type[0].toUpperCase()}</span><div><strong>{product.title}</strong><small>{product.category} · {product.type} product</small></div><b className={`status ${product.status}`}>{product.status}</b></div>)}</div></section>
  </div>;
}

function Stat({ label, value, tone }) { return <article className={`stat-card ${tone}`}><span>{label}</span><strong>{value}</strong><small>Current catalogue</small></article>; }
function TypeCard({ type, count, detail }) { return <article><span>{count}</span><div><strong>{type}</strong><p>{detail}</p></div></article>; }
