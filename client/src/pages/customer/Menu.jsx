import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, X, Star, Search } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const Menu = () => {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Tất cả']);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);
  
  // State cho Modal chọn món
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState(''); // Ghi chú món ăn

  // Lấy context từ Layout để cập nhật Header
  const [orderState, setOrderState] = useOutletContext(); 

  // --- 1. GỌI API LẤY MÓN ĂN ---
  // --- 1. GỌI API LẤY MÓN ĂN ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // [QUAN TRỌNG] Chỉ lấy sản phẩm đang hoạt động (is_active = 1)
          const activeProducts = data.filter(p => p.is_active === 1);
          
          setProducts(activeProducts);
          
          // Tách danh mục từ danh sách ĐÃ LỌC
          const uniqueCats = ['Tất cả', ...new Set(activeProducts.map(p => p.category_name))];
          setCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Lỗi tải menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- 2. LOGIC MỞ MODAL ---
  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setNote('');
    setIsModalOpen(true);
  };

  // --- 3. LOGIC THÊM VÀO GIỎ HÀNG ---
  const handleAddToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('customer_cart')) || [];
    
    // Kiểm tra xem món này đã có trong giỏ chưa (Check cả ID và Note giống nhau mới gộp)
    const existIndex = currentCart.findIndex(
        i => i.id === selectedItem.id && i.note === note
    );
    
    let newCart;
    if (existIndex > -1) {
        // Nếu trùng món + trùng note -> Tăng số lượng
        newCart = [...currentCart];
        newCart[existIndex].qty += quantity;
    } else {
        // Nếu món mới -> Thêm vào
        newCart = [...currentCart, { ...selectedItem, qty: quantity, note: note }];
    }
    
    // Lưu và cập nhật Context
    localStorage.setItem('customer_cart', JSON.stringify(newCart));
    const totalQty = newCart.reduce((sum, item) => sum + item.qty, 0);
    setOrderState(prev => ({ ...prev, cartCount: totalQty }));

    // Đóng modal & Rung phản hồi
    setIsModalOpen(false);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  // --- 4. LỌC SẢN PHẨM THEO DANH MỤC ---
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Tất cả') return products;
    return products.filter(p => p.category_name === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Category Tabs (Sticky) */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 shadow-sm border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
         {categories.map((cat, i) => (
             <button 
                key={i} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                    selectedCategory === cat 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
             >
                 {cat}
             </button>
         ))}
      </div>

      {/* Product Grid */}
      <div className="p-4 pb-24">
         {loading ? (
             <div className="text-center text-slate-400 mt-10">Đang tải thực đơn...</div>
         ) : filteredProducts.length === 0 ? (
             <div className="text-center text-slate-400 mt-10">Không có món ăn nào</div>
         ) : (
            <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                    <div 
                        key={product.id} 
                        className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col active:scale-[0.98] transition-transform cursor-pointer group" 
                        onClick={() => openModal(product)}
                    >
                        <div className="relative mb-2 overflow-hidden rounded-lg">
                            <img 
                                src={product.image_url} 
                                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                className="w-full h-32 object-cover bg-slate-200 group-hover:scale-105 transition-transform duration-500" 
                                alt={product.name} 
                            />
                            {/* Giả lập rating ngẫu nhiên cho đẹp */}
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" /> 4.{Math.floor(Math.random() * 5) + 5}
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 h-10 leading-tight">{product.name}</h4>
                        <div className="mt-auto pt-2 flex justify-between items-center">
                            <span className="font-bold text-orange-600">{Number(product.price).toLocaleString()}đ</span>
                            <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Plus size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         )}
      </div>

      {/* --- POPUP CHỌN MÓN (BOTTOM SHEET) --- */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-t-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
                
                {/* Header ảnh lớn */}
                <div className="h-56 bg-slate-200 relative shrink-0">
                    <img 
                        src={selectedItem.image_url} 
                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                        className="w-full h-full object-cover" 
                        alt={selectedItem.name} 
                    />
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/50 transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                {/* Nội dung cuộn */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-black text-slate-800 leading-tight w-[70%]">{selectedItem.name}</h2>
                        <span className="text-xl font-bold text-orange-600">{Number(selectedItem.price).toLocaleString()}đ</span>
                    </div>

                    <div className="space-y-6">
                        {/* Size (Giả lập UI - Backend chưa hỗ trợ lưu size, nhưng để cho đẹp) */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Tùy chọn (Demo)
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-colors cursor-pointer">
                                    <span className="text-sm font-bold text-slate-700">Mặc định</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-medium">+0đ</span>
                                        <input type="radio" name="size" className="w-5 h-5 accent-orange-600" defaultChecked />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Note (Hoạt động thật) */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Ghi chú
                            </h3>
                            <textarea 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="VD: Không hành, ít cay, nhiều tương..." 
                                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all" 
                                rows="2"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 bg-white shrink-0 pb-8 sm:pb-4 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-slate-600 text-sm">Số lượng</span>
                        <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="w-9 h-9 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-700 active:scale-90 transition-transform"><Minus size={18}/></button>
                            <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity+1)} className="w-9 h-9 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-700 active:scale-90 transition-transform"><Plus size={18}/></button>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-orange-200 active:scale-[0.98] transition-transform flex justify-between px-6 items-center"
                    >
                        <span>Thêm vào giỏ</span>
                        <span>{(selectedItem.price * quantity).toLocaleString()}đ</span>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Menu;