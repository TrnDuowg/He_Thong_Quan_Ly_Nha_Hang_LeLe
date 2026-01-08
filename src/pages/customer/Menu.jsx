import React, { useState } from 'react';
import { Plus, Minus, X, Star } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// Dữ liệu sản phẩm mẫu với ảnh thật từ Unsplash
const PRODUCTS = [
  { id: 1, name: 'Burger Bò Phô Mai', price: 65000, rating: 4.8, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60' },
  { id: 2, name: 'Gà Rán Sốt Cay', price: 45000, rating: 4.5, img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=60' },
  { id: 3, name: 'Pizza Hải Sản (M)', price: 129000, rating: 4.7, img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=60' },
  { id: 4, name: 'Khoai Tây Chiên', price: 35000, rating: 4.6, img: 'https://i-giadinh.vnecdn.net/2025/04/27/Khoai-tay-chien-6-vnexpress-17-2858-1514-1745744819.jpg' },
  { id: 5, name: 'Combo Gia Đình', price: 159000, rating: 4.9, img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=60' },
  { id: 6, name: 'Coca Cola Tươi', price: 25000, rating: 4.8, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60' },
];

const Menu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderState] = useOutletContext(); // Lấy context để biết đang ở mode nào

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Category Tabs */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 shadow-sm border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
         {['Tất cả', '🍔 Combo', '🍗 Gà Rán', '🥤 Đồ uống', '🍟 Ăn kèm'].map((cat, i) => (
             <button key={i} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${i===0 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                 {cat}
             </button>
         ))}
      </div>

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-4 pb-20">
         {PRODUCTS.map(product => (
             <div key={product.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col active:scale-[0.98] transition-transform" onClick={() => openModal(product)}>
                 <div className="relative mb-2">
                    {/* Ảnh sản phẩm thật */}
                    <img src={product.img} className="w-full h-32 rounded-lg object-cover bg-slate-200" alt={product.name} />
                    <div className="absolute bottom-2 right-2 bg-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" /> {product.rating}
                    </div>
                 </div>
                 <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{product.name}</h4>
                 <div className="mt-auto pt-2 flex justify-between items-center">
                     <span className="font-bold text-orange-600">{product.price.toLocaleString()}đ</span>
                     <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                         <Plus size={16} />
                     </div>
                 </div>
             </div>
         ))}
      </div>

      {/* --- POPUP CHỌN MÓN (BOTTOM SHEET) --- */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-t-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-slide-up">
                
                {/* Header ảnh lớn */}
                <div className="h-56 bg-slate-200 relative shrink-0">
                    <img src={selectedItem.img} className="w-full h-full object-cover" alt={selectedItem.name} />
                    {/* Nút đóng trong suốt */}
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/50 transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                {/* Nội dung cuộn */}
                <div className="p-6 overflow-y-auto flex-1 bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-black text-slate-800 leading-tight w-[70%]">{selectedItem.name}</h2>
                        <span className="text-xl font-bold text-orange-600">{selectedItem.price.toLocaleString()}đ</span>
                    </div>

                    <div className="space-y-6">
                        {/* Size */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Chọn Size (Bắt buộc)
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-colors cursor-pointer">
                                    <span className="text-sm font-bold text-slate-700">Vừa (M)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-medium">+0đ</span>
                                        <input type="radio" name="size" className="w-5 h-5 accent-orange-600" defaultChecked />
                                    </div>
                                </label>
                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-colors cursor-pointer">
                                    <span className="text-sm font-bold text-slate-700">Lớn (L)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-orange-600 font-bold">+15.000đ</span>
                                        <input type="radio" name="size" className="w-5 h-5 accent-orange-600" />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Topping */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Topping Thêm
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-colors cursor-pointer">
                                    <span className="text-sm font-medium text-slate-700">Thêm Phô mai</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium">+8.000đ</span>
                                        <input type="checkbox" className="w-5 h-5 accent-orange-600 rounded" />
                                    </div>
                                </label>
                                <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-colors cursor-pointer">
                                    <span className="text-sm font-medium text-slate-700">Thêm Thịt xông khói</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium">+12.000đ</span>
                                        <input type="checkbox" className="w-5 h-5 accent-orange-600 rounded" />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ghi chú cho bếp</h3>
                            <textarea placeholder="VD: Không hành, ít cay..." className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all" rows="2"></textarea>
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
                    <button onClick={() => setIsModalOpen(false)} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-orange-200 active:scale-[0.98] transition-transform flex justify-between px-6 items-center">
                        <span>Thêm vào giỏ hàng</span>
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