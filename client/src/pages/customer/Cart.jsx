import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { MapPin, Clock, User, Edit2, Ticket, ChevronRight, Trash2, Plus } from 'lucide-react';

const Cart = () => {
  const [orderState] = useOutletContext(); // Context từ Layout
  const navigate = useNavigate();
  
  // State giỏ hàng
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  // 1. LOAD GIỎ HÀNG
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('customer_cart')) || [];
    setCart(savedCart);
  }, []);

  // Hàm xóa món
  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('customer_cart', JSON.stringify(newCart));
  };

  // 2. TÍNH TIỀN
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = orderState.mode === 'delivery' ? 15000 : 0;
  const discount = 0; // Tạm thời chưa có mã giảm giá
  const total = subTotal + shippingFee - discount;

  // 3. XỬ LÝ ĐẶT HÀNG
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // Validate thông tin nếu là giao hàng/mang về
    if (orderState.mode !== 'dine_in' && (!customerName || !phone)) {
        alert("Vui lòng nhập tên và số điện thoại!");
        return;
    }

    const orderData = {
        items: cart,
        total_amount: total,
        staff_id: 1, // Đơn online gán cho hệ thống
        // note: Lưu thông tin khách hàng vào note (vì DB chưa có bảng Customer riêng cho Guest)
        // Trong thực tế sẽ lưu vào bảng Orders các trường: customer_name, phone...
    };

    try {
        const res = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.removeItem('customer_cart'); // Xóa giỏ
            // Chuyển sang trang Tracking với mã đơn
            navigate(`/tracking?code=${data.order.order_code}`);
        } else {
            alert("Lỗi: " + data.message);
        }
    } catch (e) {
        alert("Lỗi kết nối Server");
    }
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen pb-32">
      <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tight">🛒 GIỎ HÀNG CỦA BẠN</h2>

      {/* 1. HEADER: LOẠI ĐƠN HÀNG */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
          <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hình thức</span>
              <button onClick={() => navigate('/')} className="text-xs font-bold text-orange-600">THAY ĐỔI</button>
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
                      <p className="text-xs text-slate-500">Chuẩn bị trong khoảng 15 phút</p>
                  </div>
              </div>
          )}

          {orderState.mode === 'delivery' && (
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><MapPin size={20}/></div>
                  <div className="flex-1">
                      <h4 className="font-bold text-slate-800">Giao hàng tận nơi</h4>
                      <p className="text-xs text-slate-500">Phí ship cố định: 15.000đ</p>
                  </div>
              </div>
          )}
      </div>

      {/* 2. THÔNG TIN KHÁCH (Input thật) */}
      {orderState.mode !== 'dine_in' && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100 space-y-3">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-2">
                  <User size={18} className="text-slate-400" />
                  <input 
                    className="flex-1 text-sm font-bold text-slate-800 outline-none placeholder:font-normal"
                    placeholder="Nhập tên của bạn"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs font-bold">📞</span>
                  <input 
                    className="flex-1 text-sm font-bold text-slate-800 outline-none placeholder:font-normal"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
              </div>
          </div>
      )}

      {/* 3. DANH SÁCH MÓN (Dữ liệu thật từ Cart) */}
      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-slate-100">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">Món đã chọn</div>
          
          {cart.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Chưa có món nào</div>
          ) : (
              cart.map((item, index) => (
                <div key={index} className="p-4 border-b border-slate-50 last:border-0 flex gap-3">
                    <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 mt-0.5">
                        {item.qty}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                            <span className="font-bold text-slate-700 text-sm">{(item.price * item.qty).toLocaleString()}đ</span>
                        </div>
                        {item.note && <p className="text-xs text-slate-500 mt-1 italic">Note: {item.note}</p>}
                        
                        <div className="flex gap-4 mt-3">
                            {/* Nút Xóa hoạt động thật */}
                            <button 
                                onClick={() => removeItem(index)}
                                className="text-xs font-bold text-red-500 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            >
                                <Trash2 size={12}/> Xóa
                            </button>
                        </div>
                    </div>
                </div>
              ))
          )}

          <div className="p-3 text-center border-t border-slate-50">
              <button 
                className="text-sm font-bold text-orange-600 flex items-center justify-center gap-1 w-full" 
                onClick={() => navigate('/menu')}
              >
                  <Plus size={16}/> Thêm món khác
              </button>
          </div>
      </div>

      {/* 4. THANH TOÁN */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-slate-100">
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
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className={`px-8 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center transition-transform active:scale-95 ${
                    cart.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-orange-600 text-white shadow-orange-200'
                }`}
              >
                  {orderState.mode === 'dine_in' ? 'GỬI ĐƠN' : 'ĐẶT HÀNG'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default Cart;