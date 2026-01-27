import React, { useState, useEffect } from 'react';
import { 
  QrCode, LogOut, ChevronRight, History, Gift, 
  CreditCard, Settings, HelpCircle, UserCircle, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  // 1. Kiểm tra dữ liệu khi vào trang
  useEffect(() => {
    const savedInfo = localStorage.getItem('customer_info');
    if (savedInfo) {
        setCustomer(JSON.parse(savedInfo));
    }
  }, []);

  // Hàm đăng xuất
  const handleLogout = () => {
    if (window.confirm("Bạn chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem('customer_info');
        localStorage.removeItem('customer_cart');
        setCustomer(null);
        navigate('/'); // Về trang chủ
    }
  };

  // --- TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP ---
  if (!customer) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center pb-20">
            <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                <UserCircle size={48} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Xin chào!</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                Đăng nhập để tích điểm, đổi quà và theo dõi đơn hàng dễ dàng hơn.
            </p>
            
            <button 
                onClick={() => navigate('/customer/login', { state: { from: '/profile' } })}
                className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
                Đăng nhập / Đăng ký <ArrowRight size={20} />
            </button>
        </div>
      );
  }

  // --- TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP ---
  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-24">
      
      {/* Header Profile & Member Card */}
      <div className="bg-white pb-8 rounded-b-[2.5rem] shadow-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-50 to-white z-0"></div>
          
          <div className="relative z-10 px-6 pt-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md">
                    {/* Tạo avatar tự động theo tên khách hàng */}
                    <img 
                        src={`https://ui-avatars.com/api/?name=${customer.name}&background=0ea5e9&color=fff&size=128`} 
                        className="w-full h-full object-cover" 
                        alt="Avatar" 
                    />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800">{customer.name}</h2>
                    <p className="text-xs text-slate-500">{customer.phone}</p>
                </div>
            </div>
            
            {/* Card Tích điểm (Premium Look) */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-300 relative overflow-hidden group">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {customer.points > 1000 ? 'Gold Member' : 'Member'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Điểm tích lũy</p>
                        <h3 className="text-4xl font-black tracking-tight text-white">
                            {customer.points ? customer.points.toLocaleString() : '0'}
                        </h3>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-lg">
                        <QrCode className="text-slate-900" size={40} />
                    </div>
                </div>
                
                <div className="mt-6 flex justify-between items-end relative z-10">
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden max-w-[140px]">
                        <div className="h-full bg-yellow-500 rounded-full" style={{width: `${Math.min(customer.points / 20, 100)}%`}}></div>
                    </div>
                    <p className="text-[10px] text-slate-400">Đưa mã này cho nhân viên</p>
                </div>
                <p className="text-[10px] text-yellow-500 mt-2 font-medium">
                    Còn {Math.max(2000 - (customer.points || 0), 0)} điểm để lên Diamond
                </p>
            </div>
          </div>
      </div>

      {/* Menu Options */}
      <div className="p-4 -mt-2">
          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
              {[
                  { 
                      icon: History, 
                      label: 'Lịch sử đơn hàng', 
                      color: 'text-blue-500', bg: 'bg-blue-50', 
                      action: () => navigate('/tracking') // Chuyển sang trang danh sách đơn
                  },
                  { 
                      icon: Gift, 
                      label: 'Kho Voucher của tôi', 
                      badge: 'Mới', 
                      color: 'text-orange-500', bg: 'bg-orange-50', 
                      action: () => alert("Bạn chưa có voucher nào") 
                  },
                  { 
                      icon: CreditCard, 
                      label: 'Phương thức thanh toán', 
                      color: 'text-purple-500', bg: 'bg-purple-50', 
                      action: () => {} 
                  },
              ].map((item, i) => (
                  <div key={i} onClick={item.action} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer active:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color}`}>
                              <item.icon size={20} />
                          </div>
                          <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-red-200">{item.badge}</span>}
                          <ChevronRight size={18} className="text-slate-300" />
                      </div>
                  </div>
              ))}
          </div>

          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden mt-4">
              {[
                  { icon: Settings, label: 'Cài đặt tài khoản' },
                  { icon: HelpCircle, label: 'Trung tâm trợ giúp' },
              ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer active:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                              <item.icon size={20} />
                          </div>
                          <span className="font-medium text-slate-700 text-sm">{item.label}</span>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                  </div>
              ))}
              <div className="p-2">
                  <button 
                    onClick={handleLogout}
                    className="text-red-500 text-sm font-bold flex items-center justify-center gap-2 w-full py-3 hover:bg-red-50 rounded-2xl transition-colors"
                  >
                      <LogOut size={18} /> Đăng xuất
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Profile;