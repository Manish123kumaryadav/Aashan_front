import { useEffect, useMemo, useState } from 'react';
import Icon from '../components/ui/Icon';
import FakeQr from '../components/ui/FakeQr';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services/api';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { productService.getAll().then(setProducts).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => products.filter((product) => product.title.toLowerCase().includes(search.toLowerCase())), [products, search]);

  return <>
    <label className="search"><Icon name="search"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search iPhone, sofa, bike, flat..."/></label>
    <section className="hero"><div><span>Aashan value sale</span><h1>Watch<br/>Rs 5,000</h1><p>NEW | Sector 38, Gurugram, Haryana, 122001</p></div><FakeQr/></section>
    <div className="slider-dots"><b/><i/><i/><i/><i/><i/></div>
    <section className="category-tabs"><button className="selected"><Icon name="tag"/><strong>Best value</strong><span>All</span></button><button><Icon name="calendar"/><strong>Rent now</strong><span>Rent</span></button><button><Icon name="sparkle"/><strong>New deals</strong><span>Buy New</span></button></section>
    {loading ? <div className="empty">Loading products...</div> : filtered.length ? <section className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product}/>)}</section> : <div className="empty">No products found</div>}
  </>;
}
