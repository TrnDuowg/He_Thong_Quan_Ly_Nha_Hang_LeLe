import React, { useEffect, useState } from 'react';
import { 
  ShoppingCart, PlusCircle, ShoppingBag, Truck, 
  MapPin, Clock, Search, Receipt, UserPlus, 
  Settings, AlertTriangle, Printer, LayoutGrid, 
  Armchair, BarChart3, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OpenShiftModal from './OpenShiftModal';

const POSDashboard = () => {
  const handleConfirmOrder = async (orderId) => {
      try {
          const res = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'processing' }) // Chuyển sang đang nấu
          });

          if (res.ok) {
              // Cập nhật lại giao diện: Xóa đơn vừa duyệt khỏi list
              setStats(prev => ({
                  ...prev,
                  pendingCount: prev.pendingCount - 1,
                  recentOrders: prev.recentOrders.filter(o => o.id !== orderId)
              }));
              // Phát tiếng kêu hoặc thông báo nhỏ (Optional)
              alert("Đã chuyển đơn xuống bếp!");
          } else {
              alert("Lỗi cập nhật");
          }
      } catch (error) {
          alert("Lỗi kết nối");
      }
  };

  const navigate = useNavigate();
  // Khởi tạo state an toàn
  const [stats, setStats] = useState({
    pendingCount: 0,
    shiftRevenue: 0,
    tables: { empty: 0, occupied: 0 },
    recentOrders: []
  });
  const [showOpenShift, setShowOpenShift] = useState(false);

  // --- GỌI API ---
  useEffect(() => {
    // Kiểm tra ca làm việc
    const shiftId = localStorage.getItem('current_shift_id');
    if (!shiftId) setShowOpenShift(true);

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/pos/dashboard');
        // Chỉ cập nhật nếu API trả về thành công (status 200)
        if (res.ok) {
            const data = await res.json();
            setStats(data);
        } else {
            console.error("Lỗi API POS:", res.status);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

  const getTimeAgo = (dateStr) => {
      if (!dateStr) return '';
      const diff = Math.floor((new Date() - new Date(dateStr)) / 60000);
      return diff < 1 ? 'Vừa xong' : `${diff} phút trước`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shrink-0 h-[72px]">
        <div className="flex items-center gap-4">
          <div className="size-8 text-blue-600 flex items-center justify-center">
            <LayoutGrid size={32} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-800">POS Bán Hàng</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Clock size={16} />
              <span>{new Date().toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <button className="relative flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 text-slate-600 transition-colors">
              <Bell size={24} />
              {(stats?.pendingCount || 0) > 0 && (
                  <span className="absolute top-2 right-2 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                NV
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#f0f2f5]">
        <div className="max-w-[1400px] mx-auto flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
            
            {/* Card 1: Bán Hàng */}
            <div className="group relative col-span-1 md:col-span-2 lg:col-span-1 row-span-1 lg:row-span-2 bg-white rounded-xl border border-blue-100 p-6 flex flex-col justify-between overflow-hidden shadow-sm min-h-[300px]">
              <div className="absolute right-0 top-0 p-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <ShoppingCart className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-800">Bán Hàng</h3>
                </div>
                <p className="text-slate-500 mb-8 font-medium">Tạo đơn hàng mới ngay tại quầy.</p>
              </div>
              <div className="relative z-10 flex flex-col gap-4 mt-auto">
                
                {/* NÚT TẠO ĐƠN MỚI -> Chuyển sang /pos/order */}
                <button 
                    onClick={() => navigate('/pos/order')} 
                    className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle size={28} />
                  TẠO ĐƠN MỚI
                </button>

                <div className="grid grid-cols-2 gap-3">
                  {/* NÚT MANG VỀ -> Chuyển sang /pos/order */}
                  <button 
                    onClick={() => navigate('/pos/order')} 
                    className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 h-12 rounded-lg font-semibold text-sm text-slate-700 transition-colors border border-slate-200 hover:border-blue-300"
                  >
                    <ShoppingBag size={20} /> Mang Về
                  </button>

                  {/* NÚT GIAO HÀNG -> Chuyển sang /pos/delivery */}
                  <button 
                    onClick={() => navigate('/pos/delivery')} 
                    className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 h-12 rounded-lg font-semibold text-sm text-slate-700 transition-colors border border-slate-200 hover:border-blue-300"
                  >
                    <Truck size={20} /> Giao Hàng
                  </button>
                </div>
              </div>
            </div>
            {/* Card 2: Sơ Đồ Bàn */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm h-[280px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Armchair className="text-blue-600" size={24} /> Sơ Đồ Bàn
                </h3>
              </div>
              <div className="flex-1 flex items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-16 rounded-full border-4 border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 bg-slate-50">
                      {stats?.tables?.empty || 0}
                  </div>
                  <span className="text-sm font-medium text-slate-500">Bàn Trống</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="size-16 rounded-full border-4 border-blue-600 flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50">
                      {stats?.tables?.occupied || 0}
                  </div>
                  <span className="text-sm font-medium text-blue-600">Phục Vụ</span>
                </div>
              </div>
              <button onClick={() => navigate('/pos/tables')} className="mt-4 w-full py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center">
                Xem chi tiết sơ đồ →
              </button>
            </div>

            {/* Card 3: Đơn Chờ Xử Lý (DUYỆT ĐƠN TỪ KHÁCH) */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm h-[280px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Clock className="text-orange-500" size={24} /> Đơn Chờ Duyệt
                </h3>
                <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    {stats?.pendingCount || 0}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                {(stats?.recentOrders || []).length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">Không có đơn mới</div>
                ) : stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-orange-400 hover:bg-slate-100 transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-800">{order.order_code}</p>
                            <div className="flex gap-2 text-xs text-slate-500">
                                <span>{getTimeAgo(order.created_at)}</span>
                                <span>•</span>
                                <span className="font-bold text-blue-600">
                                    {order.order_type === 'dine_in' ? 'Tại bàn' : 'Online'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             {/* Nút Hủy (nếu muốn làm thêm) */}
                             <button className="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1.5 rounded">Hủy</button>
                             
                             {/* Nút Duyệt */}
                             <button 
                                onClick={() => handleConfirmOrder(order.id)}
                                className="text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded shadow-sm"
                             >
                                Duyệt &rarr; Bếp
                             </button>
                        </div>
                    </div>
                ))}
              </div>
            </div>
            {/* Card 4: Doanh Thu */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm h-[280px]">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                <BarChart3 className="text-blue-600" size={24} /> Doanh Thu Ca
              </h3>
              <div className="mt-4">
                <p className="text-sm text-slate-500 font-medium">Tổng tiền (Từ 6h sáng)</p>
                <p className="text-3xl font-black text-blue-600 tracking-tight mt-1">
                    {formatCurrency(stats?.shiftRevenue)}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Mục tiêu</p>
                  <p className="text-sm font-bold text-slate-800">5.000.000 ₫</p>
                </div>
              </div>
            </div>

            {/* Card 5: Cảnh Báo */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm h-[280px]">
              <h3 className="font-bold text-lg flex items-center gap-2 text-red-600">
                <AlertTriangle size={24} /> Cảnh Báo
              </h3>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg text-sm border border-red-100">
                  <ShoppingBag className="text-red-500 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold text-red-700">Hết hàng: Pepsi</p>
                    <p className="text-xs text-red-600/80">Kho báo số lượng 0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Tính Năng Nhanh */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm h-[280px]">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-slate-800">
                <LayoutGrid className="text-blue-500" size={24} /> Tính Năng Nhanh
              </h3>
              <div className="grid grid-cols-2 gap-3 flex-1">
                <button onClick={() => navigate('/pos/reports')} className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 rounded-lg p-2 border border-transparent hover:border-blue-200">
                  <Receipt className="text-purple-500" size={28} />
                  <span className="text-xs font-semibold text-slate-700">Kết Ca</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-blue-50 rounded-lg p-2 border border-transparent hover:border-blue-200">
                  <UserPlus className="text-teal-500" size={28} />
                  <span className="text-xs font-semibold text-slate-700">Khách Hàng</span>
                </button>
              </div>
            </div>

          </div>
        </div>
        
        {/* SPACER QUAN TRỌNG: Đẩy nội dung lên trên, không bị thanh menu che */}
        <div className="h-24 w-full"></div>
      </main>

      <OpenShiftModal 
         isOpen={showOpenShift} 
         onClose={() => setShowOpenShift(false)} 
         onOpenSuccess={() => setShowOpenShift(false)}
      />
    </div>
  );
};

export default POSDashboard;