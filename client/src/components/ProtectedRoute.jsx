import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Component này nhận vào danh sách các quyền được phép (allowedRoles)
const ProtectedRoute = ({ allowedRoles }) => {
  // 1. Lấy thông tin user từ localStorage
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // 2. CHƯA ĐĂNG NHẬP -> Đá về trang Login
  if (!userStr || !token) {
    // replace: true để không cho bấm Back quay lại
    return <Navigate to="/pos/login" replace />;
  }

  const user = JSON.parse(userStr);

  // 3. ĐÃ ĐĂNG NHẬP NHƯNG SAI QUYỀN -> Đá về trang phù hợp hoặc báo lỗi
  // Ví dụ: Nhân viên Bếp (kitchen) cố tình vào trang Admin
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("⛔ Bạn không có quyền truy cập trang này!");
    
    // Điều hướng họ về đúng chuồng của họ
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'pos') return <Navigate to="/pos/dashboard" replace />;
    if (user.role === 'kitchen') return <Navigate to="/kitchen/live" replace />;
    
    return <Navigate to="/pos/login" replace />;
  }

  // 4. HỢP LỆ -> Cho phép đi tiếp vào các trang con (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;