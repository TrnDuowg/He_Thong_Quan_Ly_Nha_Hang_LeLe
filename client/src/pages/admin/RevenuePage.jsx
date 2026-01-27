import React, { useState, useEffect } from 'react';
import { 
  Filter, Printer, Download, DollarSign, Receipt, ShoppingBasket, 
  CheckSquare, Eye, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend
} from 'recharts';

// --- MODAL CHI TIẾT (Giữ nguyên) ---
const RevenueDetailModal = ({ date, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const displayDate = new Date(date).toLocaleDateString('vi-VN');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/revenue/daily/${date}`);
                const data = await res.json();
                setOrders(data);
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        if (date) fetchDetails();
    }, [date]);

    if (!date) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Chi Tiết Doanh Thu</h3>
                        <p className="text-sm text-gray-500">Ngày: <span className="font-bold text-blue-600">{displayDate}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">Không có đơn hàng nào.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Mã Đơn</th>
                                    <th className="px-4 py-3">Giờ</th>
                                    <th className="px-4 py-3">Nhân viên</th>
                                    <th className="px-4 py-3 text-center">Trạng thái</th>
                                    <th className="px-4 py-3 text-right">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-4 py-3 font-mono font-bold text-gray-700">{order.order_code}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(order.created_at).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800">{order.staff_name || 'Admin'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">{order.status}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-blue-600">
                                            {Number(order.final_amount).toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- TRANG CHÍNH ---
const RevenuePage = () => {
  const [reportData, setReportData] = useState([]);
  const [paymentData, setPaymentData] = useState([]); // State cho biểu đồ tròn
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10)
  });
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchRevenue = async () => {
    setIsLoading(true);
    try {
      const query = `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      
      // 1. Gọi API Báo cáo ngày
      const resReport = await fetch(`http://localhost:3000/api/revenue${query}`);
      const dataReport = await resReport.json();
      
      // 2. Gọi API Báo cáo thanh toán (MỚI)
      const resPayment = await fetch(`http://localhost:3000/api/revenue/payment-stats${query}`);
      const dataPayment = await resPayment.json();

      // Format data ngày
      const formattedReport = dataReport.map(item => ({
          ...item,
          rawDate: new Date(item.date).toISOString().slice(0, 10),
          displayDate: new Date(item.date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}),
          revenue: Number(item.revenue)
      }));

      // Format data thanh toán (Map màu sắc)
      const formattedPayment = dataPayment.map(item => {
          let name = 'Khác';
          let color = '#94a3b8'; // Gray
          if (item.payment_method === 'cash') { name = 'Tiền mặt'; color = '#3b82f6'; } // Blue
          else if (item.payment_method === 'qr') { name = 'Chuyển khoản'; color = '#10b981'; } // Green
          else if (item.payment_method === 'card') { name = 'Thẻ'; color = '#f59e0b'; } // Orange
          
          return {
              name,
              value: Number(item.total_amount),
              color
          };
      });

      setReportData(formattedReport);
      setPaymentData(formattedPayment);
      setCurrentPage(1);

    } catch (e) { 
      console.error("Lỗi tải báo cáo:", e); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchRevenue(); }, []);

  const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = reportData.reduce((sum, item) => sum + item.order_count, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reportData.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR BỘ LỌC */}
      <aside className="w-72 border-r border-gray-200 bg-white flex flex-col h-full shrink-0 shadow-sm z-10">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Filter size={18} className="text-blue-600" /> BỘ LỌC
          </h3>
        </div>
        
        <div className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-600">Từ ngày</label>
            <input type="date" className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
                value={dateRange.startDate} onChange={e => setDateRange({...dateRange, startDate: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-600">Đến ngày</label>
            <input type="date" className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500"
                value={dateRange.endDate} onChange={e => setDateRange({...dateRange, endDate: e.target.value})} />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button onClick={fetchRevenue} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all">
            <CheckSquare size={18} /> ÁP DỤNG
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col p-6 lg:p-8 gap-6 overflow-y-auto bg-slate-50 pb-32">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Báo Cáo Doanh Thu</h1>
                <p className="text-slate-500 text-sm mt-1">Số liệu tài chính theo thời gian thực</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-bold hover:bg-gray-50">
                <Printer size={16} /> In
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 shadow-md">
                <Download size={16} /> Excel
              </button>
            </div>
        </div>

        {/* Thẻ Tổng hợp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                <div className="flex justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><DollarSign /></div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase">Tổng Doanh Thu</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{isLoading ? '...' : formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
                <div className="mb-4"><div className="p-3 bg-indigo-50 text-indigo-600 w-fit rounded-xl"><Receipt /></div></div>
                <p className="text-slate-500 text-sm font-bold uppercase">Tổng Đơn Hàng</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{isLoading ? '...' : totalOrders}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm">
                <div className="mb-4"><div className="p-3 bg-orange-50 text-orange-600 w-fit rounded-xl"><ShoppingBasket /></div></div>
                <p className="text-slate-500 text-sm font-bold uppercase">Giá Trị Trung Bình</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{isLoading ? '...' : formatCurrency(avgOrderValue)}</h3>
            </div>
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            {/* Cột Trái: Bar Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Biểu đồ doanh thu</h3>
                <div className="flex-1 w-full">
                    {reportData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(val) => `${val/1000}k`} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => formatCurrency(val)} />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <div className="h-full flex items-center justify-center text-slate-400">Không có dữ liệu</div>}
                </div>
            </div>

            {/* Cột Phải: Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-2">Phương thức thanh toán</h3>
                <div className="flex-1 w-full relative">
                    {paymentData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={paymentData} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {paymentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <PieTooltip formatter={(val) => formatCurrency(val)} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">Chưa có giao dịch</div>
                    )}
                    
                    {paymentData.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-8">
                            <div className="text-center"><p className="text-xs text-slate-400 font-bold uppercase">Tỷ trọng</p></div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* BẢNG CHI TIẾT */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Chi tiết doanh thu theo ngày</h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                        <tr>
                            <th className="px-6 py-4">Ngày</th>
                            <th className="px-6 py-4 text-center">Số đơn hàng</th>
                            <th className="px-6 py-4 text-right">Doanh thu</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentItems.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-700">
                                    {new Date(row.date).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">{row.order_count}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-black text-blue-600">
                                    {formatCurrency(row.revenue)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setSelectedDate(row.rawDate)}
                                        className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-3 py-1.5 rounded flex items-center gap-1 ml-auto"
                                    >
                                        <Eye size={16}/> Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {reportData.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-8 text-slate-400">Chưa có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Thanh Phân Trang */}
            {reportData.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-slate-50">
                    <span className="text-sm text-slate-500">
                        Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, reportData.length)} trên {reportData.length} ngày
                    </span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronLeft size={16}/>
                        </button>
                        <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold">
                            {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                        >
                            <ChevronRight size={16}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </main>

      {selectedDate && <RevenueDetailModal date={selectedDate} onClose={() => setSelectedDate(null)} />}
    </div>
  );
};

export default RevenuePage;