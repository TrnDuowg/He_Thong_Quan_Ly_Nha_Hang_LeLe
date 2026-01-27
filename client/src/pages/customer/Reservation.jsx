import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Users, Phone, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

const Reservation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().slice(0, 10), // Mặc định hôm nay
    time: '19:00',
    guests: 2,
    note: ''
  });

  // Tự động điền thông tin nếu đã đăng nhập
  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem('customer_info'));
    if (customer) {
        setFormData(prev => ({
            ...prev,
            name: customer.name,
            phone: customer.phone
        }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert("✅ Đặt bàn thành công! Nhà hàng sẽ sớm liên hệ xác nhận.");
            navigate('/'); // Về trang chủ
        } else {
            alert("❌ Lỗi đặt bàn, vui lòng thử lại.");
        }
    } catch (error) {
        alert("Lỗi kết nối Server");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white flex flex-col">
      
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => navigate('/')} className="text-slate-600"><ArrowLeft /></button>
        <h1 className="font-bold text-lg text-slate-800">Đặt Bàn Trước</h1>
      </div>

      {/* Form */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6 text-sm text-orange-800">
            <p className="font-bold mb-1">🎉 Ưu đãi đặt trước:</p>
            <p>Giữ chỗ miễn phí trong 30 phút. Vui lòng đến đúng giờ để được phục vụ tốt nhất.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Hàng 1: Tên & SĐT */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <User size={18} className="text-blue-500" /> Họ và tên
                    </label>
                    <input 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Nhập tên của bạn"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Phone size={18} className="text-green-500" /> Số điện thoại
                    </label>
                    <input 
                        required
                        type="tel"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
            </div>

            {/* Hàng 2: Ngày & Giờ */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Calendar size={18} className="text-orange-500" /> Ngày
                    </label>
                    <input 
                        required
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Clock size={18} className="text-purple-500" /> Giờ
                    </label>
                    <input 
                        required
                        type="time"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                </div>
            </div>

            {/* Hàng 3: Số khách */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Users size={18} className="text-red-500" /> Số lượng khách
                </label>
                <div className="flex gap-3">
                    {[2, 4, 6, 8, 10].map(num => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setFormData({...formData, guests: num})}
                            className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                                formData.guests === num 
                                ? 'bg-red-500 text-white border-red-500 shadow-md' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <input 
                    type="number"
                    className="w-full mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Hoặc nhập số khác..."
                    value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                />
            </div>

            {/* Ghi chú */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText size={18} className="text-gray-500" /> Ghi chú (Tùy chọn)
                </label>
                <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-gray-400 h-24 resize-none"
                    placeholder="VD: Cần ghế trẻ em, tổ chức sinh nhật..."
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                ></textarea>
            </div>

            <div className="pt-4 pb-10">
                <button 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-xl shadow-blue-200 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:bg-slate-300"
                >
                    {loading ? 'Đang gửi...' : (
                        <>
                            <CheckCircle size={20} />
                            XÁC NHẬN ĐẶT BÀN
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Reservation;