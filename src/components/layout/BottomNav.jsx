import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';

const items = [['home','Home','/'], ['box','Orders','/orders'], ['plus','Post','/post'], ['chat','Chat','/chat'], ['award','Plans','/plans']];

export default function BottomNav() {
  return <nav className="bottom-nav">{items.map(([icon, label, path]) =>
    <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => isActive ? 'active' : ''}><Icon name={icon}/><span>{label}</span></NavLink>
  )}</nav>;
}
