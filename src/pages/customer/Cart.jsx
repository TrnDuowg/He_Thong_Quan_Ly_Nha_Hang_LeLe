import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MapPin, Clock, User, Phone, Edit2, Ticket, ChevronRight, Trash2 } from 'lucide-react';

const Cart = () => {
  const [orderState] = useOutletContext(); // { mode: 'dine_in' | 'takeaway' | 'delivery', tableId }
  const navigate = useNavigate();

  // Mock
  const subTotal = 143000;
  const shippingFee = orderState.mode === 'delivery' ? 15000 : 0;
  const discount = 10000;
  const total = subTotal + shippingFee - discount;

  return (
    <div className="p-4 bg-slate-50 min-h-screen pb-32">
      <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tight">🛒 GIỎ HÀNG CỦA BẠN</h2>

      {/* 1. HEADER: LOẠI ĐƠN HÀNG */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
          <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hình thức</span>
              <button className="text-xs font-bold text-orange-600">THAY ĐỔI</button>
          </div>
          
          {orderState.mode === 'dine_in' && (
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><MapPin size={20}/></div>
                  <div>
                      <h4 className="font-bold text-slate-800">Ăn tại quán</h4>
                      <p className="text-xs text-slate-500">Tại bàn số <span className="font-bold text-blue-600 text-sm">#{orderState.tableId || '??'}</span></p>
                  </div>
              </div>
          )}

          {orderState.mode === 'takeaway' && (
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600"><Clock size={20}/></div>
                  <div className="flex-1">
                      <h4 className="font-bold text-slate-800">Đến lấy mang về</h4>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">Lấy lúc:</span>
                          <select className="bg-slate-100 text-xs font-bold rounded px-2 py-1 outline-none">
                              <option>Ngay khi xong (15p)</option>
                              <option>17:30 Hôm nay</option>
                          </select>
                      </div>
                  </div>
              </div>
          )}

          {orderState.mode === 'delivery' && (
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><MapPin size={20}/></div>
                  <div className="flex-1">
                      <h4 className="font-bold text-slate-800">Giao hàng tận nơi</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                  <Edit2 size={16} className="text-slate-400"/>
              </div>
          )}
      </div>

      {/* 2. THÔNG TIN KHÁCH (Chỉ hiện cho Takeaway/Delivery) */}
      {orderState.mode !== 'dine_in' && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
              <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-400" />
                  <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">Anh Nam</p>
                      <p className="text-xs text-slate-500">0909123456</p>
                  </div>
                  <button className="text-xs font-bold text-slate-400">SỬA</button>
              </div>
          </div>
      )}

      {/* 3. DANH SÁCH MÓN */}
      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-slate-100">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">Món đã chọn</div>
          {[1, 2].map((item) => (
              <div key={item} className="p-4 border-b border-slate-50 last:border-0 flex gap-3">
                  <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 mt-0.5">1</div>
                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 text-sm">Burger Bò Vừa</h4>
                          <span className="font-bold text-slate-700 text-sm">75.000đ</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">+ Phô mai, Không hành</p>
                      <div className="flex gap-4 mt-3">
                          <button className="text-xs font-bold text-blue-600 flex items-center gap-1"><Edit2 size={12}/> Sửa</button>
                          <button className="text-xs font-bold text-red-500 flex items-center gap-1"><Trash2 size={12}/> Xóa</button>
                      </div>
                  </div>
              </div>
          ))}
          <div className="p-3 text-center border-t border-slate-50">
              <button className="text-sm font-bold text-orange-600" onClick={() => navigate('/menu')}>+ Thêm món khác</button>
          </div>
      </div>

      {/* 4. KHUYẾN MÃI & THANH TOÁN */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Ticket size={18} className="text-orange-500" /> Mã khuyến mãi
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
                  Nhập mã <ChevronRight size={14}/>
              </div>
          </div>
          <div className="pt-3 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                  <span>Tạm tính</span>
                  <span>{subTotal.toLocaleString()}đ</span>
              </div>
              {shippingFee > 0 && (
                  <div className="flex justify-between text-sm text-slate-500">
                      <span>Phí ship</span>
                      <span>{shippingFee.toLocaleString()}đ</span>
                  </div>
              )}
              <div className="flex justify-between text-sm text-green-600">
                  <span>Khuyến mãi</span>
                  <span>-{discount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-800 pt-2 border-t border-slate-50 mt-2">
                  <span>TỔNG CỘNG</span>
                  <span className="text-orange-600">{total.toLocaleString()}đ</span>
              </div>
          </div>
      </div>

      {/* 5. FOOTER FIXED */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-50 max-w-md mx-auto">
          <div className="flex gap-3">
              <div className="flex-1">
                  <p className="text-xs text-slate-500">Thanh toán bằng</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1">💵 Tiền mặt <ChevronRight size={14}/></p>
              </div>
              <button 
                onClick={() => navigate('/tracking')}
                className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition-transform"
              >
                  {orderState.mode === 'dine_in' ? 'GỬI BẾP' : 'ĐẶT HÀNG'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default Cart;