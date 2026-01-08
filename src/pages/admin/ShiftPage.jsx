import React, { useState } from 'react';
import { 
  Calendar, Download, Search, TrendingUp, TrendingDown, 
  FileText, DollarSign, AlertCircle, ChevronLeft, ChevronRight,
  X, User, Clock, Check, Banknote, CreditCard, QrCode
} from 'lucide-react';

// --- MOCK DATA ---
const shiftsData = [
  { id: 'SHIFT-001', staff: 'Nguyễn Văn A', staffCode: 'NV', staffColor: 'blue', time: '08:00 - 14:00', date: '22/12/2025', expected: '5.000.000', actual: '4.950.000', diff: '-50.000', status: 'review', diffColor: 'text-red-600' },
  { id: 'SHIFT-002', staff: 'Trần Thị B', staffCode: 'TB', staffColor: 'green', time: '14:00 - 22:00', date: '21/12/2025', expected: '8.200.000', actual: '8.200.000', diff: '0', status: 'matched', diffColor: 'text-slate-400' },
  { id: 'SHIFT-003', staff: 'Lê Văn C', staffCode: 'LC', staffColor: 'orange', time: '08:00 - 14:00', date: '23/12/2025', expected: '4.500.000', actual: '4.500.000', diff: '0', status: 'matched', diffColor: 'text-slate-400' },
  { id: 'SHIFT-004', staff: 'Phạm Thị D', staffCode: 'PD', staffColor: 'pink', time: '14:00 - 22:00', date: '24/12/2025', expected: '9.000.000', actual: '9.100.000', diff: '+100.000', status: 'surplus', diffColor: 'text-blue-600' },
];

const invoicesData = [
  { id: '#ORD-0092', time: '12:45 PM', total: '120.000 ₫', method: 'Tiền mặt', color: 'green', status: 'ok' },
  { id: '#ORD-0091', time: '12:42 PM', total: '350.000 ₫', method: 'CK', color: 'blue', status: 'ok' },
  { id: '#ORD-0090', time: '12:30 PM', total: '50.000 ₫', method: 'Thẻ', color: 'purple', status: 'error' }, // Error item
  { id: '#ORD-0089', time: '12:15 PM', total: '120.000 ₫', method: 'Tiền mặt', color: 'green', status: 'ok' },
  { id: '#ORD-0088', time: '12:10 PM', total: '85.000 ₫', method: 'Tiền mặt', color: 'green', status: 'ok' },
];

// --- MODAL COMPONENT ---
const ShiftReconciliationModal = ({ isOpen, onClose, shift }) => {
  if (!isOpen || !shift) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700 shadow-sm`}>
              {shift.staffCode}
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-900">Đối Soát Chi Tiết - {shift.id}</h2>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1"><User size={16}/> {shift.staff}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="flex items-center gap-1"><Clock size={16}/> {shift.time} {shift.date}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* LEFT COLUMN: INPUTS */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 bg-white">
            
            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-slate-500">Tiền đầu ca</span>
                <span className="text-lg font-bold text-slate-900">1.000.000 ₫</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500">Doanh thu hệ thống</span>
                <span className="text-lg font-bold text-slate-900">5.000.000 ₫</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-500">Tổng lý thuyết</span>
                <span className="text-lg font-bold text-blue-600">6.000.000 ₫</span>
              </div>
            </div>

            {/* Payment Details Table */}
            <div className="flex flex-col gap-4">
              <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                <Banknote className="text-blue-600" size={24} />
                Chi tiết thanh toán
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-500 uppercase">Hạng mục</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-500 uppercase">Lý thuyết (VND)</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-500 uppercase w-[180px]">Thực tế (VND)</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-500 uppercase">Chênh lệch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="px-4 py-4 font-medium flex items-center gap-2 text-slate-900">
                        <Banknote className="text-green-600" size={18} /> Tiền mặt
                      </td>
                      <td className="px-4 py-4 text-right text-slate-500 font-mono">2.500.000</td>
                      <td className="px-4 py-4 text-right">
                        <input className="w-full bg-white border border-slate-200 rounded text-slate-900 text-right px-3 py-1.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono font-bold transition-all" type="text" defaultValue="2.450.000"/>
                      </td>
                      <td className="px-4 py-4 text-right text-red-600 font-mono font-bold">-50.000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium flex items-center gap-2 text-slate-900">
                        <QrCode className="text-blue-600" size={18} /> Chuyển khoản
                      </td>
                      <td className="px-4 py-4 text-right text-slate-500 font-mono">1.500.000</td>
                      <td className="px-4 py-4 text-right">
                        <input className="w-full bg-white border border-slate-200 rounded text-slate-900 text-right px-3 py-1.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono font-bold transition-all" type="text" defaultValue="1.500.000"/>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-400 font-mono font-bold">0</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 font-medium flex items-center gap-2 text-slate-900">
                        <CreditCard className="text-purple-600" size={18} /> Thẻ tín dụng
                      </td>
                      <td className="px-4 py-4 text-right text-slate-500 font-mono">1.000.000</td>
                      <td className="px-4 py-4 text-right">
                        <input className="w-full bg-white border border-slate-200 rounded text-slate-900 text-right px-3 py-1.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono font-bold transition-all" type="text" defaultValue="1.000.000"/>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-400 font-mono font-bold">0</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td className="px-4 py-3 text-slate-900 font-bold">Tổng cộng</td>
                      <td className="px-4 py-3 text-right text-slate-900 font-bold font-mono">5.000.000</td>
                      <td className="px-4 py-3 text-right text-slate-900 font-bold font-mono">4.950.000</td>
                      <td className="px-4 py-3 text-right text-red-600 font-bold font-mono">-50.000</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 font-bold text-sm">Ghi chú</label>
              <textarea 
                className="w-full h-24 bg-white border border-slate-200 rounded-lg p-3 text-slate-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none resize-none placeholder:text-slate-400 transition-all" 
                placeholder="Nhập lý do chênh lệch hoặc ghi chú cho quản lý..."
              ></textarea>
            </div>
          </div>

          {/* RIGHT COLUMN: INVOICE LIST */}
          <div className="w-full lg:w-[320px] bg-slate-50 border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-slate-900 font-bold flex-1 text-sm">Danh sách hóa đơn trong ca</h3>
              <span className="text-xs px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 shadow-sm ml-2 whitespace-nowrap">42 đơn</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {invoicesData.map((inv, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded border cursor-pointer group transition-all shadow-sm relative overflow-hidden ${
                    inv.status === 'error' 
                      ? 'bg-red-50/50 border-red-200 hover:border-red-400' 
                      : 'bg-white border-slate-200 hover:border-blue-500'
                  }`}
                >
                  {inv.status === 'error' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                  
                  <div className={`flex justify-between items-start mb-1 ${inv.status === 'error' ? 'pl-2' : ''}`}>
                    <span className={`font-mono text-xs font-bold ${inv.status === 'error' ? 'text-red-600' : 'text-slate-500 group-hover:text-blue-600'}`}>{inv.id}</span>
                    <span className="text-slate-900 font-mono text-xs font-bold">{inv.total}</span>
                  </div>
                  <div className={`flex justify-between items-center text-[11px] text-slate-400 ${inv.status === 'error' ? 'pl-2' : ''}`}>
                    <span>{inv.time}</span>
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${inv.color === 'green' ? 'bg-green-500' : inv.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'}`}></span> 
                      {inv.method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Trạng thái hiện tại:</span>
            <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold border border-red-200 text-xs">Chưa khớp</span>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
              Yêu cầu kiểm tra lại
            </button>
            <button className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center gap-2 active:scale-95 transform">
              <Check size={18} />
              Xác nhận ca
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const ShiftPage = () => {
  const [selectedShift, setSelectedShift] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'matched': return <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">Khớp</span>;
      case 'review': return <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">Cần xem xét</span>;
      case 'surplus': return <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold border border-yellow-100">Dư tiền</span>;
      default: return null;
    }
  };

  const getStaffColor = (color) => {
    const map = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
      green: { bg: 'bg-green-100', text: 'text-green-700' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-700' },
    };
    return map[color] || map.blue;
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 relative">
      <div className="flex-1 flex flex-col min-h-full overflow-y-auto">
        <div className="px-6 lg:px-10 py-8">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Header Area */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 text-3xl md:text-3xl font-black leading-tight tracking-tight">Đối Soát Ca Làm Việc</h1>
                <p className="text-slate-500 text-base font-normal">Quản lý và đối chiếu doanh thu theo ca làm việc của nhân viên</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 h-10 rounded-lg bg-white border border-slate-200 text-sm text-slate-500 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                  <Calendar size={20} />
                  <span>21/13/2025 - 27/12/2025</span>
                </div>
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors active:scale-95">
                  <Download size={20} />
                  <span className="truncate">Xuất Báo Cáo</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                <div className="absolute right-[-10px] top-[-10px] bg-blue-500/5 rounded-full p-8 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <FileText size={20} />
                  <span className="text-sm font-medium">Tổng số ca</span>
                </div>
                <p className="text-slate-900 text-3xl font-bold leading-tight">142</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <p className="text-green-600 text-sm font-medium">+5% so với tuần trước</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                <div className="absolute right-[-10px] top-[-10px] bg-blue-500/5 rounded-full p-8 blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <DollarSign size={20} />
                  <span className="text-sm font-medium">Tổng doanh thu</span>
                </div>
                <p className="text-slate-900 text-3xl font-bold leading-tight">850.000.000 ₫</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <p className="text-green-600 text-sm font-medium">+12% đạt chỉ tiêu</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 rounded-xl p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-red-300 transition-colors">
                <div className="absolute right-[-10px] top-[-10px] bg-red-500/5 rounded-full p-8 blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">Tổng chênh lệch</span>
                </div>
                <p className="text-slate-900 text-3xl font-bold leading-tight">-120.000 ₫</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown size={16} className="text-red-600" />
                  <p className="text-red-600 text-sm font-medium">-2% thất thoát</p>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="flex flex-col gap-4">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="flex w-full items-center rounded-lg h-11 border border-slate-200 bg-white focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all shadow-sm">
                  <div className="text-slate-400 pl-4 pr-2">
                    <Search size={20} />
                  </div>
                  <input className="flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 text-sm font-normal h-full" placeholder="Tìm kiếm theo tên nhân viên hoặc mã ca..."/>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider">Nhân viên</th>
                        <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider">Mã ca</th>
                        <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase tracking-wider">Thời gian</th>
                        <th className="px-6 py-4 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Tiền mặt lý thuyết</th>
                        <th className="px-6 py-4 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Tiền mặt thực tế</th>
                        <th className="px-6 py-4 text-right text-slate-500 text-xs font-semibold uppercase tracking-wider">Chênh lệch</th>
                        <th className="px-6 py-4 text-center text-slate-500 text-xs font-semibold uppercase tracking-wider">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {shiftsData.map((shift, idx) => {
                         const colorStyle = getStaffColor(shift.staffColor);
                         return (
                          <tr 
                            key={idx} 
                            onClick={() => setSelectedShift(shift)}
                            className="hover:bg-slate-50 transition-colors cursor-pointer group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${colorStyle.bg} ${colorStyle.text}`}>
                                  {shift.staffCode}
                                </div>
                                <span className="text-slate-900 text-sm font-medium group-hover:text-blue-600 transition-colors">{shift.staff}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{shift.id}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              <div className="flex flex-col">
                                <span className="text-slate-900">{shift.time}</span>
                                <span className="text-xs text-slate-400">{shift.date}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 text-right font-mono">{shift.expected} ₫</td>
                            <td className="px-6 py-4 text-sm text-slate-900 text-right font-mono font-bold">{shift.actual} ₫</td>
                            <td className={`px-6 py-4 text-sm text-right font-mono font-bold ${shift.diffColor}`}>{shift.diff} ₫</td>
                            <td className="px-6 py-4 flex justify-center">
                              {getStatusBadge(shift.status)}
                            </td>
                          </tr>
                         );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
                  <span className="text-sm text-slate-500">Hiển thị 1-4 trên 142 ca</span>
                  <div className="flex items-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50">
                      <ChevronLeft size={18} />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">1</button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 text-sm">2</button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 text-sm">3</button>
                    <span className="text-slate-400">...</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 text-sm">12</button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ShiftReconciliationModal 
        isOpen={!!selectedShift} 
        onClose={() => setSelectedShift(null)} 
        shift={selectedShift} 
      />
    </div>
  );
};

export default ShiftPage;