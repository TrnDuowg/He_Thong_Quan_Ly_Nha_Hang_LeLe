import React from 'react';
import { 
  BadgeCheck, Calendar, Clock, DollarSign, 
  FileText, Save, Printer, X, Banknote, CreditCard, QrCode 
} from 'lucide-react';

const EndShift = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-display text-slate-900 pb-20 md:pb-0">
      
      {/* Header (Simplified for this page context) */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <DollarSign size={24} />
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">POS Bán Hàng</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-slate-800">Nguyễn Văn A</span>
            <span className="text-xs text-slate-500">Thu ngân</span>
          </div>
          <div className="size-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=Nguyen+Van+A" alt="Avatar" className="w-full h-full object-cover"/>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 md:px-8">
        <div className="w-full max-w-[1024px] flex flex-col gap-8">
          
          {/* Page Title & Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <BadgeCheck className="text-blue-600" size={32} />
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">CHỐT CA LÀM VIỆC</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-slate-600">
                <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <span className="font-semibold text-slate-900">Nhân viên:</span> Nguyễn Văn A
                </span>
                <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <Clock size={16} /> <span className="font-semibold text-slate-900">Ca:</span> Sáng (08:00 - 14:00)
                </span>
                <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  <Calendar size={16} /> <span className="font-semibold text-slate-900">Ngày:</span> 24/10/2023
                </span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col gap-1 relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={64} className="text-blue-600" />
              </div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Tổng doanh thu</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">8.500.000đ</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col gap-1 relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText size={64} className="text-blue-500" />
              </div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Số đơn hàng</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">45</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col gap-1 relative overflow-hidden group">
              <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BadgeCheck size={64} className="text-green-500" />
              </div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Tổng chênh lệch</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 tracking-tight">0đ</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Chuẩn
                </span>
              </div>
            </div>
          </div>

          {/* Reconciliation Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                Bảng đối soát doanh thu
              </h3>
              <span className="text-xs text-slate-500 italic">* Vui lòng kiểm đếm kỹ tiền mặt trước khi nhập</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">Phương thức</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4 text-right">Hệ thống (VNĐ)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4 text-right">Thực tế (VNĐ)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4 text-right">Chênh lệch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* Row 1: Cash */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-green-100 text-green-600">
                          <Banknote size={20} />
                        </div>
                        <span className="font-medium text-slate-900">Tiền mặt</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">5.000.000</td>
                    <td className="px-6 py-4 text-right">
                      <input className="w-full text-right bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:font-normal" placeholder="0" type="text"/>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center justify-center min-w-[80px] py-1 px-3 rounded-full text-sm font-bold bg-slate-100 text-slate-500">
                        -5.000.000
                      </span>
                    </td>
                  </tr>
                  {/* Row 2: Card */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-blue-100 text-blue-600">
                          <CreditCard size={20} />
                        </div>
                        <span className="font-medium text-slate-900">Thẻ ngân hàng</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">2.000.000</td>
                    <td className="px-6 py-4 text-right">
                      <input className="w-full text-right bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" type="text" defaultValue="2.000.000"/>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center justify-center min-w-[80px] py-1 px-3 rounded-full text-sm font-bold bg-green-100 text-green-700">
                        0
                      </span>
                    </td>
                  </tr>
                  {/* Row 3: QR */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-pink-100 text-pink-600">
                          <QrCode size={20} />
                        </div>
                        <span className="font-medium text-slate-900">Momo / QR Code</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-600">1.500.000</td>
                    <td className="px-6 py-4 text-right">
                      <input className="w-full text-right bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" type="text" defaultValue="1.500.000"/>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center justify-center min-w-[80px] py-1 px-3 rounded-full text-sm font-bold bg-green-100 text-green-700">
                        0
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FileText size={18} />
              Ghi chú cuối ca
            </label>
            <textarea 
              className="w-full min-h-[100px] resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400" 
              placeholder="Nhập ghi chú nếu có chênh lệch hoặc vấn đề phát sinh trong ca làm việc..."
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-slate-200">
            <button className="flex-1 sm:flex-none px-6 py-3 rounded-lg border border-transparent text-slate-500 hover:text-red-500 hover:bg-red-50 font-bold transition-all flex items-center justify-center gap-2 group">
              <X size={20} className="group-hover:scale-110 transition-transform" />
              HỦY BỎ
            </button>
            <div className="flex-1 flex flex-col sm:flex-row gap-4 justify-end">
              <button className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 active:bg-blue-100 transition-all flex items-center justify-center gap-2">
                <Save size={20} />
                LƯU TẠM
              </button>
              <button className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:translate-y-0.5 transition-all flex items-center justify-center gap-2">
                <Printer size={20} />
                KẾT THÚC & IN BÁO CÁO
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default EndShift;