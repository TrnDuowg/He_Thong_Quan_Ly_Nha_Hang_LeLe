import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Clock, CheckCircle, XCircle } from 'lucide-react';

const KitchenHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, COMPLETED, CANCELLED

  // --- 1. GỌI API ---
  const fetchHistory = async () => {
    setLoading(true);
    try {
        const res = await fetch('http://localhost:3000/api/orders/history');
        const data = await res.json();
        setOrders(data);
    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // --- 2. LỌC DỮ LIỆU ---
  const filteredData = orders.filter(order => {
    const matchesSearch = 
        order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (order.items_summary && order.items_summary.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'ALL' || order.status === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // --- 3. HÀM HOÀN TÁC (ĐƯA VỀ BẾP NẤU LẠI) ---
  const handleUndo = async (orderId) => {
      if(!window.confirm("Bạn muốn nấu lại đơn này?")) return;
      try {
          await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'processing' })
          });
          fetchHistory(); // Tải lại danh sách
      } catch (e) { alert("Lỗi kết nối"); }
  };

  const formatTime = (dateStr) => {
      return new Date(dateStr).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'});
  };

  return (
    <div className="bg-gray-50 h-full flex flex-col font-sans text-gray-900">
      
      {/* --- TOOLBAR --- */}
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 gap-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-gray-500" /> Lịch sử Bếp
        </h1>
        
        <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Tìm mã đơn, món ăn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filter Buttons */}
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                {['ALL', 'COMPLETED', 'CANCELLED'].map(type => (
                    <button 
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
                            filter === type 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        {type === 'ALL' ? 'Tất cả' : type === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã Đơn</th>
                <th className="px-6 py-4">Món Ăn</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-400">Đang tải lịch sử...</td></tr>
              ) : filteredData.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-400">Không có dữ liệu</td></tr>
              ) : (
                filteredData.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  {/* Mã Đơn */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-gray-700">{order.order_code}</span>
                  </td>
                  
                  {/* List Món (Backend đã group_concat) */}
                  <td className="px-6 py-4">
                    <p className="text-gray-800 font-medium line-clamp-2" title={order.items_summary}>
                        {order.items_summary}
                    </p>
                  </td>

                  {/* Thời gian */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {formatTime(order.created_at)}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-bold text-xs border border-green-200">
                        <CheckCircle size={14} /> Hoàn thành
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-xs border border-red-200">
                        <XCircle size={14} /> Đã hủy
                      </span>
                    )}
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                        onClick={() => handleUndo(order.id)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded transition-all flex items-center gap-1 ml-auto"
                        title="Đưa đơn này quay lại màn hình bếp để nấu lại"
                    >
                        <RotateCcw size={14} />
                        Nấu lại
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KitchenHistory;