import React from 'react';
import { QrCode, LogOut, ChevronRight, History, Gift, CreditCard, Settings, HelpCircle } from 'lucide-react';

const Profile = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Header Profile & Member Card */}
      <div className="bg-white pb-8 rounded-b-[2.5rem] shadow-sm relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-50 to-white z-0"></div>
          
          <div className="relative z-10 px-6 pt-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-md">
                    <img src="https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random" className="w-full h-full" alt="Avatar" />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-slate-800">Nguyễn Văn A</h2>
                    <p className="text-xs text-slate-500">Thành viên từ 2023</p>
                </div>
            </div>
            
            {/* Card Tích điểm (Premium Look) */}
            <div className="bg-gradient-to-br from-slate-800 to-black rounded-3xl p-6 text-white shadow-xl shadow-slate-300 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Gold Member</span>
                        </div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Điểm tích lũy</p>
                        <h3 className="text-4xl font-black tracking-tight">1,250</h3>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl shadow-lg">
                        <QrCode className="text-slate-900" size={48} />
                    </div>
                </div>
                <div className="mt-6 flex justify-between items-end relative z-10">
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden max-w-[140px]">
                        <div className="h-full bg-yellow-500 w-3/4 rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-slate-400">Đưa mã này cho nhân viên</p>
                </div>
                <p className="text-[10px] text-yellow-500 mt-2 font-medium">Còn 250 điểm để lên Diamond</p>
            </div>
          </div>
      </div>

      {/* 2. Menu Options */}
      <div className="p-4 -mt-2">
          <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden">
              {[
                  { icon: History, label: 'Lịch sử đơn hàng', badge: '2', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { icon: Gift, label: 'Kho Voucher của tôi', badge: 'Mới', color: 'text-orange-500', bg: 'bg-orange-50' },
                  { icon: CreditCard, label: 'Phương thức thanh toán', badge: '', color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer active:bg-slate-100 transition-colors">
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
                  <button className="text-red-500 text-sm font-bold flex items-center justify-center gap-2 w-full py-3 hover:bg-red-50 rounded-2xl transition-colors">
                      <LogOut size={18} /> Đăng xuất
                  </button>
              </div>
          </div>
      </div>
      
      <div className="h-24"></div>
    </div>
  );
};

export default Profile;