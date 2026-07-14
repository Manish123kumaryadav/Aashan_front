import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const CartContext = createContext(null);
function savedCart() { try { return JSON.parse(localStorage.getItem('aashanway-cart')) || []; } catch { return []; } }
function unitPrice(product) { return product.type === 'rental' ? Number(product.rentalRate || 0) : Number(product.price || 0); }

export function CartProvider({ children }) {
  const [items, setItems] = useState(savedCart);
  const [toast, setToast] = useState('');
  const timer = useRef();
  useEffect(() => { localStorage.setItem('aashanway-cart', JSON.stringify(items)); }, [items]);
  const notify = (message) => { setToast(message); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setToast(''), 1800); };
  const addToCart = (product) => {
    setItems((current) => { const found = current.find((item) => item.id === product.id); return found ? current.map((item) => item.id === product.id ? { ...item, quantity: Math.min(10, item.quantity + 1) } : item) : [...current, { ...product, quantity: 1 }]; });
    notify(`${product.title} added to cart`);
  };
  const updateQuantity = (id, quantity) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(10, Number(quantity))) } : item));
  const removeFromCart = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);
  const platformFee = items.length * 19;
  const deliveryFee = items.reduce((sum, item) => sum + (unitPrice(item) > 10000 ? 0 : 49), 0);
  const total = subtotal + platformFee + deliveryFee;
  const value = useMemo(() => ({ items, cartCount, subtotal, platformFee, deliveryFee, total, addToCart, updateQuantity, removeFromCart, clearCart, notify }), [items, cartCount, subtotal, platformFee, deliveryFee, total]);
  return <CartContext.Provider value={value}>{children}{toast && <div className="toast">{toast}</div>}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used inside CartProvider'); return context; }
