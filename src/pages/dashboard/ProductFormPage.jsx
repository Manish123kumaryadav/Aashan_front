import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../../context/InventoryContext';
import { useCart } from '../../context/CartContext';
import { mediaService } from '../../services/api';

const blankProduct = { title: '', type: 'old', category: 'Electronics', price: '', rentalRate: '', stock: 1, condition: 'Good', location: '', imagePaths: [], storageImagePaths: [], description: '' };

export default function ProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, role, createProduct, updateProduct } = useInventory();
  const { notify } = useCart();
  const [form, setForm] = useState(blankProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const editing = Boolean(productId);

  useEffect(() => { if (editing) { const found = products.find((product) => product.id === productId); if (found) setForm(found); } }, [editing, productId, products]);
  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError('');
    try {
      const uploaded = files.length ? await Promise.all(files.map((file) => mediaService.uploadProduct(file))) : [];
      const storageImagePaths = [...(form.storageImagePaths || []), ...uploaded].slice(0, 5);
      if (!storageImagePaths.length) throw new Error('At least one product image is required');
      const values = { ...form, storageImagePaths, price: Number(form.price || 0), rentalRate: Number(form.rentalRate || 0), stock: Number(form.stock || 0) };
      const saved = editing ? await updateProduct(productId, values) : await createProduct(values);
      notify(saved.status === 'pending' ? 'Product saved and sent for approval' : editing ? 'Product updated and published' : 'Product added and published');
      navigate('/dashboard/products');
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  if (role === 'admin') return <div className="dashboard-panel access-message"><h2>Seller access required</h2><p>Admin products review kar sakta hai; product add karne ke liye Seller role select karein.</p><Link to="/dashboard/products">Product List</Link></div>;
  return <div className="dashboard-page"><div className="dashboard-heading"><div><span>PRODUCT CATALOGUE</span><h1>{editing ? 'Update Product' : 'Add Product'}</h1><p>Correct details bharein. Product save karte hi website par live hoga.</p></div><Link className="dashboard-secondary" to="/dashboard/products">Back to list</Link></div>
    <form className="product-form dashboard-panel" onSubmit={submit}>
      <div className="form-section"><h2>Product type</h2><p>Select karein ki product old, new ya rental hai.</p><div className="product-type-picker">{[['old','Old Product','Pre-owned item'],['new','New Product','Brand-new item'],['rental','Rental Product','Rent per day']].map(([value,label,help]) => <label className={form.type === value ? 'selected' : ''} key={value}><input type="radio" name="type" value={value} checked={form.type === value} onChange={set('type')}/><strong>{label}</strong><span>{help}</span></label>)}</div></div>
      <div className="form-section"><h2>Basic information</h2><div className="dashboard-fields"><label className="wide">Product title<input value={form.title} onChange={set('title')} placeholder="e.g. iPhone 15 Pro Max" required/></label><label>Category<select value={form.category} onChange={set('category')}><option>Electronics</option><option>Fashion</option><option>Furniture</option><option>Vehicles</option><option>Property</option><option>Other</option></select></label><label>Condition<select value={form.condition} onChange={set('condition')}><option>Brand New</option><option>Like New</option><option>Good</option><option>Fair</option></select></label>
        {form.type !== 'rental' ? <label>Sale price (Rs)<input type="number" min="1" value={form.price} onChange={set('price')} placeholder="95000" required/></label> : <label>Rent per day (Rs)<input type="number" min="1" value={form.rentalRate} onChange={set('rentalRate')} placeholder="2200" required/></label>}
        <label>Available quantity<input type="number" min="1" value={form.stock} onChange={set('stock')} required/></label><label>Location<input value={form.location || ''} onChange={set('location')} placeholder="Delhi" required/></label><label className="wide image-upload-field">Product images (maximum 5)<input type="file" accept="image/*" multiple onChange={(event) => { const selected = Array.from(event.target.files).slice(0, Math.max(0, 5 - (form.storageImagePaths?.length || 0))); setFiles(selected); }} required={!editing && !(form.storageImagePaths?.length)}/><span>{(form.storageImagePaths?.length || 0)} saved + {files.length} selected</span>{Boolean(form.storageImagePaths?.length) && <button type="button" onClick={() => setForm((current) => ({ ...current, imagePaths: [], storageImagePaths: [] }))}>Remove saved images</button>}</label><label className="wide">Description<textarea rows="5" value={form.description} onChange={set('description')} placeholder="Product specifications, warranty, delivery and other details..." required/></label></div></div>
      {error && <div className="form-error dashboard-form-error">{error}</div>}
      <div className="form-actions"><Link to="/dashboard/products">Cancel</Link><button type="submit" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Product' : 'Publish Product'}</button></div>
    </form>
  </div>;
}
