import React from 'react';
import { CheckCircle, Clock, ChefHat, Truck, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderTracking = () => {
  const navigate = useNavigate();
  const currentStep = 2; // Mock status

  const steps = [
    { icon: CheckCircle, title: 'Đã xác nhận', time: '14:05' },
    { icon: ChefHat, title: 'Đang chuẩn bị', time: '14:10' },
    { icon: Truck, title: 'Đang giao hàng', time: '--:--' },
    { icon: Home, title: 'Giao thành công', time: '--:--' },
  ];

  return (
    <div className="p-6 bg-white min-h-screen font-display">
      {/* Header Status */}
      <div className="text-center mb-10 mt-4">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
              <Clock size={40} className="text-green-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase">Đang chuẩn bị</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium bg-slate-100 inline-block px-3 py-1 rounded-full">
            Dự kiến nhận món: <span className="text-slate-800 font-bold">14:40</span>
          </p>
      </div>

      {/* Timeline Fix */}
      <div className="max-w-sm mx-auto">
          {/* Container đường kẻ dọc: ml-6 để cách lề trái, border-l-2 làm trục */}
          <div className="border-l-2 border-slate-100 ml-6 space-y-8 pb-2">
              {steps.map((step, idx) => (
                  // Thêm pl-8 để đẩy nội dung chữ sang phải, tránh bị icon đè
                  <div key={idx} className="relative pl-8">
                      {/* Icon: -left-[17px] để căn giữa icon vào đường kẻ (Icon 32px / 2 = 16px + 1px border) */}
                      <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-all duration-500
                          ${idx <= currentStep 
                              ? 'bg-green-500 text-white shadow-lg shadow-green-200 scale-110' 
                              : 'bg-slate-200 text-slate-400'
                          }`}
                      >
                          <step.icon size={14} strokeWidth={3} />
                      </div>
                      
                      {/* Text Content */}
                      <div className={`transition-all duration-500 ${idx <= currentStep ? 'opacity-100 translate-x-0' : 'opacity-60'}`}>
                          <h4 className={`text-sm font-bold ${idx <= currentStep ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{step.time}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto">
          <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-slate-800 text-sm">Đơn hàng #DH-001</h4>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">COD 143k</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
              1x Burger Bò Vừa (Không hành), 1x Khoai tây chiên, 1x Coca Cola Tươi...
          </p>
          <div className="flex gap-3">
              <button className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  Gọi nhà hàng
              </button>
              <button onClick={() => navigate('/')} className="flex-1 bg-slate-800 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-slate-200 hover:bg-slate-700 transition-colors">
                  Về trang chủ
              </button>
          </div>
      </div>
    </div>
  );
};

export default OrderTracking;