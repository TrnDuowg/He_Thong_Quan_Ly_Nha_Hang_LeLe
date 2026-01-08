import React, { useState, useEffect } from 'react';

// --- MOCK DATA ---
// [CẬP NHẬT 1]: Thêm trường 'chef' vào dữ liệu
const ORDERS_DATA = [
  {
    id: 105,
    displayId: '#105',
    table: 'Bàn 05',
    type: 'TAKEAWAY', 
    status: 'CRITICAL', 
    timeElapsed: '26:10',
    tags: ['Mang về', 'GIỤC LẦN 2'],
    chef: 'Tuấn Anh', // Đã có người nhận
    items: [
      { name: '1x Combo Gà Rán', done: false },
      { name: '1x Pepsi (L)', note: 'No Ice', done: false }
    ]
  },
  {
    id: 99,
    displayId: '#099',
    table: 'VIP-01',
    type: 'DINE_IN',
    status: 'VIP', 
    timeElapsed: '18:45',
    tags: [],
    note: 'Khách VIP, tặng tráng miệng.',
    chef: 'Bếp Trưởng', // Đã có người nhận
    items: [
      { name: '1x Steak Bò Úc', sub: ['Medium', 'Sốt tiêu đen'], done: false }
    ]
  },
  {
    id: 102,
    displayId: '#102',
    table: 'Bàn 12',
    type: 'DINE_IN',
    status: 'NORMAL',
    timeElapsed: '05:23',
    tags: ['Tại chỗ'],
    chef: null, // CHƯA CÓ AI LÀM
    items: [
      { name: '2x Burger Bò ĐB', note: '+ Thêm phô mai', alert: 'KHÔNG HÀNH', done: true },
      { name: '1x Khoai tây chiên', done: false },
      { name: '1x Coca Cola', done: false }
    ]
  },
  {
    id: 921,
    displayId: '#GF-921',
    table: 'GrabFood',
    type: 'APP',
    status: 'APP',
    timeElapsed: '03:12',
    tags: ['APP'],
    note: 'Giao tài xế ở cửa sau.',
    chef: null,
    items: [
      { name: '2x Mỳ Ý Sốt Bò', done: true },
      { name: '1x Pizza Hải Sản', note: 'Đế mỏng', done: true }
    ]
  },
  {
    id: 110,
    displayId: '#110',
    table: 'Bàn 08',
    type: 'DINE_IN',
    status: 'NORMAL',
    timeElapsed: '01:45',
    tags: [],
    chef: null,
    items: [
      { name: '1x Salad Cá Ngừ', note: 'Sốt mè rang', done: false }
    ]
  },
];

const KitchenLive = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [orders, setOrders] = useState(ORDERS_DATA);
  const [filterType, setFilterType] = useState('ALL');

  // [CẬP NHẬT 2]: Giả lập người dùng hiện tại
  const CURRENT_USER = "Tôi";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Xử lý check từng món
  const toggleItemDone = (orderId, itemIndex) => {
    const newOrders = [...orders];
    const order = newOrders.find(o => o.id === orderId);
    if (order) {
      order.items[itemIndex].done = !order.items[itemIndex].done;
      setOrders(newOrders);
    }
  };

  // [CẬP NHẬT 3]: Hàm Nhận / Hủy đơn
  const handleAssignOrder = (e, orderId) => {
    e.stopPropagation(); 
    const newOrders = orders.map(order => {
        if (order.id === orderId) {
            // Logic: Nếu chưa ai nhận -> Gán cho tôi. Nếu là tôi -> Hủy.
            return { ...order, chef: order.chef ? null : CURRENT_USER };
        }
        return order;
    });
    setOrders(newOrders);
  }

  // --- HÀM STYLE THEO TRẠNG THÁI ---
  const getCardTheme = (status) => {
    switch (status) {
      case 'CRITICAL': 
        return {
          container: 'border-pos-error/30 ring-1 ring-pos-error animate-blink',
          header: 'bg-pos-error text-white',
          subHeader: 'bg-red-50 text-pos-error border-b border-red-100',
          footer: 'bg-red-50/50 border-t border-red-100',
          btn: 'text-pos-error hover:bg-pos-error hover:text-white border-pos-error/20 bg-white'
        };
      case 'VIP': 
        return {
          container: 'border-pos-warning/30 ring-1 ring-pos-warning',
          header: 'bg-pos-warning text-white',
          subHeader: 'bg-amber-50 text-amber-800 border-b border-amber-100',
          footer: 'bg-amber-50/50 border-t border-amber-100',
          btn: 'bg-pos-warning hover:bg-yellow-600 text-white border-pos-warning'
        };
      case 'APP': 
        return {
          container: 'border-border-light',
          header: 'bg-primary text-white',
          subHeader: 'bg-background-body text-text-secondary border-b border-border-light',
          footer: 'bg-green-50 border-t border-green-100',
          btn: 'bg-pos-success hover:bg-green-600 text-white animate-pulse border-pos-success'
        };
      default: 
        return {
          container: 'border-border-light hover:border-primary/50',
          header: 'bg-primary text-white',
          subHeader: 'bg-background-body text-text-secondary border-b border-border-light',
          footer: 'bg-background-body border-t border-border-light',
          btn: 'text-text-secondary hover:text-white hover:bg-primary hover:border-primary border-border-light bg-white'
        };
    }
  };

  return (
    <div className="bg-background-body text-text-main font-display h-screen flex flex-col overflow-hidden selection:bg-primary-light selection:text-primary">
      
      {/* --- TOP BAR --- */}
      <div className="h-top-bar bg-surface-white border-b border-border-light px-4 flex items-center justify-between shrink-0 z-30 shadow-sm gap-4">
        <div className="flex items-center gap-2 h-full py-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`h-full px-3 rounded-md font-bold text-sm shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap
            ${filterType === 'ALL' ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-surface-white text-text-secondary border border-border-light hover:text-primary'}`}
          >
            <span>TẤT CẢ</span>
            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${filterType === 'ALL' ? 'bg-white/20' : 'bg-background-body'}`}>
                {orders.length}
            </span>
          </button>
          {['BẾP NÓNG', 'BẾP LẠNH', 'ĐỒ UỐNG'].map((filter) => (
            <button key={filter} className="h-full px-3 rounded-md bg-surface-white border border-border-light text-text-secondary font-semibold text-sm hover:border-primary/50 hover:text-primary hover:bg-primary-light transition-all flex items-center gap-2 whitespace-nowrap">
              <span>{filter}</span>
              <span className="bg-background-body text-text-secondary px-1.5 py-0.5 rounded text-xs">2</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-pos-success/10 rounded-full border border-pos-success/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pos-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pos-success"></span>
            </span>
            <span className="text-text-secondary font-medium text-xs">Chờ: <span className="text-primary font-bold">{orders.length}</span></span>
          </div>
          <div className="text-2xl font-bold text-text-main tracking-tight leading-none tabular-nums" id="clock">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* --- MAIN AREA (GRID) --- */}
      <div className="h-main-area bg-background-body p-2 md:p-3 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 items-start">
          
          {orders.map((order) => {
            const theme = getCardTheme(order.status);
            
            return (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`flex flex-col bg-surface-white rounded-lg shadow-sm overflow-hidden border cursor-pointer hover:shadow-md transition-all group relative ${theme.container}`}
              >
                {/* Icon mở modal */}
                {order.status === 'VIP' && (
                  <div className="absolute top-1 right-1 z-20">
                    <span className="material-symbols-outlined text-white/50 text-[14px] group-hover:text-white transition-colors">open_in_new</span>
                  </div>
                )}

                {/* Header Card */}
                <div className={`px-3 py-1.5 flex justify-between items-center ${theme.header}`}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base leading-none">{order.table}</span>
                      {order.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-black/20 px-1 rounded uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-lg leading-none">{order.timeElapsed}</span>
                  </div>
                </div>

                {/* Sub-Header */}
                <div className={`px-3 py-0.5 flex justify-between items-center text-xs ${theme.subHeader}`}>
                  <span className="font-mono font-medium">{order.displayId}</span>
                  {order.status === 'CRITICAL' && (
                    <div className="inline-flex items-center gap-1 font-bold animate-pulse">
                      <span className="material-symbols-outlined text-[12px]">priority_high</span>
                      <span>GIỤC LẦN 2</span>
                    </div>
                  )}
                </div>

                {/* Body: List Món */}
                <div className="p-2 flex flex-col gap-2 flex-1">
                  {order.items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <div className={`flex justify-between items-start gap-2 ${item.done ? 'opacity-40' : ''}`}>
                        <div className="flex-1">
                          <div className={`text-text-main font-bold text-sm leading-tight ${item.done ? 'line-through' : ''}`}>
                            {item.name}
                          </div>
                          {item.sub && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.sub.map((s) => (
                                <span key={s} className="bg-pos-warning/10 text-pos-warning border border-pos-warning/20 px-1 rounded-[3px] text-[10px] font-medium leading-none py-0.5">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.note && <div className="text-text-secondary text-[11px] italic mt-0.5 leading-tight">{item.note}</div>}
                          {item.alert && <div className="text-pos-error font-bold text-[10px] mt-0.5 uppercase">{item.alert}</div>}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleItemDone(order.id, idx); }}
                          className={`h-7 w-7 flex items-center justify-center rounded border transition-colors shrink-0 
                            ${item.done 
                              ? 'bg-pos-success/10 text-pos-success border-pos-success/30 cursor-default' 
                              : 'bg-surface-white text-text-secondary border-border-light hover:bg-pos-success/10 hover:text-pos-success hover:border-pos-success'}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </button>
                      </div>
                      {idx < order.items.length - 1 && <div className="h-px bg-border-light w-full" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* [CẬP NHẬT 4]: THANH NGƯỜI PHỤ TRÁCH (CHEF ASSIGNMENT) */}
                <div className={`px-2 py-1 flex items-center justify-between border-t border-dashed border-border-light ${order.chef ? 'bg-primary-light/30' : 'bg-background-body'}`}>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        {order.chef ? (
                             <>
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                                    {order.chef.charAt(0)}
                                </div>
                                <span className="text-[10px] font-bold text-primary truncate">
                                    {order.chef === CURRENT_USER ? "Bạn đang làm" : order.chef}
                                </span>
                             </>
                        ) : (
                            <span className="text-[10px] text-text-secondary italic flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">person_off</span>
                                Chưa ai nhận
                            </span>
                        )}
                    </div>
                    {/* Nút Nhận / Hủy */}
                    <button 
                        onClick={(e) => handleAssignOrder(e, order.id)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors
                        ${order.chef === CURRENT_USER 
                            ? 'bg-white border-pos-error text-pos-error hover:bg-pos-error hover:text-white' 
                            : !order.chef 
                                ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                                : 'hidden' 
                        }`}
                    >
                        {order.chef === CURRENT_USER ? 'Hủy' : 'Nhận'}
                    </button>
                </div>

                {/* Note chung */}
                {order.note && (
                   <div className="px-2 pb-2 mt-1">
                    <div className="flex items-start gap-1.5 text-primary bg-primary-light p-1.5 rounded border border-primary/20">
                      <span className="material-symbols-outlined text-[14px]">edit_note</span>
                      <span className="text-[10px] font-medium italic leading-tight">{order.note}</span>
                    </div>
                   </div>
                )}

                {/* Footer Action */}
                <div className={`px-2 py-2 mt-auto ${theme.footer}`}>
                  <button className={`w-full font-bold py-1.5 rounded text-xs border shadow-sm uppercase tracking-wide transition-all active:scale-[0.98] ${theme.btn}`}>
                    {order.status === 'APP' ? 'TRẢ ĐƠN NGAY' : 'TRẢ MÓN'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- BOTTOM BAR --- */}
      <div className="h-bottom-bar bg-surface-white text-text-secondary border-t border-border-light flex items-center justify-between px-4 z-30 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="material-symbols-outlined text-primary text-[16px]">notifications_active</span>
          <span className="font-medium text-xs text-text-main truncate">Vừa nhận đơn: Bàn 12 - #Order-102 (2 món)</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-pos-error font-bold bg-pos-error/10 px-2 py-0.5 rounded border border-pos-error/20">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span className="text-[10px] uppercase">Hết thịt bò</span>
          </div>
          <div className="flex items-center gap-1 text-pos-success font-medium pl-2">
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* --- MODAL (NOTE) --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-text-main/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 p-4">
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-surface-white w-full max-w-lg rounded-xl shadow-2xl z-50 relative overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-text-main/5 animate-fade-in-up">
            
            <div className="px-4 py-3 border-b border-border-light flex justify-between items-center bg-surface-white">
              <h3 className="font-bold text-text-main text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-primary bg-primary-light p-1 rounded">edit_note</span>
                Ghi Chú Nội Bộ
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-text-secondary hover:text-pos-error cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto bg-background-body">
              <div className="mb-4 flex items-center justify-between p-3 bg-surface-white border border-border-light rounded-lg shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-pos-warning/20 flex items-center justify-center text-pos-warning">
                      <span className="material-symbols-outlined text-lg">star</span>
                    </div>
                    <div>
                      <div className="font-bold text-text-main text-sm leading-none">{selectedOrder.table}</div>
                      <div className="text-text-secondary text-[10px] mt-0.5 font-mono">{selectedOrder.displayId}</div>
                    </div>
                  </div>
              </div>
              
              <div className="mb-4 space-y-3">
                {selectedOrder.note && (
                    <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0 font-bold text-[10px] ring-2 ring-white shadow-sm">QL</div>
                    <div className="bg-surface-white p-2 rounded-lg rounded-tl-none border border-border-light flex-1 relative shadow-sm">
                        <p className="text-text-main text-sm leading-snug">{selectedOrder.note}</p>
                        <div className="text-[10px] text-text-secondary mt-1 text-right font-medium">18:46 - Quản lý</div>
                    </div>
                    </div>
                )}
              </div>

              <textarea className="w-full border-border-light rounded-lg shadow-sm focus:border-primary focus:ring-primary text-text-main text-sm p-2 bg-surface-white" placeholder="Nhập nội dung..." rows="3"></textarea>
            </div>

            <div className="px-4 py-3 bg-surface-white border-t border-border-light flex justify-end gap-2">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 rounded bg-surface-white border border-border-light text-text-secondary font-medium text-xs hover:bg-background-body">Đóng</button>
              <button className="px-4 py-2 rounded bg-primary text-white font-medium text-xs hover:bg-primary-hover flex items-center gap-1">Lưu</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KitchenLive;