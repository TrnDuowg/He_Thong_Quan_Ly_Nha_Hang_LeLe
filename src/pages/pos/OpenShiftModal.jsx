import React, { useState } from 'react';
import { User, Clock, Calendar, CheckCircle, X, Banknote } from 'lucide-react';

const OpenShiftModal = ({ isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleQuickAmount = (val) => {
    // Xóa dấu chấm cũ, cộng thêm, rồi format lại
    const currentVal = parseInt(amount.replace(/\./g, '') || 0);
    const newVal = currentVal + val;
    setAmount(newVal.toLocaleString('vi-VN'));
  };

  const handleInputChange = (e) => {
    // Chỉ cho nhập số
    const rawValue = e.target.value.replace(/\D/g, '');
    setAmount(Number(rawValue).toLocaleString('vi-VN'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop mờ + Hình nền nhà hàng */}
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
                Nguyễn Văn A
              </div>
            </div>
            <div className="grid grid-cols-[35%_1fr] border-b border-slate-200">
              <div className="px-4 py-3 bg-slate-100 text-sm font-medium text-slate-500 flex items-center gap-2">
                <Clock size={16} /> Ca làm việc
              </div>
              <div className="px-4 py-3 bg-white text-sm font-semibold text-slate-900">
                Ca Sáng (06:00 - 14:00)
              </div>
            </div>
            <div className="grid grid-cols-[35%_1fr]">
              <div className="px-4 py-3 bg-slate-100 text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar size={16} /> Ngày
              </div>
              <div className="px-4 py-3 bg-white text-sm font-semibold text-slate-900">
                24/10/2023
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
              {[500000, 1000000, 2000000].map((val) => (
                <button 
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="flex-1 min-w-[100px] h-10 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-transparent hover:bg-blue-50 hover:border-blue-500 transition-colors text-sm font-medium text-slate-600 hover:text-blue-600"
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
              HỦY
            </button>
            <button 
              onClick={() => onConfirm(amount)}
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