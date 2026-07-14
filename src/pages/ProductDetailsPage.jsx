import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import { useCart } from '../context/CartContext';
import { productService } from '../services/api';

const InfoRow = ({ icon, label, value }) => <div className="info-row"><Icon name={icon}/><div><span>{label}</span><strong>{value}</strong></div></div>;
const DetailItem = ({ label, value }) => <div><span>{label}</span><strong>{value}</strong></div>;

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { addToCart, notify } = useCart();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => { productService.getById(productId).then(setProduct).finally(() => setLoading(false)); }, [productId]);

  if (loading) return <div className="empty">Loading product...</div>;
  if (!product) return <div className="panel section-state"><h1>Product not found</h1><Link to="/">Back to home</Link></div>;

  return <div className="detail-page">
    <section className="detail-gallery">{product.image && <img src={product.image}  alt={product.title}/>}<span className="condition">{product.badge}</span><div className="gallery-dot"/><small>1/{product.imagePaths?.length || 1}</small></section><div className="thumbnail">{product.image && <img src={product.image} height={10} width={10} alt="Product thumbnail"/>}</div>
    <section className="panel product-summary"><span className="sale-label">For sale</span><b className="rating-pill">4.5 ★</b><h1>{product.title}</h1><p>167 seller ratings</p><strong className="detail-price">{product.type === 'rental' ? `Rs ${product.rentalRate.toLocaleString('en-IN')}/day` : `Rs ${product.price.toLocaleString('en-IN')}`}</strong><div className="coupon"><Icon name="tag"/><b>AASHANVALUE coupon can apply at cart.<br/>Verify seller before final payment.</b></div></section>
    <section className="action-bar"><button className="primary" onClick={() => addToCart(product)}>Add to cart</button><button className="buy" onClick={() => notify('Checkout started')}>Buy now</button><button onClick={() => notify('Chat opened')} aria-label="Chat"><Icon name="chat"/></button><button onClick={() => notify('Seller contact is available for subscribers')} aria-label="Call"><Icon name="phone"/></button></section>
    <section className="panel delivery"><h2>Delivery and location</h2><InfoRow icon="pin" label="Sold from" value={product.location}/><InfoRow icon="calendar" label="Available" value="2026-07-11"/><InfoRow icon="clock" label="Delivery" value="2 Days"/><InfoRow icon="back" label="Return by" value="2026-08-11"/></section>
    <section className="panel"><h2>Seller details</h2><div className="seller"><span>MK</span><div><strong>Manish kumar</strong><p>4.5 rated local seller · payment ma***@ybl</p></div></div><div className="seller-note"><h3>Inspect before pay</h3><p>Return accepted within 7 days if product is damaged.</p></div><div className="seller-lock"><div><h3>Seller contact locked</h3><p>Subscription users can view seller number and call like ...</p></div><button className="buy" onClick={() => notify('Choose a plan to unlock contact')}><Icon name="phone" size={20}/>View number</button></div></section>
    <section className="panel"><h2>Product details</h2><p>128GB, Natural Titanium, excellent condition with original box.</p><div className="details-grid"><DetailItem label="Category" value="Electronics"/><DetailItem label="Condition" value="Used product"/><DetailItem label="Posted" value="11 Jul 2026 12:28 PM"/><DetailItem label="Deal type" value="For sale"/></div></section>
    <section className="panel ratings"><h2>Seller ratings</h2><div className="rating-intro"><b>4.5 ★</b><div><strong>Trusted by local buyers</strong><p>167 ratings, seller response score and verified product photo checks.</p></div></div>{[92,66,24,10,5].map((width,index) => <div className="rating-row" key={width}><span>{5-index} ⭐</span><i><b style={{width:`${width}%`}}/></i></div>)}</section>
  </div>;
}
