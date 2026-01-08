import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, User, Lock, Eye, ArrowRight, HelpCircle } from 'lucide-react';

const POSLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic đăng nhập sẽ nằm ở đây
    navigate('/pos/dashboard'); // Chuyển hướng tạm thời
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-50 font-display overflow-hidden text-slate-900">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up">
        
        {/* Header Logo */}
        <div className="pt-10 pb-6 px-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl rotate-3 flex items-center justify-center mb-5 text-primary shadow-sm group transition-transform hover:rotate-6">
            <Utensils size={36} className="group-hover:-rotate-12 transition-transform duration-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FastFoodLeLe POS</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Đăng nhập để bắt đầu phiên bán hàng</p>
        </div>

        {/* Login Form */}
        <div className="px-8 pb-4">
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Tên đăng nhập</label>
              <div className="relative flex items-center group">
                <span className="absolute left-3.5 text-slate-400 group-focus-within:text-primary transition-colors flex items-center">
                  <User size={20} />
                </span>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 h-11 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none placeholder:text-slate-400 text-sm transition-all shadow-sm" 
                  placeholder="Nhập tên nhân viên" 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
              </div>
              <div className="relative flex items-center group">
                <span className="absolute left-3.5 text-slate-400 group-focus-within:text-primary transition-colors flex items-center">
                  <Lock size={20} />
                </span>
                <input 
                  type="password" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 h-11 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white focus:outline-none placeholder:text-slate-400 text-sm transition-all shadow-sm" 
                  placeholder="••••••" 
                />
                <button type="button" className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                  <Eye size={20} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-blue-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center mt-2 group"
            >
              <span className="mr-2">ĐĂNG NHẬP</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Divider - PIN Section */}
        <div className="px-8 py-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">hoặc Mã PIN</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>
        </div>

        {/* PIN Inputs */}
        <div className="px-8 pb-8">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <input 
                key={i}
                type="password" 
                maxLength="1" 
                placeholder="•"
                className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-sm hover:border-slate-300 placeholder:text-slate-300"
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
          <a href="#" className="text-xs font-medium text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1.5">
            <HelpCircle size={16} />
            Cần hỗ trợ kỹ thuật?
          </a>
        </div>

      </div>
    </div>
  );
};

export default POSLogin;