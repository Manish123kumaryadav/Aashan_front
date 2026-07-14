import { Link } from 'react-router-dom';
export default function SectionPage({ title, description }) { return <section className="panel section-state"><span className="sale-label">Aashanway</span><h1>{title}</h1><p>{description}</p><Link to="/">Explore products</Link></section>; }
