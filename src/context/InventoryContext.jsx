import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dashboardService } from '../services/api';
import { useAuth } from './AuthContext';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const { token, role } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshProducts = useCallback(async () => {
    if (!token) { setProducts([]); return; }
    setLoading(true); setError('');
    try { setProducts(await dashboardService.list()); }
    catch (requestError) { setError(requestError.message); if (requestError.status === 401) setProducts([]); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { refreshProducts(); }, [refreshProducts]);
  const createProduct = async (values) => { const product = await dashboardService.create(values); setProducts((current) => [product, ...current]); return product; };
  const updateProduct = async (id, values) => { const product = await dashboardService.update(id, values); setProducts((current) => current.map((item) => item.id === String(id) ? product : item)); return product; };
  const deleteProduct = async (id) => { await dashboardService.remove(id); setProducts((current) => current.filter((product) => product.id !== String(id))); };
  const reviewProduct = async (id, status, rejectionReason = '') => { const product = await dashboardService.review(id, status, rejectionReason); setProducts((current) => current.map((item) => item.id === String(id) ? product : item)); return product; };
  const value = useMemo(() => ({ products, role, loading, error, refreshProducts, createProduct, updateProduct, deleteProduct, reviewProduct }), [products, role, loading, error, refreshProducts]);
  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used inside InventoryProvider');
  return context;
}
