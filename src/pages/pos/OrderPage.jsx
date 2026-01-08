import React from 'react';
import { 
  Search, UserPlus, Trash2, Plus, Minus, Filter, 
  Star, ShoppingBag, LayoutGrid, Printer, Split, 
  Save, MoreHorizontal, CreditCard, ChevronDown 
} from 'lucide-react';

// --- MOCK DATA ---
const MENU_ITEMS = [
  { id: 1, name: 'Combo 1 Người', price: 79000, img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=150&q=80', isCombo: true },
  { id: 2, name: 'Gà Rán Giòn (2 miếng)', price: 36000, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Burger Bò Phô Mai', price: 45000, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'Khoai Tây Chiên (L)', price: 25000, img: 'https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?auto=format&fit=crop&w=150&q=80' },
  { id: 5, name: 'Gà Viên (10pcs)', price: 42000, img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=150&q=80' },
  { id: 6, name: 'Cánh Gà Sốt Cay', price: 55000, img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=150&q=80', tag: 'SẮP HẾT' },
  { id: 7, name: 'Mì Ý Bò Bằm', price: 39000, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=150&q=80' },
  { id: 8, name: 'Kem Sundae Dâu', price: 15000, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=150&q=80' },
  { id: 9, name: 'Nước Cam Ép', price: 25000, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=150&q=80' },
  { id: 10, name: 'Burger 2 Tầng', price: 55000, img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=150&q=80' },
  { id: 11, name: 'Salad Rau Trộn', price: 29000, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80' },
];

const ORDER_ITEMS = [
  { id: 101, name: 'Combo Gà Rán + Pepsi', note: 'Thêm tương ớt, không đá', price: 89000, qty: 1, img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=100&q=80' },
  { id: 102, name: 'Khoai tây chiên (L)', note: 'Ít muối', price: 35000, qty: 2, img: 'https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?auto=format&fit=crop&w=100&q=80' },
  { id: 103, name: 'Coca Cola', note: 'Không đá', price: 15000, qty: 1, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80' },
];

const CATEGORIES = ['Tất cả', 'Combo Hot', 'Gà Rán', 'Burger & Cơm', 'Thức Uống', 'Tráng Miệng', 'Sốt chấm'];

const OrderPage = () => {
  return (
    <div className="flex h-screen w-screen bg-slate-50 font-display text-slate-900 overflow-hidden select-none">
      
      {/* --- LEFT SIDEBAR: CART (30%) --- */}
      <aside className="w-[30%] min-w-[350px] h-full flex flex-col border-r border-slate-200 bg-white shadow-xl z-20">
        
        {/* Header: Customer & Order Info */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm outline-none transition-all" 
              placeholder="Tìm khách hàng (F4)" 
              defaultValue="Khách lẻ"
            />
            <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-700 transition-colors">
              <UserPlus size={20} />
            </button>
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select className="block w-full p-3 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none shadow-sm font-medium outline-none cursor-pointer">
                <option value="dine-in">Tại bàn</option>
                <option value="takeaway">Mang về</option>
                <option value="delivery">Giao hàng</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="w-1/3">
              <input 
                type="text" 
                className="block w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-center shadow-sm font-medium outline-none" 
                placeholder="Số bàn" 
                defaultValue="05"
              />
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50 custom-scrollbar">
          {ORDER_ITEMS.map((item) => (
            <div key={item.id} className="flex gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
              <div className="h-16 w-16 bg-cover bg-center rounded-md shrink-0 border border-slate-100" style={{backgroundImage: `url(${item.img})`}}></div>
              <div className="flex flex-col flex-1 justify-between py-0.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm leading-tight text-slate-900 line-clamp-2">{item.name}</h4>
                  <button className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 -mt-2 -mr-2">
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{item.note}</p>
                <div className="flex justify-between items-end mt-1">
                  <p className="text-blue-600 font-bold text-sm">{item.price.toLocaleString()}đ</p>
                  <div className="flex items-center bg-slate-100 rounded-md overflow-hidden h-6 border border-slate-200">
                    <button className="w-6 h-full flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors">
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <input className="w-8 h-full bg-transparent border-none text-center text-xs font-bold p-0 focus:ring-0 cursor-default text-slate-900 outline-none" readOnly value={item.qty} />
                    <button className="w-6 h-full flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors">
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Totals & Actions */}
        <div className="bg-white border-t border-slate-200 p-4 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Tạm tính</span>
              <span className="font-medium text-slate-900">174.000đ</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Thuế (8%)</span>
              <span className="font-medium text-slate-900">13.920đ</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Giảm giá</span>
              <span>-0đ</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-lg pt-2 border-t border-slate-200 mt-2">
              <span>Tổng cộng</span>
              <span className="text-blue-600">187.920đ</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 h-16">
            <button className="flex flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition-colors text-xs font-medium text-slate-500 shadow-sm">
              <Printer size={20} />
              IN THỬ
            </button>
            <button className="flex flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition-colors text-xs font-medium text-slate-500 shadow-sm">
              <Split size={20} />
              TÁCH BILL
            </button>
            <button className="flex flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition-colors text-xs font-medium text-slate-500 shadow-sm">
              <Save size={20} />
              LƯU TẠM
            </button>
            <button className="col-span-1 flex flex-col items-center justify-center gap-1 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition-colors text-xs font-medium text-slate-500 shadow-sm">
              <MoreHorizontal size={20} />
              KHÁC
            </button>
          </div>
          
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-3.5 rounded-lg shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <span>THANH TOÁN</span>
            <CreditCard size={24} />
          </button>
        </div>
      </aside>

      {/* --- RIGHT CONTENT: MENU (70%) --- */}
      <main className="w-[70%] h-full flex flex-col bg-slate-50 relative">
        
        {/* Header: Search & Filters */}
        <header className="p-4 bg-white z-10 sticky top-0 border-b border-slate-200 gap-4 flex flex-col shadow-sm">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search size={20} />
              </span>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none transition-all" 
                placeholder="Tìm kiếm món ăn (F3)..." 
              />
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-600 transition-all flex items-center gap-2 shadow-sm">
              <Filter size={18} className="text-blue-600" />
              <span className="font-medium">Lọc</span>
            </button>
          </div>
          
          {/* Category Chips */}
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar select-none">
            {CATEGORIES.map((cat, idx) => (
              <button 
                key={idx}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors shadow-sm ${
                  idx === 0 
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-100' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
          <div className="mb-8">
            <h3 className="text-slate-900 font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              MÓN THƯỜNG BÁN
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {MENU_ITEMS.slice(0, 4).map((item) => (
                <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-600 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 h-full flex flex-col">
                  {item.isCombo && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">COMBO</div>
                  )}
                  <div className="aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: `url(${item.img})`}}></div>
                  <div className="p-3 flex flex-col flex-1">
                    <h4 className="font-medium text-slate-900 mb-1 truncate" title={item.name}>{item.name}</h4>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-blue-600 font-bold text-lg">{item.price.toLocaleString()}đ</span>
                      <button className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-100">
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-4 flex items-center gap-2">
              <LayoutGrid size={20} className="text-slate-500" />
              THỰC ĐƠN
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {MENU_ITEMS.slice(4).map((item) => (
                <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-600 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 h-full flex flex-col">
                  {item.tag && (
                    <div className="absolute inset-0 bg-white/60 pointer-events-none z-10 flex items-center justify-center opacity-100">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg transform -rotate-12 border border-white/20">{item.tag}</span>
                    </div>
                  )}
                  <div className={`aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-500 ${item.tag ? 'grayscale-[30%]' : ''}`} style={{backgroundImage: `url(${item.img})`}}></div>
                  <div className="p-3 flex flex-col flex-1">
                    <h4 className="font-medium text-slate-900 mb-1 truncate">{item.name}</h4>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-blue-600 font-bold text-lg">{item.price.toLocaleString()}đ</span>
                      <button className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-100">
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default OrderPage;