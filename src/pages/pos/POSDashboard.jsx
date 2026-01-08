import React from 'react';
import { 
  ShoppingCart, PlusCircle, ShoppingBag, Truck, 
  MapPin, Clock, Search, Receipt, UserPlus, 
  Settings, AlertTriangle, Printer, LayoutGrid, 
  Armchair, BarChart3, Bell
} from 'lucide-react';

const POSDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-background-light font-display text-slate-900 overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shrink-0 h-[72px]">
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary flex items-center justify-center">
            <LayoutGrid size={32} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-800">POS Bán Hàng</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <UserPlus size={16} />
              <span className="truncate max-w-[150px]">Nguyễn Văn A</span>
            </div>
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Clock size={16} />
              <span>Ca 1 (Sáng)</span>
            </div>
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="font-bold text-base">₫</span>
              <span>Đầu ca: 2.000.000đ</span>
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-base font-bold tabular-nums text-slate-800">10:45 AM</div>
              <div className="text-xs text-gray-500">24/10/2023</div>
            </div>
            <button className="relative flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 text-slate-600 transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/20" 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")' }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#f0f2f5]">
        <div className="max-w-[1400px] mx-auto h-full flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
            
            {/* Card 1: Bán Hàng (Large Card) */}
            <div className="group relative col-span-1 md:col-span-2 lg:col-span-1 row-span-1 lg:row-span-2 bg-white rounded-xl border border-blue-100 p-6 flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 p-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ShoppingCart className="text-primary" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-800">Bán Hàng</h3>
                </div>
                <p className="text-slate-500 mb-8 font-medium">Tạo đơn hàng mới ngay tại quầy cho khách hàng.</p>
              </div>
              <div className="relative z-10 flex flex-col gap-4 mt-auto">
                <button className="flex items-center justify-center gap-3 w-full bg-primary hover:bg-primary-hover text-white h-16 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <PlusCircle size={28} />
                  TẠO ĐƠN MỚI
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 h-12 rounded-lg font-semibold text-sm text-slate-700 transition-colors border border-slate-200 hover:border-blue-300">
                    <ShoppingBag size={20} />
                    Mang Về
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 h-12 rounded-lg font-semibold text-sm text-slate-700 transition-colors border border-slate-200 hover:border-blue-300">
                    <Truck size={20} />
                    Giao Hàng
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Sơ Đồ Bàn */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Armchair className="text-primary" size={24} />
                  Sơ Đồ Bàn
                </h3>
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">Tầng 1</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-16 rounded-full border-4 border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 bg-slate-50">12</div>
                  <span className="text-sm font-medium text-slate-500">Bàn Trống</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-16 rounded-full border-4 border-primary flex items-center justify-center text-2xl font-bold text-primary bg-blue-50">5</div>
                  <span className="text-sm font-medium text-primary">Phục Vụ</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2 text-sm font-semibold text-primary hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                Xem chi tiết sơ đồ →
              </button>
            </div>

            {/* Card 3: Đơn Chờ Xử Lý */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Clock className="text-orange-500" size={24} />
                  Đơn Chờ Xử Lý
                </h3>
                <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">3</span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 scrollbar-hide">
                {/* Mock Item 1 */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-orange-400 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Đơn #1023</p>
                    <p className="text-xs text-slate-500">05 phút trước</p>
                  </div>
                  <button className="text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded transition-colors">Xử lý</button>
                </div>
                {/* Mock Item 2 */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-blue-400 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Đơn #1024</p>
                    <p className="text-xs text-slate-500">12 phút trước</p>
                  </div>
                  <button className="text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded transition-colors">Bếp</button>
                </div>
                {/* Mock Item 3 */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-purple-400 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Đơn #1021</p>
                    <p className="text-xs text-slate-500">Giao hàng</p>
                  </div>
                  <button className="text-xs font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded transition-colors">Giao</button>
                </div>
              </div>
            </div>

            {/* Card 4: Doanh Thu Ca */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <BarChart3 className="text-primary" size={24} />
                  Doanh Thu Ca
                </h3>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500 font-medium">Tổng tiền mặt + Thẻ</p>
                <p className="text-4xl font-black text-primary tracking-tight mt-1">5.450.000<span className="text-xl align-top text-slate-400 ml-1">đ</span></p>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex-1 min-w-[80px] bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Tiền mặt</p>
                  <p className="text-sm font-bold text-slate-800">3.2M</p>
                </div>
                <div className="flex-1 min-w-[80px] bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Thẻ/QR</p>
                  <p className="text-sm font-bold text-slate-800">2.25M</p>
                </div>
              </div>
            </div>

            {/* Card 5: Cảnh Báo */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-red-600">
                  <AlertTriangle size={24} />
                  Cảnh Báo
                </h3>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg text-sm border border-red-100">
                  <ShoppingBag className="text-red-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold text-red-700">Hết hàng: Pepsi</p>
                    <p className="text-xs text-red-600/80">Kho báo số lượng 0</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg text-sm border border-yellow-100">
                  <Printer className="text-yellow-600 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold text-yellow-700">Máy in bếp</p>
                    <p className="text-xs text-yellow-600/80">Giấy sắp hết</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Tính Năng Nhanh */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-slate-800">
                <LayoutGrid className="text-blue-500" size={24} />
                Tính Năng Nhanh
              </h3>
              <div className="grid grid-cols-2 gap-3 flex-1">
                <button className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 rounded-lg p-2 transition-colors border border-transparent hover:border-blue-200 group">
                  <Search className="text-blue-500 group-hover:scale-110 transition-transform" size={28} />
                  <span className="text-xs font-semibold text-slate-700">Tìm Đơn Cũ</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 rounded-lg p-2 transition-colors border border-transparent hover:border-blue-200 group">
                  <Receipt className="text-purple-500 group-hover:scale-110 transition-transform" size={28} />
                  <span className="text-xs font-semibold text-slate-700">In Lại Bill</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 rounded-lg p-2 transition-colors border border-transparent hover:border-blue-200 group">
                  <UserPlus className="text-teal-500 group-hover:scale-110 transition-transform" size={28} />
                  <span className="text-xs font-semibold text-slate-700">Khách Hàng</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 rounded-lg p-2 transition-colors border border-transparent hover:border-blue-200 group">
                  <Settings className="text-gray-400 group-hover:scale-110 transition-transform" size={28} />
                  <span className="text-xs font-semibold text-slate-700">Cấu Hình</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer / Mobile Nav (Optional, based on your previous layouts) */}
      <footer className="bg-white border-t border-gray-200 py-2 px-4 shrink-0 z-50 md:hidden">
        {/* Mobile Navigation items would go here if needed */}
      </footer>
    </div>
  );
};

export default POSDashboard;