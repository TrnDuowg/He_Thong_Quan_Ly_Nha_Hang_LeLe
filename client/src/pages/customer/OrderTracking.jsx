import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Clock, CheckCircle, ChefHat, ArrowLeft, Package, ChevronRight, XCircle } from 'lucide-react';

const OrderTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [orderList, setOrderList] = useState([]); // Danh sách đơn hàng
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đang xem chi tiết
  const [loading, setLoading] = useState(false);
  
  // State cho khách vãng lai (tìm theo mã)
  const [inputCode, setInputCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- KHỞI TẠO ---
  useEffect(() => {
    // 1. Kiểm tra xem có mã đơn trên URL không (từ trang thanh toán chuyển sang)
    const urlCode = searchParams.get('code');
    if (urlCode) {
        fetchOrderByCode(urlCode);
        return;
    }

    // 2. Kiểm tra xem khách đã đăng nhập chưa
    const customer = JSON.parse(localStorage.getItem('customer_info'));
    if (customer && customer.id) {
        setIsLoggedIn(true);
        fetchOrderHistory(customer.id);
    }
  }, []);

  // --- API: LẤY DANH SÁCH LỊCH SỬ ---
  const fetchOrderHistory = async (customerId) => {
      setLoading(true);
      try {
          const res = await fetch(`http://localhost:3000/api/orders/customer/${customerId}`);
          const data = await res.json();
          if (Array.isArray(data)) {
              setOrderList(data);
          }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
  };

  // --- API: LẤY CHI TIẾT 1 ĐƠN (Theo mã) ---
  const fetchOrderByCode = async (code) => {
      setLoading(true);
      try {
          const res = await fetch(`http://localhost:3000/api/orders/track/${code}`);
          const data = await res.json();
          if (res.ok) {
              setSelectedOrder(data);
          } else {
              alert("Không tìm thấy đơn hàng!");
          }
      } catch (e) { alert("Lỗi kết nối"); }
      finally { setLoading(false); }
  };

  // --- HELPER: MÀU SẮC TRẠNG THÁI ---
  const getStatusInfo = (status) => {
    switch (status) {
        case 'pending': return { text: 'Chờ xác nhận', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
        case 'processing': return { text: 'Đang chuẩn bị', color: 'text-blue-600', bg: 'bg-blue-100', icon: ChefHat };
        case 'delivering': return { text: 'Đang giao hàng', color: 'text-purple-600', bg: 'bg-purple-100', icon: Package };
        case 'completed': return { text: 'Hoàn thành', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
        case 'cancelled': return { text: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle };
        default: return { text: status, color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock };
    }
  };

  // --- GIAO DIỆN CHI TIẾT ĐƠN HÀNG ---
  if (selectedOrder) {
      const StatusIcon = getStatusInfo(selectedOrder.status).icon;
      return (
        <div className="min-h-screen bg-gray-50 p-4">
            {/* Header chi tiết */}
            <div className="flex items-center gap-3 mb-6 sticky top-0 bg-gray-50 z-10 py-2">
                <button 
                    onClick={() => {
                        setSelectedOrder(null); 
                        setSearchParams({}); // Xóa mã trên URL
                    }} 
                    className="p-2 bg-white rounded-full shadow-sm text-gray-600"
                >
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-lg font-bold">Chi tiết đơn hàng</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 animate-fade-in-up">
                <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${getStatusInfo(selectedOrder.status).bg} ${getStatusInfo(selectedOrder.status).color}`}>
                        <StatusIcon size={32} />
                    </div>
                    <h2 className={`text-xl font-bold ${getStatusInfo(selectedOrder.status).color}`}>
                        {getStatusInfo(selectedOrder.status).text}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">{new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Mã đơn:</span>
                        <span className="font-mono font-bold">{selectedOrder.order_code}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Tổng tiền:</span>
                        <span className="font-bold text-xl text-orange-600">{Number(selectedOrder.final_amount).toLocaleString()}đ</span>
                    </div>
                    <div>
                        <span className="text-gray-500 block mb-2 text-sm">Món đã đặt:</span>
                        <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-800 font-medium leading-relaxed border border-gray-100">
                            {selectedOrder.items_summary}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- GIAO DIỆN DANH SÁCH ĐƠN HÀNG ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20">
          <h1 className="text-xl font-bold text-center">Đơn Hàng Của Tôi</h1>
      </div>

      <div className="flex-1 p-4 pb-20">
        
        {/* Nếu chưa đăng nhập: Hiện ô tìm kiếm */}
        {!isLoggedIn && (
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 text-center">
                <Package size={48} className="mx-auto text-blue-200 mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">Bạn chưa đăng nhập?</h3>
                <p className="text-sm text-gray-500 mb-4">Nhập mã đơn hàng để tra cứu hoặc đăng nhập để xem lịch sử.</p>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        value={inputCode}
                        onChange={e => setInputCode(e.target.value)}
                        placeholder="Mã đơn (VD: ORD-170...)"
                        className="flex-1 border p-2 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                    <button onClick={() => fetchOrderByCode(inputCode)} className="bg-blue-600 text-white px-4 rounded-lg">
                        <Search size={18} />
                    </button>
                </div>
                
                <button onClick={() => navigate('/customer/login')} className="text-blue-600 text-sm font-bold hover:underline">
                    Đăng nhập ngay
                </button>
            </div>
        )}

        {/* Danh sách đơn hàng */}
        {loading ? (
            <div className="text-center py-10 text-gray-400">Đang tải...</div>
        ) : orderList.length === 0 && isLoggedIn ? (
            <div className="text-center py-20">
                <Package size={64} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                <button onClick={() => navigate('/menu')} className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-md">
                    Đặt món ngay
                </button>
            </div>
        ) : (
            <div className="space-y-3">
                {orderList.map(order => {
                    const StatusInfo = getStatusInfo(order.status);
                    return (
                        <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-98 transition-transform cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`p-1.5 rounded-full ${StatusInfo.bg} ${StatusInfo.color}`}>
                                        <StatusInfo.icon size={16} />
                                    </span>
                                    <span className={`text-sm font-bold ${StatusInfo.color}`}>
                                        {StatusInfo.text}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Mã đơn: <span className="font-mono">{order.order_code.slice(-6)}</span></p>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1 w-48">
                                        {order.items_summary}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-blue-600">{Number(order.final_amount).toLocaleString()}đ</span>
                                    <div className="flex items-center justify-end text-gray-400 text-xs mt-1">
                                        Chi tiết <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;