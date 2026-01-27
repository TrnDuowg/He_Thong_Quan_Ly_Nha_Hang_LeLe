import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, User, Lock, Eye, EyeOff, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react';

const POSLogin = () => {
  const navigate = useNavigate();
  
  // 1. Khai báo State để lưu dữ liệu
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Để ẩn/hiện mật khẩu
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      // Chỉ xử lý khi status là 200 OK
      if (res.ok) {
        // Lấy dữ liệu user an toàn (chấp nhận cả user hoặc userInfo)
        const userData = data.user || data.userInfo;

        if (!userData) {
            setError("Lỗi dữ liệu từ Server (Thiếu thông tin User)");
            return;
        }

        // Lưu vào LocalStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Điều hướng dựa trên quyền (Dùng ?. để không bị crash nếu role thiếu)
        const role = userData?.role;

        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'kitchen') navigate('/kitchen/live');
        else if (role === 'pos') navigate('/pos/dashboard');
        else {
            // Trường hợp role lạ hoặc chưa phân quyền
            navigate('/pos/dashboard'); 
        }
      } else {
        // Nếu lỗi 401 hoặc khác -> Hiện thông báo từ server
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối Server');
    } finally {
      setIsLoading(false);
    }
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
          <div className="w-16 h-16 bg-blue-50 rounded-2xl rotate-3 flex items-center justify-center mb-5 text-blue-600 shadow-sm group transition-transform hover:rotate-6">
            <Utensils size={36} className="group-hover:-rotate-12 transition-transform duration-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">FastFoodLeLe POS</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Đăng nhập để bắt đầu phiên bán hàng</p>
        </div>

        {/* Error Message Notification */}
        {error && (
          <div className="mx-8 mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-pulse">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <div className="px-8 pb-4">
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Tên đăng nhập</label>
              <div className="relative flex items-center group">
                <span className="absolute left-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center">
                  <User size={20} />
                </span>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 h-11 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white focus:outline-none placeholder:text-slate-400 text-sm transition-all shadow-sm" 
                  placeholder="Nhập tên nhân viên" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
              </div>
              <div className="relative flex items-center group">
                <span className="absolute left-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors flex items-center">
                  <Lock size={20} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 h-11 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white focus:outline-none placeholder:text-slate-400 text-sm transition-all shadow-sm" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center mt-2 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                 <span className="flex items-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Đang xử lý...
                 </span>
              ) : (
                <>
                  <span className="mr-2">ĐĂNG NHẬP</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
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

        {/* PIN Inputs (Giữ giao diện, chưa có logic Backend cho PIN) */}
        <div className="px-8 pb-8">
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <input 
                key={i}
                type="password" 
                maxLength="1" 
                placeholder="•"
                className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all shadow-sm hover:border-slate-300 placeholder:text-slate-300"
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
          <a href="#" className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5">
            <HelpCircle size={16} />
            Cần hỗ trợ kỹ thuật?
          </a>
        </div>

      </div>
    </div>
  );
};

export default POSLogin;