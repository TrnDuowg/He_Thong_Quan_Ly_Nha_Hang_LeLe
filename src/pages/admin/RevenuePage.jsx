import React from 'react';
import { 
  Filter, Calendar, User, CreditCard, CheckSquare, 
  Printer, Download, DollarSign, Receipt, ShoppingBasket, 
  Percent, MoreHorizontal, Search, Eye, TrendingUp, TrendingDown,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const RevenuePage = () => {

  // --- MOCK DATA ---
  const summaryCards = [
    { 
      title: 'Tổng doanh thu', 
      value: '125.430.000 VND', 
      icon: DollarSign, 
      color: 'blue', 
      trend: '+12.5%', 
      isUp: true 
    },
    { 
      title: 'Tổng số đơn', 
      value: '1,240', 
      icon: Receipt, 
      color: 'indigo', 
      trend: '+5.2%', 
      isUp: true 
    },
    { 
      title: 'Giá trị đơn trung bình', 
      value: '101.153 VND', 
      icon: ShoppingBasket, 
      color: 'orange', 
      trend: '-1.8%', 
      isUp: false 
    },
    { 
      title: 'Tổng thuế VAT', 
      value: '10.200.000 VND', 
      icon: Percent, 
      color: 'purple', 
      trend: null, 
      isUp: null 
    },
  ];

  const invoices = [
    { id: '#INV-00124', time: '10:32 AM', staff: 'Nguyễn Văn A', area: 'Bàn 04', method: 'Tiền mặt', methodColor: 'blue', total: '245.000 VND' },
    { id: '#INV-00123', time: '10:28 AM', staff: 'Trần Thị B', area: 'Mang về', method: 'Banking', methodColor: 'sky', total: '1.050.000 VND' },
    { id: '#INV-00122', time: '10:15 AM', staff: 'Nguyễn Văn A', area: 'Bàn 12', method: 'Thẻ', methodColor: 'amber', total: '560.000 VND' },
    { id: '#INV-00121', time: '10:05 AM', staff: 'Lê Văn C', area: 'Giao hàng', method: 'Ví', methodColor: 'rose', total: '185.000 VND' },
    { id: '#INV-00120', time: '09:55 AM', staff: 'Trần Thị B', area: 'Bàn 02', method: 'Tiền mặt', methodColor: 'blue', total: '95.000 VND' },
  ];

  // Config màu sắc cho icon và background
  const colorMap = {
    blue:   { bg: 'bg-blue-50', text: 'text-blue-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    sky:    { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200' },
    amber:  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    rose:   { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      
      {/* --- LEFT SIDEBAR: BỘ LỌC --- */}
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col h-full shrink-0 z-10 shadow-sm overflow-y-auto">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 sticky top-0 z-20">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Filter size={20} className="text-blue-600" />
            Bộ Lọc
          </h3>
          <button className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors hover:underline">
            Đặt lại
          </button>
        </div>
        
        <div className="flex-1 p-6 flex flex-col gap-6">
          {/* Filter Time */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-bold">Khoảng thời gian</label>
            <div className="relative group">
              <select className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 text-sm h-11 pl-4 pr-10 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer outline-none appearance-none">
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="week">7 ngày qua</option>
                <option value="month">Tháng này</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-600 transition-colors">
                <Calendar size={20} />
              </div>
            </div>
          </div>

          {/* Filter Employee */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-bold">Nhân viên</label>
            <div className="relative group">
              <select className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 text-sm h-11 pl-4 pr-10 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer outline-none appearance-none">
                <option value="all">Tất cả nhân viên</option>
                <option value="1">Nguyễn Văn A</option>
                <option value="2">Trần Thị B</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-600 transition-colors">
                <User size={20} />
              </div>
            </div>
          </div>

          {/* Filter Channel */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-bold">Kênh bán hàng</label>
            <div className="space-y-2">
              {['Tại quán', 'Mang về', 'Giao hàng'].map((channel, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer transition-all hover:bg-blue-50/50 hover:border-blue-200 group">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 size-4.5 bg-slate-50" />
                  <span className="text-sm font-medium text-slate-900">{channel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter Payment */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 text-sm font-bold">Thanh toán</label>
            <div className="relative group">
              <select className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 text-sm h-11 pl-4 pr-10 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer outline-none appearance-none">
                <option value="all">Tất cả phương thức</option>
                <option value="cash">Tiền mặt</option>
                <option value="card">Thẻ ngân hàng</option>
                <option value="qr">Chuyển khoản / QR</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-blue-600 transition-colors">
                <CreditCard size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-white shrink-0 sticky bottom-0">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]">
            <CheckSquare size={20} />
            Áp dụng
          </button>
        </div>
      </aside>

      {/* --- RIGHT CONTENT: REPORT --- */}
      <main className="flex-1 flex flex-col p-6 lg:p-10 gap-8 overflow-y-auto bg-slate-50">
        
        {/* Header & Breadcrumb */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Trang chủ</a>
            <span className="text-slate-500">/</span>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Báo cáo</a>
            <span className="text-slate-500">/</span>
            <span className="text-slate-900 font-medium">Doanh thu</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-tight">Báo Cáo Doanh Thu</h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:text-blue-600 hover:bg-white hover:border-blue-600 transition-all text-sm font-bold shadow-sm bg-white">
                <Printer size={18} /> In báo cáo
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white border border-transparent hover:bg-blue-700 transition-colors text-sm font-bold shadow-md shadow-blue-100">
                <Download size={18} /> Xuất Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            const styles = colorMap[card.color];
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg transition-colors ${styles.bg} ${styles.text}`}>
                    <Icon size={24} />
                  </div>
                  {card.trend && (
                    <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full border ${card.isUp ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-500 bg-rose-50 border-rose-100'}`}>
                      {card.trend}
                      {card.isUp ? <TrendingUp size={14} className="ml-1"/> : <TrendingDown size={14} className="ml-1"/>}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
              </div>
            );
          })}
        </div>

        {/* Charts & Table Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Pie Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-lg text-slate-900">Doanh thu theo HTTT</h4>
              <button className="text-slate-500 hover:text-blue-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="flex items-center justify-center flex-1 py-4">
              <div className="relative size-48 md:size-56">
                {/* CSS Conic Gradient Pie Chart */}
                <div 
                  className="w-full h-full rounded-full"
                  style={{
                    background: 'conic-gradient(#2563eb 0% 45%, #0ea5e9 45% 70%, #f59e0b 70% 85%, #ef4444 85% 100%)'
                  }}
                ></div>
                <div className="absolute inset-4 md:inset-6 flex flex-col items-center justify-center z-10 shadow-inner bg-white rounded-full">
                  <span className="text-slate-500 text-sm">Tổng cộng</span>
                  <span className="text-slate-900 font-bold text-lg">100%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: 'Tiền mặt', color: '#2563eb', val: '45%' },
                { label: 'Chuyển khoản/QR', color: '#0ea5e9', val: '25%' },
                { label: 'Thẻ tín dụng', color: '#f59e0b', val: '15%' },
                { label: 'Ví điện tử', color: '#ef4444', val: '15%' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="size-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-lg text-slate-900">Bảng chi tiết từng hóa đơn</h4>
              <div className="relative w-64">
                <input className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400 transition-shadow outline-none" placeholder="Tìm kiếm mã HĐ..." type="text"/>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['Mã HĐ', 'Thời gian', 'Nhân viên', 'Khu vực', 'HTTT', 'Tổng tiền', ''].map((head, i) => (
                      <th key={i} className={`py-3 px-4 text-xs font-semibold uppercase text-slate-500 whitespace-nowrap ${head === 'Tổng tiền' ? 'text-right' : ''}`}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {invoices.map((inv, idx) => {
                     const methodStyle = colorMap[inv.methodColor] || colorMap.blue;
                     return (
                      <tr key={idx} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                        <td className="py-4 px-4 font-medium text-blue-600">{inv.id}</td>
                        <td className="py-4 px-4 text-slate-500">{inv.time}</td>
                        <td className="py-4 px-4 text-slate-900">{inv.staff}</td>
                        <td className="py-4 px-4 text-slate-500">{inv.area}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium border ${methodStyle.bg} ${methodStyle.text} ${methodStyle.border || 'border-transparent'}`}>
                            {inv.method}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900 text-right">{inv.total}</td>
                        <td className="py-4 px-4 text-right">
                          <Eye size={18} className="text-slate-400 hover:text-blue-600 transition-colors inline-block" />
                        </td>
                      </tr>
                     );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">Hiển thị 5 trên 1240 đơn</span>
              <div className="flex gap-1">
                <button className="size-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                <button className="size-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-200">1</button>
                <button className="size-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all text-sm">2</button>
                <button className="size-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all text-sm">3</button>
                <span className="size-8 flex items-center justify-center text-slate-500">...</span>
                <button className="size-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default RevenuePage;