import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

// --- IMPORT POS PAGES ---
import POSLogin from './pages/pos/POSLogin';
import POSDashboard from './pages/pos/POSDashboard';
import TableMap from './pages/pos/TableMap';
import OrderPage from './pages/pos/OrderPage'; 
import SalesPage from './pages/pos/SalesPage'; 
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
import OrderTracking from './pages/customer/OrderTracking'; // <--- 1. IMPORT MỚI

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================
           PHÂN HỆ KHÁCH HÀNG (CUSTOMER WEB APP)
           ========================================= */}
        <Route path="/" element={<CustomerLayout />}>
            <Route index element={<CustomerHome />} />
            <Route path="menu" element={<CustomerMenu />} />
            <Route path="cart" element={<CustomerCart />} />
            <Route path="profile" element={<CustomerProfile />} />
            
            {/* 2. ROUTE THEO DÕI ĐƠN HÀNG */}
            <Route path="tracking" element={<OrderTracking />} /> 
            
            {/* 3. ROUTE ĐẶT BÀN (Placeholder) */}
            <Route path="reservation" element={<div className="p-10 text-center font-bold text-slate-500">Tính năng Đặt bàn đang phát triển...</div>} />
        </Route>

        {/* =========================================
            PHÂN HỆ ADMIN (QUẢN LÝ)
           ========================================= */}
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
        </Route>

        {/* =========================================
            PHÂN HỆ POS (BÁN HÀNG & GIAO VẬN)
           ========================================= */}
        <Route path="/pos/login" element={<POSLogin />} />

        <Route path="/pos" element={<POSLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<POSDashboard />} />
          <Route path="sales" element={<OrderPage />} />    
          <Route path="payment" element={<SalesPage />} />  
          <Route path="tables" element={<TableMap />} />    
          <Route path="reports" element={<EndShift />} />   
          <Route path="delivery" element={<DeliveryPage />} /> 
          <Route path="settings" element={<div className="p-10 text-center">Cài đặt (Đang phát triển)</div>} />
        </Route>

        {/* =========================================
            PHÂN HỆ BẾP (KITCHEN DISPLAY SYSTEM)
           ========================================= */}
        <Route path="/kitchen" element={<KitchenLayout />}>
          <Route index element={<Navigate to="live" replace />} />
          <Route path="live" element={<KitchenLive />} />
          <Route path="history" element={<KitchenHistory />} />
        </Route>

        {/* TRANG 404 */}
        <Route path="*" element={
            <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500">
                404 - Trang không tồn tại
            </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;