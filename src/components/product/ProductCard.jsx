import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Icon from '../ui/Icon';
import FakeQr from '../ui/FakeQr';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, notify } = useCart();
  return <article className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
    <div className="product-photo">{product.image ? <img src={product.image} height={10} width={10} alt={product.title} /> : product.qr && <FakeQr />}<span className={`condition ${product.badge === 'NEW' ? 'new' : ''}`}>{product.badge}</span></div>
    <div className="product-info"><span className="sale-label">For sale</span><h3>{product.title}</h3><strong className="price">{product.type === 'rental' ? `Rs ${product.rentalRate.toLocaleString('en-IN')}/day` : `Rs ${product.price.toLocaleString('en-IN')}`}</strong><p><Icon name="pin" size={16} />{product.location}</p>
      <div className="card-actions"><button className="primary" onClick={(event) => { event.stopPropagation(); addToCart(product); }} aria-label={`Add ${product.title} to cart`}><Icon name="cart" /></button><button onClick={(event) => { event.stopPropagation(); notify(`Chat opened for ${product.title}`); }} aria-label={`Chat about ${product.title}`}><Icon name="chat" /></button></div>
    </div>
  </article>;
}
