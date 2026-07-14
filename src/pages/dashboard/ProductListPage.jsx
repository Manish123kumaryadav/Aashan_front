import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { useCart } from '../../context/CartContext';

export default function ProductListPage() {
  const { products, role, deleteProduct } = useInventory();
  const { notify } = useCart();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const filtered = useMemo(() => products.filter((product) => (type === 'all' || product.type === type) && product.title.toLowerCase().includes(search.toLowerCase())), [products, type, search]);
  const remove = async (product) => { if (window.confirm(`Delete ${product.title}?`)) { try { await deleteProduct(product.id); notify('Product deleted'); } catch (error) { notify(error.message); } } };

  return <div className="dashboard-page"><div className="dashboard-heading"><div><span>CATALOGUE MANAGEMENT</span><h1>Product List</h1><p>Search, filter, update aur product status manage karein.</p></div>{role === 'seller' && <Link className="dashboard-primary" to="/dashboard/products/new">+ Add Product</Link>}</div>
    <section className="dashboard-panel"><div className="table-tools"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..."/><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All product types</option><option value="old">Old products</option><option value="new">New products</option><option value="rental">Rental products</option></select></div>
      <div className="product-table-wrap"><table className="product-table"><thead><tr><th>Product</th><th>Type</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><div className="table-product"><span>{product.title.slice(0,2).toUpperCase()}</span><div><strong>{product.title}</strong><small>{product.category} · {product.id}</small></div></div></td><td><b className={`product-type ${product.type}`}>{product.type}</b></td><td>{product.type === 'rental' ? `Rs ${product.rentalRate}/day` : `Rs ${product.price.toLocaleString('en-IN')}`}</td><td>{product.stock}</td><td><b className={`status ${product.status}`}>{product.status}</b></td><td><div className="row-actions">{role === 'seller' ? <><Link to={`/dashboard/products/${product.id}/edit`}>Edit</Link><button className="danger" onClick={() => remove(product)}>Delete</button></> : product.status === 'pending' ? <Link to="/dashboard/approvals">Review</Link> : <span>Reviewed</span>}</div></td></tr>)}</tbody></table>{!filtered.length && <div className="table-empty">No products found.</div>}</div>
    </section>
  </div>;
}
