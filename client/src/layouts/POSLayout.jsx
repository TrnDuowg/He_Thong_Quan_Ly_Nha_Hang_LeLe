// src/layouts/POSLayout.jsx
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
// 1. Thêm icon Truck vào import
import { LayoutGrid, Calculator, Armchair, BarChart3, Settings, Truck } from 'lucide-react';

const POSLayout = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/pos/dashboard' },
    { icon: Calculator, label: 'Bán hàng', path: '/pos/order' },
    { icon: Armchair, label: 'Sơ đồ bàn', path: '/pos/tables' },
    // 2. Thêm mục Giao hàng vào đây
    { icon: Truck, label: 'Giao hàng', path: '/pos/delivery' }, 
    { icon: BarChart3, label: 'Báo cáo', path: '/pos/reports' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-display">
      {/* Header nhỏ */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <span className="font-bold text-slate-800">POS Bán Hàng</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="font-medium">Ca 1 (Sáng)</span>
          </div>
          <div className="flex items-center gap-2">
             <img src="https://ui-avatars.com/api/?name=Nguyen+Van+A" className="w-8 h-8 rounded-full" alt="User"/>
             <span className="font-medium text-slate-700">Nguyễn Văn A</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="h-16 bg-white border-t border-slate-200 flex justify-around items-center shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          // Logic active kiểm tra xem đường dẫn hiện tại có bắt đầu bằng path của item không
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 min-w-[60px] cursor-pointer transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {/* Icon */}
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Label */}
              <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                {item.label}
              </span>
              
              {/* Dấu chấm active */}
              {isActive && <div className="w-1 h-1 bg-blue-600 rounded-full mt-0.5"></div>}
            </Link>
          )
        })}
      </nav>
    </div>
  );
};

export default POSLayout;