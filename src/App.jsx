import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import SectionPage from './pages/SectionPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import ProductFormPage from './pages/dashboard/ProductFormPage';
import ProductListPage from './pages/dashboard/ProductListPage';
import ProductApprovalPage from './pages/dashboard/ProductApprovalPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="products/:productId" element={<ProductDetailsPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
      <Route path="post" element={<SectionPage title="Post an ad" description="Create a listing and reach buyers near you." />} />
      <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="plans" element={<SectionPage title="Subscription plans" description="Unlock seller contacts and premium benefits." />} />
      <Route path="login" element={<AuthPage mode="login" />} />
      <Route path="register" element={<AuthPage mode="register" />} />
      <Route path="home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route path="dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route index element={<DashboardOverview />} />
      <Route path="products/new" element={<ProductFormPage />} />
      <Route path="products" element={<ProductListPage />} />
      <Route path="products/:productId/edit" element={<ProductFormPage />} />
      <Route path="approvals" element={<ProductApprovalPage />} />
    </Route>
  </Routes>;
}
