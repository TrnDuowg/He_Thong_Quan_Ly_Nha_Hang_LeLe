import React, { useState, useEffect } from 'react';
import { BadgeCheck, Calendar, Clock, DollarSign, FileText, Printer, Banknote, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EndShift = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [shiftData, setShiftData] = useState(null); // Dữ liệu ca hiện tại
  const [actualCash, setActualCash] = useState(''); // Tiền thực tế nhập vào
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  // --- 1. LẤY THÔNG TIN CA HIỆN TẠI ---
  useEffect(() => {
    const fetchShiftInfo = async () => {
        const shiftId = localStorage.getItem('current_shift_id');
        if (!shiftId) {
            alert("Bạn chưa mở ca nào!");
            navigate('/pos/dashboard');
            return;
        }

        try {
            // Gọi API lấy chi tiết ca (đã viết ở bài trước: GET /api/shifts/:id)
            const res = await fetch(`http://localhost:3000/api/shifts/${shiftId}`);
            const data = await res.json();
            setShiftData(data); // data gồm: { shift: {...}, revenue: 5000000, orders_count: 10 }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchShiftInfo();
  }, []);

  // --- TÍNH TOÁN ---
  const startCash = Number(shiftData?.shift?.start_cash || 0);
  const systemRevenue = Number(shiftData?.revenue || 0);
  const expectedCash = startCash + systemRevenue; // Tổng tiền lý thuyết
  
  const actualCashNum = Number(actualCash.replace(/\./g, ''));
  const difference = actualCashNum - expectedCash;

  // --- 2. XỬ LÝ KẾT CA ---
  const handleEndShift = async () => {
    if (!actualCash) {
        alert("Vui lòng nhập tiền thực tế kiểm đếm được!");
        return;
    }

    if (!window.confirm("Bạn chắc chắn muốn kết thúc ca làm việc này?")) return;

    try {
        const shiftId = localStorage.getItem('current_shift_id');
        const res = await fetch('http://localhost:3000/api/shifts/close', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shift_id: shiftId,
                actual_cash: actualCashNum,
                note: note
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert(`✅ Kết ca thành công!\nChênh lệch: ${data.report.difference.toLocaleString()}đ`);
            localStorage.removeItem('current_shift_id'); // Xóa ca khỏi máy
            navigate('/pos/login'); // Quay về màn hình đăng nhập
        } else {
            alert(data.message);
        }
    } catch (e) { alert("Lỗi kết nối server"); }
  };

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu ca...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-slate-900 text-lg font-bold">POS Bán Hàng</h2>
        </div>
        <div className="font-bold text-slate-700">{shiftData?.shift?.staff_name}</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 md:px-8">
        <div className="w-full max-w-[1024px] flex flex-col gap-8">
          
          {/* Title */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="text-blue-600" size={32} />
                <h1 className="text-3xl font-black tracking-tight text-slate-900">CHỐT CA LÀM VIỆC</h1>
            </div>
            <div className="flex gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Clock size={16}/> Bắt đầu: {new Date(shiftData.shift.start_time).toLocaleString()}</span>
                <span className="flex items-center gap-1"><Calendar size={16}/> ID Ca: #{shiftData.shift.id}</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm font-bold uppercase">Doanh thu hệ thống</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{systemRevenue.toLocaleString()}đ</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm font-bold uppercase">Tiền đầu ca</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{startCash.toLocaleString()}đ</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm font-bold uppercase">Tổng tiền phải có</p>
              <p className="text-3xl font-black text-blue-600 mt-1">{expectedCash.toLocaleString()}đ</p>
            </div>
          </div>

          {/* Input Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 font-bold text-lg flex items-center gap-2">
                <Banknote className="text-green-600"/> Kiểm đếm tiền mặt
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-700">Tiền mặt thực tế trong két</span>
                    <input 
                        autoFocus
                        className="w-64 text-right text-2xl font-bold border-2 border-slate-300 rounded-lg p-2 focus:border-blue-600 outline-none"
                        placeholder="0"
                        value={actualCash ? Number(actualCash.replace(/\./g, '')).toLocaleString('vi-VN') : ''}
                        onChange={e => setActualCash(e.target.value.replace(/\D/g, ''))}
                    />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                    <span className="font-bold text-slate-500">Chênh lệch</span>
                    <span className={`text-xl font-black ${difference < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {difference > 0 ? '+' : ''}{difference.toLocaleString()}đ
                    </span>
                </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="font-bold text-slate-700 mb-2 block">Ghi chú</label>
            <textarea 
                className="w-full border border-slate-300 rounded-xl p-4 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nhập lý do chênh lệch (nếu có)..."
                value={note}
                onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button onClick={() => navigate('/pos/dashboard')} className="px-6 py-3 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50">
                HỦY BỎ
            </button>
            <button 
                onClick={handleEndShift}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg flex items-center gap-2"
            >
                <Printer size={20} /> KẾT CA & IN BÁO CÁO
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default EndShift;