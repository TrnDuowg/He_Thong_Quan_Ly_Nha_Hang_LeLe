import React, { useState, useEffect } from 'react';
import { Save, Store, Receipt, Wifi, Percent } from 'lucide-react';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    store_name: '',
    address: '',
    phone: '',
    wifi_pass: '',
    tax_rate: 8
  });
  const [loading, setLoading] = useState(false);

  // 1. Load cấu hình hiện tại
  useEffect(() => {
    fetch('http://localhost:3000/api/settings')
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => console.error(err));
  }, []);

  // 2. Lưu cấu hình
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch('http://localhost:3000/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) alert("✅ Đã lưu cài đặt hệ thống!");
        else alert("Lỗi khi lưu");
    } catch (e) { alert("Lỗi kết nối"); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Cài Đặt Hệ Thống</h1>
            <p className="text-slate-500 text-sm">Thiết lập thông tin cửa hàng và quy tắc bán hàng</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
            <Save size={20} />
            {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Card 1: Thông tin cửa hàng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Store className="text-blue-600" size={20} />
                <h3 className="font-bold text-gray-800">Thông Tin Cửa Hàng</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng (Hiển thị trên Bill)</label>
                    <input 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.store_name}
                        onChange={e => setFormData({...formData, store_name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại / Hotline</label>
                    <input 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
            </div>
        </div>

        {/* Card 2: Cấu hình bán hàng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Receipt className="text-green-600" size={20} />
                <h3 className="font-bold text-gray-800">Cấu Hình Bán Hàng</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Percent size={16} /> Thuế VAT (%)
                    </label>
                    <input 
                        type="number"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none font-bold"
                        value={formData.tax_rate}
                        onChange={e => setFormData({...formData, tax_rate: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Áp dụng cho tất cả đơn hàng.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Wifi size={16} /> Mật khẩu Wifi (In trên Bill)
                    </label>
                    <input 
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                        value={formData.wifi_pass}
                        onChange={e => setFormData({...formData, wifi_pass: e.target.value})}
                    />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;