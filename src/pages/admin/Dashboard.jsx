import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- DỮ LIỆU MẪU ---
const dataChart = [
  { name: '8:00', value: 1200000, label: '1.2M' },
  { name: '10:00', value: 1650000, label: '1.65M' },
  { name: '12:00', value: 2550000, label: '2.55M' },
  { name: '14:00', value: 1800000, label: '1.8M' },
  { name: '16:00', value: 1050000, label: '1.05M' },
  { name: '18:00', value: 2250000, label: '2.25M' },
  { name: '20:00', value: 2700000, label: '2.7M' },
  { name: '22:00', value: 1200000, label: '1.2M' },
];

const topProducts = [
  { id: 1, name: 'Combo Burger Bò', cat: 'Burger', sold: 120, revenue: '6,500,000 ₫', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOzimVlv7oS7HkzKp2V6KXxSF5Mck1QdSiZM0i-syMQJLTTwxKtTujj9sg86xiQzks4UAMtoedaPrdWwydYf4c34quXYXPvyWOqJo_zYe8Y-oMvZ08a0sd6AURsRHSivPShVyVxkM52h2R6fFKfxocxrKVMLEth_ZVRDoq8m30z3Lwt0oiwANYnJeO74ItesFWv9lMoJWhSbLe5UqsGhf6y57E-xQBls9n7eLuU28aLphVgjLB_1XeRY75PQyYf6PquXWVWDr34lI' },
  { id: 2, name: 'Gà Rán Spicy', cat: 'Gà rán', sold: 98, revenue: '3,920,000 ₫', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_IRTTxCWHv0lAzwM3Wvo2PBa4-tn4NRR0KEwdo0Ld106HZ-fVo6PMxMo6-LavEEDvpsuIj4MeDWoXtw5DGredjK7lhmvVfqmRHKqK-Cvxo0-qlhHGT91xgBQB4l_wlMRq8SK6ZrpKEXsi_vDQZhi2cq8KaljDradzkD4v7NvXLtIwQ2W9CRMsqS8h8a8HFOsCrBpZmWzaTutZneR32pjeFceG9PQ8guqr7pGtgbgpc-J-SuFERjab3iFHqFA9jGk9JL9pQi7wwnQ' },
  { id: 3, name: 'Pepsi Large', cat: 'Đồ uống', sold: 85, revenue: '1,275,000 ₫', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq4eDUhcRaDARHkFpiWLAUYd3x1jATrgd2L6bA6jn69k_qMWdTqJkfjNGE1IvD1xKEe61WLbgbCYhf_zmOEnMrqMyKnSc8msFI0jLbU-4yAnN28sK-CfdXVvKE7sjPa-P9t_7CZLYdBTi5lYSx1q0ft0-kBnUtofMlbuSewVXdIp8oDjsnXGwXoWIinhTtYYEOQLtVCLxA36A_CANsKjJnRkdsuzdYUzoIjUTlF38UuXmL4VVVipwaiGWuERTXPqJmwbk213qyVbg' },
];

// Custom Tooltip cho biểu đồ
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-text-main text-white text-xs rounded p-2 shadow-xl">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-blue-200">Doanh thu: {payload[0].value.toLocaleString()} ₫</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth font-display bg-background-body text-text-main">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-main">Chào mừng trở lại, Quản lý 👋</h1>
            <p className="text-text-secondary text-sm mt-1">Dưới đây là báo cáo hoạt động trong ngày hôm nay.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <select className="appearance-none bg-surface-white border border-border-light text-text-main py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
                <option>Hôm nay: 6/1</option>
                <option>Hôm qua</option>
                <option>7 ngày qua</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất Báo Cáo
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-surface-white border border-border-light p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-50 text-primary rounded-lg">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm font-medium">Doanh thu hôm nay</p>
            <h3 className="text-2xl font-bold text-text-main mt-1">15.200.000 ₫</h3>
          </div>
          
          {/* Card 2 */}
          <div className="bg-surface-white border border-border-light p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm font-medium">Tổng số đơn hàng</p>
            <h3 className="text-2xl font-bold text-text-main mt-1">145</h3>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-white border border-border-light p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                <span className="material-symbols-outlined">group_add</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm font-medium">Khách hàng mới</p>
            <h3 className="text-2xl font-bold text-text-main mt-1">32</h3>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-white border border-border-light p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
                <span className="material-symbols-outlined">timer</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm font-medium">Thời gian chờ TB</p>
            <h3 className="text-2xl font-bold text-text-main mt-1">4m 12s</h3>
          </div>
        </div>

        {/* --- CHART SECTION --- */}
        <div className="bg-surface-white border border-border-light rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="text-lg font-bold text-text-main">Biểu đồ Doanh thu Theo Giờ</h3>
              <p class="text-sm text-text-secondary mt-1">So sánh hiệu suất bán hàng trong ngày</p>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataChart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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

        {/* --- BOTTOM SECTION (TABLE & NOTIFICATIONS) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Top 5 Products Table */}
          <div className="lg:col-span-2 bg-surface-white border border-border-light rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-5 border-b border-border-light flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-text-main">Top 5 Món Bán Chạy</h3>
              <a className="text-sm text-primary hover:text-primary-hover font-semibold hover:underline" href="#">Xem tất cả</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-text-secondary font-semibold uppercase text-xs border-b border-border-light">
                  <tr>
                    <th className="px-5 py-4">Món ăn</th>
                    <th className="px-5 py-4">Danh mục</th>
                    <th className="px-5 py-4 text-right">Đã bán</th>
                    <th className="px-5 py-4 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-cover bg-center shadow-sm border border-border-light" style={{ backgroundImage: `url('${product.img}')` }}></div>
                          <span className="font-semibold text-text-main">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-text-secondary">{product.cat}</td>
                      <td className="px-5 py-4 text-right text-text-main font-semibold">{product.sold}</td>
                      <td className="px-5 py-4 text-right font-bold text-primary">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="bg-surface-white border border-border-light rounded-xl p-5 flex flex-col shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-main">Thông báo</h3>
              <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full">3 Mới</span>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] flex-1 pr-1">
              {/* Notification 1 */}
              <div className="flex gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100 group hover:bg-red-50 hover:shadow-sm transition-all cursor-pointer relative">
                <div className="absolute top-3 right-3 size-2 bg-red-500 rounded-full"></div>
                <div className="size-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-text-main">Khoai tây chiên sắp hết</p>
                  <p className="text-xs text-text-secondary line-clamp-2">Kho còn dưới 2kg. Vui lòng nhập thêm hàng ngay.</p>
                  <span className="text-[10px] text-text-secondary mt-1 font-medium">10 phút trước</span>
                </div>
              </div>

              {/* Notification 2 */}
              <div className="flex gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100 group hover:bg-amber-50 hover:shadow-sm transition-all cursor-pointer">
                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                  <span className="material-symbols-outlined text-[20px]">timer</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-text-main">Đơn #2024 quá hạn</p>
                  <p className="text-xs text-text-secondary line-clamp-2">Đơn hàng đã chờ hơn 20 phút. Kiểm tra bếp.</p>
                  <span className="text-[10px] text-text-secondary mt-1 font-medium">Vừa xong</span>
                </div>
              </div>

              {/* Notification 3 */}
              <div className="flex gap-3 p-3 rounded-lg bg-white border border-border-light group hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[20px]">star</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-text-main">Đánh giá 5 sao mới</p>
                  <p className="text-xs text-text-secondary line-clamp-2">Khách hàng hài lòng về món Burger Bò.</p>
                  <span className="text-[10px] text-text-secondary mt-1 font-medium">1 giờ trước</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2.5 text-xs text-text-secondary hover:text-primary border border-border-light rounded-lg hover:bg-slate-50 transition-colors font-semibold">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;