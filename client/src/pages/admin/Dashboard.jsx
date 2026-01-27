import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { DollarSign, ShoppingBag, Users, Clock, Loader } from 'lucide-react';

// --- BIỂU ĐỒ MẪU (Tạm thời giữ nguyên vì API Dashboard chưa trả về data theo giờ) ---
const CHART_DATA = [
  { name: '8:00', value: 120000 },
  { name: '10:00', value: 165000 },
  { name: '12:00', value: 255000 },
  { name: '14:00', value: 180000 },
  { name: '16:00', value: 105000 },
  { name: '18:00', value: 225000 },
  { name: '20:00', value: 270000 },
  { name: '22:00', value: 120000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs rounded p-2 shadow-xl">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-blue-200">Doanh thu: {payload[0].value.toLocaleString()} ₫</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    topProducts: [],
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // --- GỌI API LẤY SỐ LIỆU ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/dashboard');
        const data = await res.json();
        
        // Backend trả về: revenue, ordersCount, topProducts, recentOrders
        setStats({
          revenue: data.revenue || 0,
          ordersCount: data.ordersCount || 0,
          // Nếu backend trả về null thì dùng mảng rỗng
          topProducts: data.topProducts || [],
          recentOrders: data.recentOrders || []
        });
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-500 font-medium">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth font-sans bg-gray-50 text-gray-900 h-full">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tổng Quan Kinh Doanh 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Báo cáo hoạt động bán hàng hôm nay.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium shadow-sm cursor-pointer hover:border-blue-500/50 transition-colors">
                <option>Hôm nay</option>
                <option>Hôm qua</option>
                <option>7 ngày qua</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95">
              Xuất Báo Cáo
            </button>
          </div>
        </div>

        {/* --- STATS GRID (DỮ LIỆU THẬT) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Doanh Thu */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                <DollarSign size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Tổng Doanh Thu</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue)}</h3>
          </div>
          
          {/* Card 2: Số Đơn */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <ShoppingBag size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Tổng Đơn Hàng</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.ordersCount}</h3>
          </div>

          {/* Card 3: Khách hàng (Giả lập) */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                <Users size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Khách Tại Quán</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">15</h3>
          </div>

          {/* Card 4: Thời gian chờ (Giả lập) */}
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
                <Clock size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">Thời gian TB</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">~15p</h3>
          </div>
        </div>

        {/* --- CHART SECTION --- */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Biểu đồ Doanh thu</h3>
              <p className="text-sm text-gray-500 mt-1">So sánh hiệu suất bán hàng trong ngày</p>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  tickFormatter={(value) => `${value / 1000000}M`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar 
                  dataKey="value" 
                  fill="#2563eb" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                  activeBar={{ fill: '#1d4ed8' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Top Products Table (DỮ LIỆU THẬT) */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-gray-900">Top Món Bán Chạy</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-4">Món ăn</th>
                    <th className="px-5 py-4 text-center">Số lượng</th>
                    <th className="px-5 py-4 text-right">Tổng thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.topProducts.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-6 text-gray-400">Chưa có dữ liệu bán hàng</td>
                    </tr>
                  ) : (
                    stats.topProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </span>
                            <span className="font-semibold text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center font-semibold text-gray-700">{product.sold_count}</td>
                        <td className="px-5 py-4 text-right font-bold text-blue-600">{formatCurrency(product.total_sales)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifications Panel (Tĩnh) */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Thông báo</h3>
              <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full">3 Mới</span>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] flex-1 pr-1">
              <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="size-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">⚠</div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-gray-900">Hệ thống</p>
                  <p className="text-xs text-gray-500">Backend đã kết nối thành công.</p>
                  <span className="text-[10px] text-gray-400 mt-1 font-medium">Vừa xong</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;