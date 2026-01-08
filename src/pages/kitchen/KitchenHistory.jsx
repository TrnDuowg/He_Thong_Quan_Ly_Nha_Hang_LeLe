import React, { useState } from 'react';

// --- MOCK DATA: Đơn hàng đã hoàn thành hoặc hủy ---
const HISTORY_DATA = [
  {
    id: 105,
    displayId: '#105',
    table: 'Bàn 05',
    type: 'TAKEAWAY',
    status: 'COMPLETED', // COMPLETED, CANCELLED
    items: ['1x Combo Gà Rán', '1x Pepsi (L)'],
    startTime: '10:30',
    endTime: '10:45',
    duration: '15 phút',
    staff: 'Bếp Trưởng'
  },
  {
    id: 102,
    displayId: '#102',
    table: 'Bàn 12',
    type: 'DINE_IN',
    status: 'COMPLETED',
    items: ['2x Burger Bò ĐB', '1x Khoai tây', '1x Coca'],
    startTime: '10:15',
    endTime: '10:28',
    duration: '13 phút',
    staff: 'Tuấn'
  },
  {
    id: 99,
    displayId: '#099',
    table: 'VIP-01',
    type: 'DINE_IN',
    status: 'COMPLETED',
    items: ['1x Steak Bò Úc (Medium)'],
    startTime: '09:45',
    endTime: '10:10',
    duration: '25 phút',
    staff: 'Bếp Trưởng'
  },
  {
    id: 98,
    displayId: '#098',
    table: 'GrabFood',
    type: 'APP',
    status: 'CANCELLED', // Đơn bị hủy
    items: ['1x Pizza Hải Sản'],
    startTime: '09:00',
    endTime: '09:05',
    duration: '--',
    staff: 'Tuấn',
    note: 'Khách hủy đơn'
  },
];

const KitchenHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, COMPLETED, CANCELLED

  // Lọc dữ liệu
  const filteredData = HISTORY_DATA.filter(order => {
    const matchesSearch = 
        order.displayId.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.table.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-background-body text-text-main font-display h-full flex flex-col">
      
      {/* --- TOOLBAR (Tìm kiếm & Bộ lọc) --- */}
      <div className="h-top-bar bg-surface-white border-b border-border-light px-4 flex items-center justify-between shrink-0 gap-4">
        
        {/* Search Box */}
        <div className="relative w-64 md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-secondary">search</span>
          </div>
          <input 
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-lg leading-5 bg-background-body text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Tìm theo Mã đơn / Bàn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-background-body p-1 rounded-lg border border-border-light">
           <button 
             onClick={() => setFilter('ALL')}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${filter === 'ALL' ? 'bg-white text-primary shadow-sm' : 'text-text-secondary hover:text-text-main'}`}
           >
             Tất cả
           </button>
           <button 
             onClick={() => setFilter('COMPLETED')}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${filter === 'COMPLETED' ? 'bg-white text-pos-success shadow-sm' : 'text-text-secondary hover:text-text-main'}`}
           >
             Hoàn thành
           </button>
           <button 
             onClick={() => setFilter('CANCELLED')}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${filter === 'CANCELLED' ? 'bg-white text-pos-error shadow-sm' : 'text-text-secondary hover:text-text-main'}`}
           >
             Đã hủy
           </button>
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-surface-white border border-border-light rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-background-body">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Mã / Bàn</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Danh sách món</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Thời gian</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Người làm</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-surface-white divide-y divide-border-light">
              {filteredData.length > 0 ? (
                filteredData.map((order) => (
                <tr key={order.id} className="hover:bg-primary-light/10 transition-colors">
                  {/* Mã & Bàn */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-main">{order.table}</span>
                      <span className="text-xs font-mono text-text-secondary">{order.displayId}</span>
                      {order.type === 'TAKEAWAY' && <span className="mt-1 text-[10px] bg-blue-100 text-blue-700 w-fit px-1.5 rounded font-medium">Mang về</span>}
                    </div>
                  </td>
                  
                  {/* List Món */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-sm text-text-main font-medium">• {item}</span>
                      ))}
                      {order.note && <span className="text-xs text-pos-error italic mt-1">Ghi chú: {order.note}</span>}
                    </div>
                  </td>

                  {/* Thời gian */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-sm text-text-secondary">
                      <span>Vào: {order.startTime}</span>
                      <span>Xong: {order.endTime}</span>
                      <span className="text-xs font-bold text-text-main mt-0.5">⏱ {order.duration}</span>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === 'COMPLETED' ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                        Đã xong
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                        Đã hủy
                      </span>
                    )}
                  </td>

                  {/* Người làm */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {order.staff.charAt(0)}
                        </div>
                        {order.staff}
                    </div>
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        className="text-primary hover:text-primary-hover font-bold border border-primary/30 px-3 py-1.5 rounded hover:bg-primary-light transition-all flex items-center gap-1 ml-auto"
                        onClick={() => alert(`Khôi phục đơn ${order.displayId} về màn hình chế biến?`)}
                    >
                        <span className="material-symbols-outlined text-[16px]">undo</span>
                        Hoàn tác
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-text-secondary">
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-4xl text-slate-300">history</span>
                            <p>Không tìm thấy đơn hàng nào.</p>
                        </div>
                    </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KitchenHistory;