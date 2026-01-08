import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const KitchenLayout = () => {
  const location = useLocation();

  // Helper check active menu
  const isActive = (path) => location.pathname.includes(path)
    ? "bg-blue-600 text-white shadow-md" 
    : "bg-white text-slate-600 hover:bg-blue-50";

  return (
    // Dùng h-screen để ép chiều cao full màn hình
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* Header Bếp: Hardcode chiều cao h-[60px] */}
      <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-xl text-white">
            K
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-wide">BẾP TRUNG TÂM</h1>
        </div>

        {/* Menu Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Link to="/kitchen/live" className={`px-6 py-2 rounded-md font-medium transition-all ${isActive('live')}`}>
            Đang Chờ
          </Link>
          <Link to="/kitchen/history" className={`px-6 py-2 rounded-md font-medium transition-all ${isActive('history')}`}>
            Lịch Sử
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/pos/login" className="p-2 bg-white hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-slate-200 text-slate-500">
            {/* Nếu chưa load được icon thì hiện chữ LOGOUT */}
            <span className="material-symbols-outlined">logout</span>
          </Link>
        </div>
      </header>

      {/* Main Content: Flex-1 để chiếm hết phần còn lại */}
      <main className="flex-1 overflow-hidden relative w-full h-full p-4">
        {/* Nếu Outlet lỗi, dòng chữ này sẽ hiện ra để test */}
        <Outlet />
      </main>
      
    </div>
  );
};

export default KitchenLayout;