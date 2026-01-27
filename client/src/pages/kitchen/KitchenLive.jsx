import React, { useState, useEffect } from 'react';

const KitchenLive = () => {
  // --- STATE ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState([]); // Dữ liệu thật từ API
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [filterType, setFilterType] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập người dùng hiện tại
  const CURRENT_USER = "Tôi";

  // --- 1. HÀM TÍNH THỜI GIAN TRÔI QUA ---
  const calculateTimeElapsed = (startTime) => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / 1000); // Giây

    const mm = Math.floor(diff / 60).toString().padStart(2, '0');
    const ss = (diff % 60).toString().padStart(2, '0');
    
    // Nếu quá 60 phút thì hiện giờ
    if (diff > 3600) {
        const hh = Math.floor(diff / 3600).toString().padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // --- 2. GỌI API LẤY ĐƠN HÀNG ---
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/orders/kitchen');
      const data = await res.json();
      
      // Map dữ liệu từ Backend sang format của UI
      const formattedOrders = data.map(o => ({
        id: o.id,
        displayId: `#${o.order_code.slice(-4)}`, // Lấy 4 số cuối mã đơn
        table: `Đơn #${o.id}`, // Tạm thời hiển thị ID đơn (vì chưa join bảng bàn)
        type: 'DINE_IN', // Tạm định mặc định
        status: determineStatus(o.created_at), // Tính trạng thái dựa trên thời gian chờ
        created_at: o.created_at, // Lưu giờ gốc để tính lại mỗi giây
        timeElapsed: calculateTimeElapsed(o.created_at),
        tags: o.status === 'processing' ? ['Đang nấu'] : ['Mới'],
        note: '', // Backend chưa có note tổng, tạm để trống
        chef: o.status === 'processing' ? 'Bếp' : null,
        items: o.items.map(i => ({
          name: `${i.quantity}x ${i.product_name}`,
          note: i.note,
          done: false
        }))
      }));

      setOrders(formattedOrders);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi tải KDS:", error);
    }
  };

  // Logic xác định màu sắc thẻ dựa trên thời gian chờ
  const determineStatus = (created_at) => {
    const diff = (new Date().getTime() - new Date(created_at).getTime()) / 60000; // Phút
    if (diff > 15) return 'CRITICAL'; // Quá 15p -> Đỏ
    if (diff > 10) return 'VIP';      // Quá 10p -> Vàng
    return 'NORMAL';                  // Mới -> Xanh
  };

  // --- 3. POLLING (TỰ ĐỘNG CẬP NHẬT) ---
  useEffect(() => {
    fetchOrders(); // Gọi ngay lần đầu
    const timer = setInterval(() => {
        setCurrentTime(new Date());
        // Cập nhật lại thời gian trôi qua cho các đơn đang hiện (để không cần fetch lại API chỉ để nhảy giây)
        setOrders(prev => prev.map(o => ({
            ...o,
            timeElapsed: calculateTimeElapsed(o.created_at),
            status: determineStatus(o.created_at)
        })));
    }, 1000);

    // Fetch dữ liệu mới mỗi 5 giây
    const fetchTimer = setInterval(fetchOrders, 5000);

    return () => {
        clearInterval(timer);
        clearInterval(fetchTimer);
    };
  }, []);


  // --- 4. HÀM CẬP NHẬT TRẠNG THÁI (GỌI API) ---
  const handleCompleteOrder = async (orderId) => {
    if(!window.confirm("Xác nhận đã nấu xong đơn này?")) return;

    try {
        // Gọi API báo hoàn thành
        await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });
        
        // Xóa đơn khỏi màn hình ngay lập tức (đỡ phải chờ fetch)
        setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
        alert("Lỗi kết nối Server!");
    }
  };

  // Xử lý check từng món (UI Only)
  const toggleItemDone = (orderId, itemIndex) => {
    const newOrders = [...orders];
    const order = newOrders.find(o => o.id === orderId);
    if (order) {
      order.items[itemIndex].done = !order.items[itemIndex].done;
      setOrders(newOrders);
    }
  };

  const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // --- HÀM STYLE THEO TRẠNG THÁI ---
  const getCardTheme = (status) => {
    switch (status) {
      case 'CRITICAL': 
        return {
          container: 'border-red-500/30 ring-1 ring-red-500 animate-pulse',
          header: 'bg-red-600 text-white',
          subHeader: 'bg-red-50 text-red-600 border-b border-red-100',
          footer: 'bg-red-50/50 border-t border-red-100',
          btn: 'text-red-600 hover:bg-red-600 hover:text-white border-red-200 bg-white'
        };
      case 'VIP': 
        return {
          container: 'border-amber-500/30 ring-1 ring-amber-500',
          header: 'bg-amber-500 text-white',
          subHeader: 'bg-amber-50 text-amber-800 border-b border-amber-100',
          footer: 'bg-amber-50/50 border-t border-amber-100',
          btn: 'bg-amber-500 hover:bg-yellow-600 text-white border-amber-500'
        };
      default: 
        return {
          container: 'border-gray-200 hover:border-blue-500/50',
          header: 'bg-blue-600 text-white',
          subHeader: 'bg-gray-50 text-gray-600 border-b border-gray-200',
          footer: 'bg-gray-50 border-t border-gray-200',
          btn: 'text-gray-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 border-gray-200 bg-white'
        };
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 font-sans h-screen flex flex-col overflow-hidden selection:bg-blue-100 selection:text-blue-600">
      
      {/* --- TOP BAR --- */}
      <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 z-30 shadow-sm gap-4">
        <div className="flex items-center gap-2 h-full py-2 overflow-x-auto">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`h-full px-3 rounded-md font-bold text-sm shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap
            ${filterType === 'ALL' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            <span>TẤT CẢ</span>
            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${filterType === 'ALL' ? 'bg-white/20' : 'bg-gray-100'}`}>
                {orders.length}
            </span>
          </button>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full border border-green-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-gray-600 font-medium text-xs">Đang chờ: <span className="text-blue-600 font-bold">{orders.length}</span></span>
          </div>
          <div className="text-2xl font-bold text-gray-800 tracking-tight leading-none tabular-nums">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* --- MAIN AREA (GRID) --- */}
      <div className="flex-1 bg-gray-100 p-2 md:p-3 overflow-y-auto">
        
        {isLoading && orders.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400">Đang tải dữ liệu bếp...</div>
        ) : orders.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-400">
                <span className="text-6xl mb-4">🍽️</span>
                <p>Hiện không có đơn hàng nào cần làm</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 items-start">
            {orders.map((order) => {
                const theme = getCardTheme(order.status);
                
                return (
                <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`flex flex-col bg-white rounded-lg shadow-sm overflow-hidden border cursor-pointer hover:shadow-md transition-all group relative ${theme.container}`}
                >
                    {/* Header Card */}
                    <div className={`px-3 py-1.5 flex justify-between items-center ${theme.header}`}>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                        <span className="font-bold text-base leading-none">{order.table}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="font-mono font-bold text-lg leading-none">{order.timeElapsed}</span>
                    </div>
                    </div>

                    {/* Sub-Header */}
                    <div className={`px-3 py-0.5 flex justify-between items-center text-xs ${theme.subHeader}`}>
                    <span className="font-mono font-medium">{order.displayId}</span>
                    <span className="font-mono text-[10px] opacity-70">{formatTime(new Date(order.created_at))}</span>
                    </div>

                    {/* Body: List Món */}
                    <div className="p-2 flex flex-col gap-2 flex-1">
                    {order.items.map((item, idx) => (
                        <React.Fragment key={idx}>
                        <div className={`flex justify-between items-start gap-2 ${item.done ? 'opacity-40' : ''}`}>
                            <div className="flex-1">
                            <div className={`text-gray-900 font-bold text-sm leading-tight ${item.done ? 'line-through' : ''}`}>
                                {item.name}
                            </div>
                            {item.note && <div className="text-red-500 font-bold text-[11px] italic mt-0.5 leading-tight">{item.note}</div>}
                            </div>
                            <button
                            onClick={(e) => { e.stopPropagation(); toggleItemDone(order.id, idx); }}
                            className={`h-7 w-7 flex items-center justify-center rounded border transition-colors shrink-0 
                                ${item.done 
                                ? 'bg-green-100 text-green-600 border-green-200 cursor-default' 
                                : 'bg-white text-gray-400 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-300'}`}
                            >
                            <span>✓</span>
                            </button>
                        </div>
                        {idx < order.items.length - 1 && <div className="h-px bg-gray-100 w-full" />}
                        </React.Fragment>
                    ))}
                    </div>

                    {/* Footer Action */}
                    <div className={`px-2 py-2 mt-auto ${theme.footer}`}>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteOrder(order.id);
                        }}
                        className={`w-full font-bold py-1.5 rounded text-xs border shadow-sm uppercase tracking-wide transition-all active:scale-[0.98] ${theme.btn}`}
                    >
                        HOÀN THÀNH
                    </button>
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </div>

      {/* --- MODAL (NOTE) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl z-50 relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">Chi tiết đơn hàng {selectedOrder.displayId}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-red-500">✕</button>
            </div>
            <div className="p-4 bg-gray-50">
               <textarea className="w-full border border-gray-300 rounded p-2 text-sm" rows="3" placeholder="Ghi chú nội bộ cho đơn này..."></textarea>
            </div>
            <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-end gap-2">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200">Đóng</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KitchenLive;