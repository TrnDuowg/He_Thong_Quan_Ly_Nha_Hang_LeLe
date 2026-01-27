import React, { useEffect, useState } from 'react';
import { Search, QrCode, ShoppingBag, Truck, Calendar, Plus, MapPin } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  // Lấy context từ Layout để cập nhật số lượng giỏ hàng trên Header
  const [orderState, setOrderState] = useOutletContext();
  
  // State lưu dữ liệu từ Backend
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. GỌI API LẤY MÓN ĂN (Để hiển thị phần "Món ngon phải thử")
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Lọc active trước, sau đó mới cắt lấy 3 món đầu
          const activeOnes = data.filter(p => p.is_active === 1);
          setFeaturedProducts(activeOnes.slice(0, 3));
        }
      } catch (error) {
        console.error("Lỗi tải món ăn:", error);
      }
    };
    fetchProducts();
  }, []);

  // 2. XỬ LÝ CHỌN HÌNH THỨC (Dine in, Takeaway...)
   const handleSelectMode = (mode) => {
        // Lưu mode vào Context
        setOrderState(prev => ({ ...prev, mode: mode }));

        // 1. Nếu là Giao hàng hoặc Đặt bàn -> CẦN ĐĂNG NHẬP
        if (mode === 'delivery' || mode === 'reservation') {
            const customer = localStorage.getItem('customer_info');
            
            if (!customer) {
                // Nếu chưa đăng nhập -> Chuyển sang trang Login
                // Mang theo 'mode' để sau khi login xong tự chuyển tiếp
                navigate('/customer/login', { state: { mode: mode } });
                return;
            }
        }

        // 2. Nếu là Tại quán hoặc Mang về (hoặc đã login xong) -> Đi tiếp
        if (mode === 'reservation') {
            navigate('/reservation');
        } else {
            navigate('/menu');
        }
    };

  // 3. XỬ LÝ THÊM VÀO GIỎ (Nút +)
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Chặn sự kiện click vào thẻ cha
    
    const currentCart = JSON.parse(localStorage.getItem('customer_cart')) || [];
    const existItem = currentCart.find(i => i.id === product.id);
    
    let newCart;
    if (existItem) {
        newCart = currentCart.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i);
    } else {
        newCart = [...currentCart, { ...product, qty: 1 }];
    }
    
    localStorage.setItem('customer_cart', JSON.stringify(newCart));
    
    // Cập nhật số lượng trên Header (thông qua Context)
    const count = newCart.reduce((sum, item) => sum + item.qty, 0);
    setOrderState(prev => ({ ...prev, cartCount: count }));

    // Rung phản hồi (nếu là mobile)
    if (navigator.vibrate) navigator.vibrate(50);
    alert(`Đã thêm ${product.name} vào giỏ!`);
  };

  // 4. XỬ LÝ TÌM KIẾM
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
        // Chuyển sang trang menu và mang theo từ khóa
        // (Lưu ý: Trang Menu cần thêm logic đọc URL param hoặc state để lọc)
        navigate('/menu'); 
        // Tạm thời mình navigate thẳng, nâng cao thì truyền state: navigate('/menu', { state: { search: searchTerm }})
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 bg-white min-h-full">
      
      {/* 1. Tìm kiếm */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input 
            type="text" 
            placeholder="Bạn muốn ăn gì hôm nay?" 
            className="w-full bg-white py-3 pl-10 pr-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
        />
      </div>

      {/* 2. Banner Khuyến mãi */}
      <div 
        className="relative h-44 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
        onClick={() => navigate('/menu')}
      >
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
          <h3 className="font-bold text-slate-600 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
            <MapPin size={14} /> Bạn muốn dùng bữa thế nào?
          </h3>
          <div className="grid grid-cols-2 gap-3">
              {/* Ăn tại quán */}
              <button onClick={() => handleSelectMode('dine_in')} className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center gap-2 hover:border-orange-200 active:bg-orange-50 active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <QrCode size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-slate-800 text-sm block">Ăn tại quán</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Thưởng thức nhanh</span>
                  </div>
              </button>

              {/* Mang về */}
              <button onClick={() => handleSelectMode('takeaway')} className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center gap-2 hover:border-blue-200 active:bg-blue-50 active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ShoppingBag size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-slate-800 text-sm block">Mang về</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Đến lấy không chờ</span>
                  </div>
              </button>

              {/* Giao hàng */}
              <button onClick={() => handleSelectMode('delivery')} className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center gap-2 hover:border-green-200 active:bg-green-50 active:scale-95 transition-all group">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Truck size={24} />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-slate-800 text-sm block">Giao tận nơi</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Giao nhanh 30p</span>
                  </div>
              </button>

              {/* Đặt bàn */}
              <button onClick={() => handleSelectMode('reservation')} className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center gap-2 hover:border-purple-200 active:bg-purple-50 active:scale-95 transition-all group">
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

      {/* 4. Món bán chạy (Dữ liệu từ API) */}
      <div>
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wide">Món ngon phải thử 🔥</h3>
            <span onClick={() => navigate('/menu')} className="text-xs text-orange-600 font-bold cursor-pointer hover:underline">Xem tất cả</span>
          </div>
          
          <div className="space-y-3">
              {featuredProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Đang tải món ngon...</p>
              ) : (
                  featuredProducts.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => navigate('/menu')} // Bấm vào thẻ thì vào menu
                        className="bg-white p-3 rounded-xl shadow-sm flex gap-4 border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
                    >
                        <img 
                            src={item.image_url} 
                            onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                            className="w-24 h-24 rounded-lg object-cover bg-slate-100 shrink-0" 
                            alt={item.name}
                        />
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h4 className="font-bold text-slate-800 text-base">{item.name}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.category_name}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="font-black text-orange-600 text-lg">{Number(item.price).toLocaleString()}đ</span>
                                
                                {/* Nút thêm nhanh */}
                                <button 
                                    onClick={(e) => handleAddToCart(e, item)}
                                    className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors shadow-sm"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
};

export default Home;