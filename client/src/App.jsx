import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// --- IMPORT LAYOUTS ---
import AdminLayout from './layouts/AdminLayout';
import POSLayout from './layouts/POSLayout';
import KitchenLayout from './layouts/KitchenLayout';
import CustomerLayout from './layouts/CustomerLayout'; 

// --- IMPORT ADMIN PAGES ---
import Dashboard from './pages/admin/Dashboard';
import ProductPage from './pages/admin/ProductPage';
import ComboPage from './pages/admin/ComboPage';
import RevenuePage from './pages/admin/RevenuePage';
import StaffPage from './pages/admin/StaffPage';
import ShiftPage from './pages/admin/ShiftPage';
import PromotionPage from './pages/admin/PromotionPage';
import StaffSchedule from './pages/admin/StaffSchedule';
import SettingsPage from './pages/admin/SettingsPage';

// --- IMPORT POS PAGES ---
import POSLogin from './pages/pos/POSLogin';
import POSDashboard from './pages/pos/POSDashboard';
import TableMap from './pages/pos/TableMap';
import OrderPage from './pages/pos/OrderPage'; 
import EndShift from './pages/pos/EndShift';
import DeliveryPage from './pages/pos/DeliveryPage';

// --- IMPORT KITCHEN PAGES ---
import KitchenLive from './pages/kitchen/KitchenLive'; 
import KitchenHistory from './pages/kitchen/KitchenHistory';

// --- IMPORT CUSTOMER PAGES ---
import CustomerHome from './pages/customer/Home';
import CustomerMenu from './pages/customer/Menu';
import CustomerCart from './pages/customer/Cart';
import CustomerProfile from './pages/customer/Profile';
import OrderTracking from './pages/customer/OrderTracking';
import CustomerLogin from './pages/customer/CustomerLogin';
import Reservation from './pages/customer/Reservation';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================
           1. PHÂN HỆ KHÁCH HÀNG (PUBLIC)
           ========================================= */}
        {/* Layout chính cho khách (Có menu dưới) */}
        <Route path="/" element={<CustomerLayout />}>
            <Route index element={<CustomerHome />} />
            <Route path="menu" element={<CustomerMenu />} />
            <Route path="cart" element={<CustomerCart />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="tracking" element={<OrderTracking />} /> 
            <Route path="reservation" element={<Reservation />} />
        </Route>

        {/* Trang Login Khách hàng (Nằm riêng để không hiện menu dưới) */}
        <Route path="/customer/login" element={<CustomerLogin />} />


        {/* =========================================
            2. TRANG ĐĂNG NHẬP HỆ THỐNG (Staff/Admin)
           ========================================= */}
        <Route path="/pos/login" element={<POSLogin />} />


        {/* =========================================
            3. PHÂN HỆ ADMIN (CHỈ ADMIN)
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="combo" element={<ComboPage />} /> 
              <Route path="promotions" element={<PromotionPage />} />
              <Route path="schedule" element={<StaffSchedule />} />
              <Route path="revenue" element={<RevenuePage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="shift" element={<ShiftPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
        </Route>


        {/* =========================================
            4. PHÂN HỆ POS (THU NGÂN & ADMIN)
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={['pos', 'admin']} />}>
            <Route path="/pos" element={<POSLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<POSDashboard />} />
              <Route path="order" element={<OrderPage />} />     
              <Route path="tables" element={<TableMap />} />    
              <Route path="reports" element={<EndShift />} />   
              <Route path="delivery" element={<DeliveryPage />} /> 
              <Route path="settings" element={<div className="p-10 text-center">Cài đặt (Đang phát triển)</div>} />
            </Route>
        </Route>


        {/* =========================================
            5. PHÂN HỆ BẾP (ĐẦU BẾP & ADMIN)
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={['kitchen', 'admin']} />}>
            <Route path="/kitchen" element={<KitchenLayout />}>
              <Route index element={<Navigate to="live" replace />} />
              <Route path="live" element={<KitchenLive />} />
              <Route path="history" element={<KitchenHistory />} />
            </Route>
        </Route>


        {/* TRANG 404 */}
        <Route path="*" element={
            <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500 font-bold text-xl">
                404 - Trang không tồn tại
            </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;