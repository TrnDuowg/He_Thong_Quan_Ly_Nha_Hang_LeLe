import React, { useState, useEffect } from 'react';
import { 
  Calendar, Download, Search, TrendingUp, TrendingDown, 
  FileText, DollarSign, AlertCircle, ChevronLeft, ChevronRight,
  X, User, Clock, Check, Banknote, CreditCard, QrCode
} from 'lucide-react';

// --- MODAL COMPONENT (Đã kết nối dữ liệu thật) ---
const ShiftReconciliationModal = ({ isOpen, onClose, shiftId }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load chi tiết ca khi mở Modal
  useEffect(() => {
    if (isOpen && shiftId) {
        setLoading(true);
        fetch(`http://localhost:3000/api/shifts/${shiftId}`)
            .then(res => res.json())
            .then(data => {
                setDetail(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }
  }, [isOpen, shiftId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-white shrink-0">
          <h2 className="text-xl font-bold text-slate-900">Chi Tiết Ca Làm Việc #{shiftId}</h2>
          <button onClick={onClose}><X size={28} /></button>
        </div>

        {loading ? (
            <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
            <div className="p-8 overflow-y-auto">
                {/* Summary Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-500">Tiền đầu ca</span>
                        <span className="text-lg font-bold text-slate-900">
                            {Number(detail.shift.start_cash).toLocaleString()} ₫
                        </span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200"></div>
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-500">Doanh thu hệ thống</span>
                        <span className="text-lg font-bold text-slate-900">
                            {Number(detail.revenue).toLocaleString()} ₫
                        </span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200"></div>
                    <div className="flex flex-col">
                        <span className="text-sm text-slate-500">Số lượng đơn</span>
                        <span className="text-lg font-bold text-blue-600">
                            {detail.orders_count}
                        </span>
                    </div>
                </div>

                {/* Note: Phần bảng chi tiết tiền mặt/chuyển khoản cần API phức tạp hơn nên tạm thời giữ UI tĩnh hoặc ẩn đi */}
                <p className="text-center text-gray-400 italic">
                    (Tính năng đối soát chi tiết từng phương thức thanh toán đang phát triển)
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const ShiftPage = () => {
  const [shifts, setShifts] = useState([]);
  const [selectedShiftId, setSelectedShiftId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/shifts')
      .then(res => res.json())
      .then(setShifts)
      .catch(err => console.error(err));
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 relative">
      <div className="flex-1 flex flex-col min-h-full overflow-y-auto">
        <div className="px-6 lg:px-10 py-8">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Header Area */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 text-3xl md:text-3xl font-black leading-tight tracking-tight">Đối Soát Ca Làm Việc</h1>
              </div>
            </div>

            {/* Table Area */}
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase">Mã ca</th>
                        <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase">Nhân viên</th>
                        <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase">Bắt đầu</th>
                        <th className="px-6 py-4 text-left text-slate-500 text-xs font-semibold uppercase">Kết thúc</th>
                        <th className="px-6 py-4 text-right text-slate-500 text-xs font-semibold uppercase">Tiền đầu ca</th>
                        <th className="px-6 py-4 text-center text-slate-500 text-xs font-semibold uppercase">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {shifts.map((shift) => (
                          <tr 
                            key={shift.id} 
                            onClick={() => setSelectedShiftId(shift.id)}
                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-4 text-sm font-mono text-blue-600 font-bold">#{shift.id}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{shift.staff_name}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {formatTime(shift.start_time)} <span className="text-xs text-slate-400">({formatDate(shift.start_time)})</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {shift.end_time ? formatTime(shift.end_time) : <span className="text-green-600 font-bold">Đang hoạt động</span>}
                            </td>
                            <td className="px-6 py-4 text-sm text-right font-mono font-bold text-slate-700">
                                {Number(shift.start_cash).toLocaleString()} ₫
                            </td>
                            <td className="px-6 py-4 text-center">
                                {shift.end_time ? (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Đã đóng</span>
                                ) : (
                                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-bold">Đang mở</span>
                                )}
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ShiftReconciliationModal 
        isOpen={!!selectedShiftId} 
        onClose={() => setSelectedShiftId(null)} 
        shiftId={selectedShiftId} 
      />
    </div>
  );
};

export default ShiftPage;