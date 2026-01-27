import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Phone, Lock, ArrowRight } from 'lucide-react';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false); // Chuyển đổi Login/Register
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });

  // Lấy trang mà người dùng muốn vào trước đó (VD: Delivery)
  const fromPage = location.state?.from || '/'; 
  const targetMode = location.state?.mode; // Chế độ họ chọn (delivery/reservation)

  const handleSubmit = async (e) => {
      e.preventDefault();
      const endpoint = isRegister ? 'register' : 'login';
      
      try {
          const res = await fetch(`http://localhost:3000/api/customers/${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          });
          const data = await res.json();

          if (res.ok) {
              if (isRegister) {
                  alert("Đăng ký thành công! Vui lòng đăng nhập.");
                  setIsRegister(false);
              } else {
                  // Đăng nhập thành công -> Lưu info
                  localStorage.setItem('customer_info', JSON.stringify(data.customer));
                  
                  // Chuyển hướng về trang họ muốn vào
                  if (targetMode === 'reservation') navigate('/reservation');
                  else if (targetMode === 'delivery') navigate('/menu'); // Delivery thì vào menu chọn món
                  else navigate('/');
              }
          } else {
              alert(data.message);
          }
      } catch (e) { alert("Lỗi kết nối"); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 justify-center max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-orange-600 mb-2">FastFood Lele</h1>
        <p className="text-slate-500">
            {isRegister ? 'Tạo tài khoản để tích điểm & đặt hàng' : 'Đăng nhập để tiếp tục'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
            <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                <User className="text-slate-400" />
                <input required placeholder="Họ tên của bạn" className="bg-transparent outline-none flex-1" 
                    onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
        )}
        <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
            <Phone className="text-slate-400" />
            <input required placeholder="Số điện thoại" className="bg-transparent outline-none flex-1" 
                onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
            <Lock className="text-slate-400" />
            <input required type="password" placeholder="Mật khẩu" className="bg-transparent outline-none flex-1" 
                onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>

        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 mt-4 flex justify-center items-center gap-2">
            {isRegister ? 'ĐĂNG KÝ NGAY' : 'ĐĂNG NHẬP'} <ArrowRight size={20}/>
        </button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={() => setIsRegister(!isRegister)} className="text-slate-500 font-medium text-sm hover:text-orange-600">
            {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
        </button>
      </div>
      
      <button onClick={() => navigate('/')} className="mt-8 text-center text-xs text-slate-400">
          Về trang chủ
      </button>
    </div>
  );
};

export default CustomerLogin;