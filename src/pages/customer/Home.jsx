import React from 'react';
import { Search, QrCode, ShoppingBag, Truck, Calendar, Plus } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [orderState, setOrderState] = useOutletContext();

  const handleSelectMode = (mode) => {
    setOrderState({ ...orderState, mode: mode });
    if (mode === 'reservation') navigate('/reservation');
    else navigate('/menu');
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* 1. Tìm kiếm */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input 
            type="text" 
            placeholder="Bạn muốn ăn gì hôm nay?" 
            className="w-full bg-white py-3 pl-10 pr-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
        />
      </div>

      {/* 2. Banner Khuyến mãi */}
      <div className="relative h-44 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
          {/* Ảnh nền */}
          <img 
            src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80" 
            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
            alt="Banner"
          />
          {/* Lớp phủ gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-6">
             <div className="text-white z-10 w-2/3">
                 <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Limited Offer</span>
                 <h3 className="text-2xl font-black mt-2 leading-tight">GIẢM 30% <br/><span className="text-orange-400">COMBO GIA ĐÌNH</span></h3>
                 <p className="text-xs text-slate-200 mt-2 font-medium">Áp dụng cho đơn từ 200k. Đừng bỏ lỡ!</p>
             </div>
          </div>
      </div>

      {/* 3. Lựa chọn Order (4 Ô Lớn) */}
      <div>
          <h3 className="font-bold text-slate-600 mb-3 text-sm uppercase tracking-wide">Bạn muốn dùng bữa thế nào?</h3>
          <div className="grid grid-cols-2 gap-3">
              {/* Ăn tại quán */}
              <button onClick={() => handleSelectMode('dine_in')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:border-orange-200 active:bg-orange-50 active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <QrCode size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-slate-800 text-sm block">Ăn tại quán</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Quét QR tại bàn</span>
                  </div>
              </button>

              {/* Mang về */}
              <button onClick={() => handleSelectMode('takeaway')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:border-blue-200 active:bg-blue-50 active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ShoppingBag size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-slate-800 text-sm block">Mang về</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Đến lấy không chờ</span>
                  </div>
              </button>

              {/* Giao hàng */}
              <button onClick={() => handleSelectMode('delivery')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:border-green-200 active:bg-green-50 active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Truck size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-slate-800 text-sm block">Giao tận nơi</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Giao nhanh 30p</span>
                  </div>
              </button>

              {/* Đặt bàn */}
              <button onClick={() => navigate('/reservation')} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:border-purple-200 active:bg-purple-50 active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Calendar size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-slate-800 text-sm block">Đặt bàn</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Giữ chỗ trước</span>
                  </div>
              </button>
          </div>
      </div>

      {/* 4. Món bán chạy */}
      <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wide">Món ngon phải thử 🔥</h3>
            <span className="text-xs text-orange-600 font-bold cursor-pointer hover:underline">Xem tất cả</span>
          </div>
          
          <div className="space-y-3">
              {/* Item 1: Burger */}
              <div className="bg-white p-3 rounded-xl shadow-sm flex gap-4 border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60" 
                    className="w-24 h-24 rounded-lg object-cover bg-slate-100 shrink-0" 
                    alt="Burger"
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                          <h4 className="font-bold text-slate-800 text-base">Burger Bò Phô Mai</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">Bò Úc nướng lửa hồng, phô mai Cheddar tan chảy béo ngậy.</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                          <span className="font-black text-orange-600 text-lg">65.000đ</span>
                          <button className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors shadow-sm">
                              <Plus size={18} />
                          </button>
                      </div>
                  </div>
              </div>

              {/* Item 2: Pizza */}
              <div className="bg-white p-3 rounded-xl shadow-sm flex gap-4 border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=60" 
                    className="w-24 h-24 rounded-lg object-cover bg-slate-100 shrink-0" 
                    alt="Pizza"
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                          <h4 className="font-bold text-slate-800 text-base">Pizza Hải Sản (M)</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">Tôm, mực tươi, ớt chuông và sốt Marinara đặc biệt.</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                          <span className="font-black text-orange-600 text-lg">129.000đ</span>
                          <button className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors shadow-sm">
                              <Plus size={18} />
                          </button>
                      </div>
                  </div>
              </div>

              {/* Item 3: Gà Rán */}
              <div className="bg-white p-3 rounded-xl shadow-sm flex gap-4 border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=60" 
                    className="w-24 h-24 rounded-lg object-cover bg-slate-100 shrink-0" 
                    alt="Chicken"
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                          <h4 className="font-bold text-slate-800 text-base">Gà Giòn Sốt Cay</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">Da giòn rụm, thịt mềm, phủ sốt cay Hàn Quốc.</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                          <span className="font-black text-orange-600 text-lg">45.000đ</span>
                          <button className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors shadow-sm">
                              <Plus size={18} />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Home;