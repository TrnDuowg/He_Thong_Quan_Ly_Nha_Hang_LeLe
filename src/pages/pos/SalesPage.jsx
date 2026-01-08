import React, { useState } from 'react';
import { 
  Search, Grid, List, Plus, Minus, Trash2, User, 
  CreditCard, Banknote, QrCode, Ticket, Printer, 
  ArrowLeft, Check, ChevronDown, Utensils,
  Receipt, Save, MoreHorizontal, Split, UserPlus, Filter, Star, LayoutGrid
} from 'lucide-react';

// ... (Keep existing MOCK DATA: CATEGORIES, PRODUCTS) ...
// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'burger', name: 'Burger', icon: '🍔' },
  { id: 'chicken', name: 'Gà Rán', icon: '🍗' },
  { id: 'drink', name: 'Đồ uống', icon: '🥤' },
  { id: 'snack', name: 'Ăn kèm', icon: '🍟' },
];

const PRODUCTS = [
  { id: 1, name: 'Combo Burger Bò', price: 99000, cat: 'burger', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=200&q=80' },
  { id: 2, name: 'Gà Rán Cay (1 miếng)', price: 35000, cat: 'chicken', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&q=80' },
  { id: 3, name: 'Khoai tây chiên (M)', price: 25000, cat: 'snack', img: 'https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?auto=format&fit=crop&w=200&q=80' },
  { id: 4, name: 'Coca Cola Tươi', price: 15000, cat: 'drink', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 5, name: 'Pizza Hải Sản', price: 220000, cat: 'pizza', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80' },
  { id: 6, name: 'Kem Vani', price: 10000, cat: 'snack', img: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=200&q=80' },
];

const SalesPage = () => {
  const [viewMode, setViewMode] = useState('order'); // 'order' | 'payment'
  const [cart, setCart] = useState([
    { ...PRODUCTS[0], qty: 1, note: 'Size L (+10k)' },
    { ...PRODUCTS[2], qty: 2, note: '' }
  ]);
  const [selectedCat, setSelectedCat] = useState('all');

  // Tính tổng tiền
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // --- ACTIONS ---
  const addToCart = (product) => {
    const exist = cart.find(x => x.id === product.id);
    if (exist) {
      setCart(cart.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      setCart([...cart, { ...product, qty: 1, note: '' }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  // --- SUB-COMPONENT: ORDER VIEW (Chọn món) ---
  const OrderView = () => (
    <div className="flex h-full gap-4">
      {/* LEFT: MENU (70%) */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
        {/* Search & Filter */}
        <div className="p-4 border-b border-border-light flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20}/>
            <input className="w-full bg-background-body pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-primary" placeholder="Tìm món ăn..."/>
          </div>
          <div className="flex gap-2">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat.id}
                 onClick={() => setSelectedCat(cat.id)}
                 className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                   selectedCat === cat.id 
                   ? 'bg-primary text-white shadow-lg shadow-blue-200' 
                   : 'bg-background-body text-text-secondary hover:bg-slate-200'
                 }`}
               >
                 {cat.icon && <span className="mr-1">{cat.icon}</span>} {cat.name}
               </button>
             ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRODUCTS.filter(p => selectedCat === 'all' || p.cat === selectedCat).map(item => (
              <div key={item.id} onClick={() => addToCart(item)} className="bg-white p-3 rounded-2xl border border-transparent hover:border-primary cursor-pointer shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                <div className="aspect-square rounded-xl bg-slate-100 mb-3 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                </div>
                <h4 className="font-bold text-text-main text-sm line-clamp-2 mb-1">{item.name}</h4>
                <div className="mt-auto flex justify-between items-center">
                  <span className="font-bold text-primary">{item.price.toLocaleString()}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Plus size={16}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: CART PREVIEW (30%) */}
      <div className="w-[380px] bg-white rounded-2xl shadow-sm border border-border-light flex flex-col">
        <div className="p-4 border-b border-border-light flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg"><User size={18}/></span>
            <span className="font-bold text-text-main">Khách lẻ</span>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Mang về</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {cart.map((item, idx) => (
            <div key={idx} className="p-3 bg-background-body rounded-xl flex gap-3 group">
              <div className="w-6 flex flex-col items-center justify-center gap-1">
                 <button onClick={() => updateQty(item.id, 1)} className="hover:text-primary"><Plus size={14}/></button>
                 <span className="font-bold text-sm">{item.qty}</span>
                 <button onClick={() => updateQty(item.id, -1)} className="hover:text-red-500"><Minus size={14}/></button>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-bold text-sm text-text-main">{item.name}</span>
                  <span className="font-bold text-sm text-text-main">{(item.price * item.qty).toLocaleString()}</span>
                </div>
                {item.note && <p className="text-xs text-text-secondary mt-0.5">{item.note}</p>}
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-xs bg-white border border-border-light px-2 py-1 rounded hover:text-primary">Ghi chú</button>
                   <button className="text-xs bg-white border border-border-light px-2 py-1 rounded hover:text-primary">Giảm giá</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-light bg-slate-50 rounded-b-2xl">
          <div className="flex justify-between mb-2 text-text-secondary text-sm">
            <span>Tạm tính</span>
            <span>{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4 text-xl font-black text-text-main">
            <span>Tổng tiền</span>
            <span className="text-primary">{totalAmount.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => setViewMode('payment')}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex justify-center items-center gap-2 active:scale-95 transition-all"
          >
            THANH TOÁN <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: PAYMENT VIEW (Giao diện thanh toán image_58ea60.jpg) ---
  const PaymentView = () => (
    <div className="flex h-full gap-4 animate-slide-in-right bg-background-body p-4">
      
      {/* COL 1: ORDER SUMMARY */}
      <section className="w-[30%] min-w-[300px] flex flex-col border-r border-border-light bg-surface-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Receipt size={24} className="text-primary" />
              Đơn hàng #12345
            </h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-blue-200">Mang về</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          <div className="rounded-lg border border-border-light bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-text-secondary sticky top-0 border-b border-border-light">
                <tr>
                  <th className="px-4 py-3 font-semibold w-[50%]">Món</th>
                  <th className="px-2 py-3 font-semibold text-center">SL</th>
                  <th className="px-4 py-3 font-semibold text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-sm">
                {cart.map((item, i) => (
                  <tr key={i} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="font-bold text-text-main">{item.name}</div>
                      {item.note && <div className="text-xs text-text-secondary mt-1 font-medium bg-gray-100 inline-block px-1.5 py-0.5 rounded">{item.note}</div>}
                    </td>
                    <td className="px-2 py-3 text-center font-bold text-text-main">{item.qty}</td>
                    <td className="px-4 py-3 text-right text-primary font-bold">{(item.price * item.qty).toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-auto border-t border-border-light bg-surface-white p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
          <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded-lg border border-border-light">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Tạm tính</span>
              <span className="text-text-main font-medium">{totalAmount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>VAT (8%)</span>
              <span className="text-text-main font-medium">{(totalAmount * 0.08).toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Giảm giá</span>
              <span>-0đ</span>
            </div>
          </div>
          <div className="pt-2 flex items-end justify-between">
            <div>
              <p className="text-text-secondary text-sm font-semibold uppercase mb-1">Tổng thanh toán</p>
              <p className="text-3xl font-extrabold text-primary tracking-tight">{(totalAmount * 1.08).toLocaleString()}đ</p>
            </div>
          </div>
        </div>
      </section>

      {/* COL 2: CUSTOMER & VOUCHER */}
      <section className="w-[25%] border-r border-border-light bg-gray-50/50 flex flex-col p-5 gap-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-border-light">
          <UserPlus size={24} className="text-primary" />
          Khách hàng & Khuyến mãi
        </h2>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-main">Tìm khách hàng (F4)</label>
          <div className="relative group">
            <input className="w-full bg-white border border-border-light rounded-lg py-3 pl-10 pr-4 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm" placeholder="Nhập số điện thoại..." type="text"/>
            <Search className="absolute left-3 top-3 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
          </div>
        </div>
        
        {/* Customer Card Info */}
        <div className="bg-white border border-border-light rounded-lg p-4 relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <User size={64} className="text-primary -mr-4 -mt-4" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-primary font-bold text-lg shadow-sm">
                TV
              </div>
              <div>
                <p className="text-text-main font-bold text-lg">Trần Văn A</p>
                <p className="text-sm text-text-secondary font-medium">0909 123 456</p>
              </div>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-border-light">
              <span className="text-xs text-text-secondary uppercase font-bold tracking-wide">Điểm tích lũy</span>
              <span className="text-primary font-bold text-lg">1,250</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-main">Mã khuyến mãi / Voucher</label>
          <div className="flex gap-2">
            <input className="flex-1 bg-white border border-border-light rounded-lg py-3 px-4 text-text-main placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="Nhập mã..." type="text"/>
            <button className="bg-blue-50 hover:bg-blue-100 text-primary border border-blue-200 rounded-lg px-4 font-semibold transition-colors shadow-sm">
              Áp dụng
            </button>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="bg-white rounded-lg p-4 border border-border-light flex items-center justify-between shadow-sm hover:border-primary/30 transition-colors">
            <div className="flex flex-col">
              <span className="text-text-main font-semibold">Xuất hóa đơn đỏ</span>
              <span className="text-xs text-text-secondary font-medium mt-0.5">Yêu cầu MST & Email</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input className="sr-only peer" type="checkbox" value=""/>
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
            </label>
          </div>
        </div>
      </section>

      {/* COL 3: PAYMENT METHOD (Rightmost) */}
      <section className="flex-1 bg-white flex flex-col p-6 h-full relative z-10 rounded-2xl shadow-sm border border-border-light">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2 mb-6">
          <CreditCard size={24} className="text-primary" />
          Phương thức thanh toán
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="relative h-24 rounded-xl border-2 border-primary bg-blue-50/50 flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-blue-100">
            <div className="absolute top-2 right-2 size-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <Check size={14} className="text-white font-bold" strokeWidth={3} />
            </div>
            <Banknote size={32} className="text-primary" />
            <span className="font-bold text-primary">TIỀN MẶT</span>
          </button>
          <button className="h-24 rounded-xl border border-border-light bg-white hover:bg-gray-50 hover:border-gray-300 flex flex-col items-center justify-center gap-2 transition-all text-text-secondary hover:text-text-main shadow-sm">
            <QrCode size={32} />
            <span className="font-bold">CHUYỂN KHOẢN</span>
          </button>
          <button className="h-24 rounded-xl border border-border-light bg-white hover:bg-gray-50 hover:border-gray-300 flex flex-col items-center justify-center gap-2 transition-all text-text-secondary hover:text-text-main shadow-sm">
            <CreditCard size={32} />
            <span className="font-bold">THẺ</span>
          </button>
          <button className="h-24 rounded-xl border border-border-light bg-white hover:bg-gray-50 hover:border-gray-300 flex flex-col items-center justify-center gap-2 transition-all text-text-secondary hover:text-text-main shadow-sm">
            <Ticket size={32} />
            <span className="font-bold">DÙNG ĐIỂM</span>
          </button>
        </div>

        {/* Numpad / Calculator Area */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-border-light shadow-inner">
          <div className="mb-4">
            <label className="block text-text-secondary text-sm mb-2 font-semibold">Tiền khách đưa</label>
            <div className="relative">
              <input className="w-full bg-white border border-border-light text-text-main text-3xl font-extrabold py-3 pl-4 pr-16 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-right shadow-sm" type="text" defaultValue="500.000"/>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold">VND</span>
            </div>
          </div>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-primary-hover rounded-full text-sm font-bold whitespace-nowrap transition-colors border border-blue-200">Gợi ý: 340k</button>
            <button className="px-4 py-2 bg-white border border-border-light hover:border-primary hover:text-primary text-text-secondary rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm">500k</button>
            <button className="px-4 py-2 bg-white border border-border-light hover:border-primary hover:text-primary text-text-secondary rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm">200k</button>
            <button className="px-4 py-2 bg-white border border-border-light hover:border-primary hover:text-primary text-text-secondary rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm">100k</button>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-text-secondary font-semibold text-lg">Tiền thừa trả khách</span>
            <span className="text-3xl font-extrabold text-primary">{(500000 - totalAmount * 1.08).toLocaleString()}đ</span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-4 pb-16"> 
          <button className="col-span-1 h-14 bg-white border border-border-light hover:bg-gray-50 text-text-main rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
            <Printer size={24} className="text-gray-400" />
            TT KHÔNG IN
          </button>
          <button onClick={() => setViewMode('order')} className="col-span-1 h-14 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
            <ArrowLeft size={24} />
            QUAY LẠI
          </button>
          <button className="col-span-2 h-16 bg-primary hover:bg-primary-hover text-white rounded-xl text-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all transform active:scale-[0.99]">
            <Printer size={28} />
            THANH TOÁN & IN (ENTER)
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="h-full p-4 overflow-hidden bg-slate-100">
      {viewMode === 'order' ? <OrderView /> : <PaymentView />}
    </div>
  );
};

export default SalesPage;