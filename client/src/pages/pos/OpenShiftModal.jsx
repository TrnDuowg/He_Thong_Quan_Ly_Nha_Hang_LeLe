import React, { useState, useEffect } from 'react';
import { User, Clock, Calendar, CheckCircle, X, Banknote } from 'lucide-react';

const OpenShiftModal = ({ isOpen, onClose, onOpenSuccess }) => {
  const [amount, setAmount] = useState('');
  const [currentUser, setCurrentUser] = useState({ full_name: 'Nhân viên', role: '' });
  const [currentDate, setCurrentDate] = useState(new Date());

  // 1. Lấy thông tin người dùng đang đăng nhập
  useEffect(() => {
    if (isOpen) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
        setCurrentDate(new Date());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Xử lý nhập số tiền (Format 1.000.000)
  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(Number(rawValue).toLocaleString('vi-VN'));
  };

  // Xử lý nút chọn nhanh
  const handleQuickAmount = (val) => {
    const currentVal = parseInt(amount.replace(/\./g, '') || 0);
    const newVal = currentVal + val;
    setAmount(newVal.toLocaleString('vi-VN'));
  };

  // 2. GỌI API MỞ CA
  const handleConfirm = async () => {
    if (!amount) {
        alert("Vui lòng nhập tiền đầu ca!");
        return;
    }

    const rawAmount = parseInt(amount.replace(/\./g, ''));
    
    // Lấy ID nhân viên từ localStorage (hoặc mặc định là 1 nếu quên đăng nhập)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { id: 1 };

    try {
        const res = await fetch('http://localhost:3000/api/shifts/open', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                staff_id: user.id,
                start_cash: rawAmount
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("✅ Mở ca thành công! Chúc bạn làm việc tốt.");
            
            // Lưu ID ca làm việc vào máy để sau này Kết ca (End Shift) biết mà đóng
            localStorage.setItem('current_shift_id', data.shift_id);
            
            // Gọi callback để báo cho trang cha biết là xong rồi
            if (onOpenSuccess) onOpenSuccess();
            onClose();
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (error) {
        alert("Không thể kết nối Server!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-0"></div>
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 p-6 bg-slate-50/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">Mở Ca Làm Việc</h2>
            <p className="text-sm text-slate-500">Xác nhận tiền mặt đầu ca để bắt đầu</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Info Table */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="grid grid-cols-[35%_1fr] border-b border-slate-200">
              <div className="px-4 py-3 bg-slate-100 text-sm font-medium text-slate-500 flex items-center gap-2">
                <User size={16} /> Nhân viên
              </div>
              <div className="px-4 py-3 bg-white text-sm font-semibold text-slate-900">
                {currentUser.full_name}
              </div>
            </div>
            <div className="grid grid-cols-[35%_1fr] border-b border-slate-200">
              <div className="px-4 py-3 bg-slate-100 text-sm font-medium text-slate-500 flex items-center gap-2">
                <Clock size={16} /> Thời gian
              </div>
              <div className="px-4 py-3 bg-white text-sm font-semibold text-slate-900">
                {currentDate.toLocaleTimeString('vi-VN')}
              </div>
            </div>
            <div className="grid grid-cols-[35%_1fr]">
              <div className="px-4 py-3 bg-slate-100 text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar size={16} /> Ngày
              </div>
              <div className="px-4 py-3 bg-white text-sm font-semibold text-slate-900">
                {currentDate.toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Tiền đầu ca <span className="text-slate-400 font-normal">(VNĐ)</span>
            </label>
            <div className="relative group">
              <input 
                autoFocus
                type="text" 
                value={amount}
                onChange={handleInputChange}
                className="block w-full rounded-xl border-slate-300 bg-white p-4 pl-12 text-right text-3xl font-bold tracking-tight text-slate-900 placeholder-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all outline-none"
                placeholder="0" 
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <Banknote size={28} />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              {[500000, 1000000, 2000000, 5000000].map((val) => (
                <button 
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="flex-1 min-w-[80px] h-10 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-transparent hover:bg-blue-50 hover:border-blue-500 transition-colors text-sm font-medium text-slate-600 hover:text-blue-600"
                >
                  +{val.toLocaleString('vi-VN')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-6 pt-4 border-t border-slate-100">
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-white border border-slate-200 text-slate-700 text-base font-bold tracking-wide hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              ĐỂ SAU
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white text-base font-bold tracking-wide shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              <CheckCircle size={20} />
              MỞ CA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OpenShiftModal;