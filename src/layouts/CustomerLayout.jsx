import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Home, ClipboardList, User, Package, ShoppingBag } from 'lucide-react';

const CustomerLayout = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Context giả lập (Trong thực tế nên dùng React Context API)
  const [orderState, setOrderState] = useState({
    mode: 'delivery', // 'dine_in', 'takeaway', 'delivery'
    tableId: null,
    cartCount: 2
  });

  useEffect(() => {
    const table = searchParams.get('table');
    if (table) setOrderState({ ...orderState, mode: 'dine_in', tableId: table });
  }, [searchParams]);

  const navItems = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: ClipboardList, label: 'Menu', path: '/menu' },
    { icon: Package, label: 'Đơn hàng', path: '/tracking' }, // Trang theo dõi đơn
    { icon: User, label: 'Tài khoản', path: '/profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-display max-w-md mx-auto border-x border-slate-200 shadow-2xl relative overflow-hidden">
      {/* Header Sticky */}
      <header className="h-14 bg-white flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="font-black text-lg text-orange-600 tracking-tight">FASTFOOD Lele 🍔</div>
        <Link to="/cart" className="relative p-2">
            <ShoppingBag className="text-slate-700" size={24} />
            {orderState.cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {orderState.cartCount}
                </span>
            )}
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 scroll-smooth bg-slate-50">
        {/* Truyền state xuống các trang con */}
        <Outlet context={[orderState, setOrderState]} />
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-white border-t border-slate-200 fixed bottom-0 w-full max-w-md flex justify-around items-center z-40 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 w-16 cursor-pointer transition-all active:scale-95 ${
                isActive ? 'text-orange-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
};

export default CustomerLayout;