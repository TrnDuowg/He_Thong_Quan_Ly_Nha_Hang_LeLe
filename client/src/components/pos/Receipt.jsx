import React, { useState, useEffect } from 'react';

const Receipt = ({ order, items, onClose }) => {
  // --- STATE CẤU HÌNH ---
  const [settings, setSettings] = useState({
      store_name: 'FastFood Store',
      address: 'Đang cập nhật địa chỉ...',
      phone: '---',
      wifi_pass: '---',
      tax_rate: 8
  });

  // --- 1. GỌI API LẤY THÔNG TIN CỬA HÀNG ---
  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/settings');
            const data = await res.json();
            // Nếu có dữ liệu thì cập nhật, không thì giữ mặc định
            if (data && data.store_name) {
                setSettings(data);
            }
        } catch (error) {
            console.error("Lỗi tải cấu hình hóa đơn:", error);
        }
    };
    fetchSettings();
  }, []);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[350px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* VÙNG IN (Sẽ hiển thị khi in) */}
        <div id="printable-receipt" className="p-6 text-slate-900 font-mono text-sm leading-relaxed">
            
            {/* --- HEADER: DỮ LIỆU ĐỘNG TỪ SETTINGS --- */}
            <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-4">
                <h2 className="text-xl font-black uppercase">{settings.store_name}</h2>
                <p>{settings.address}</p>
                <p>Hotline: {settings.phone}</p>
            </div>

            <div className="mb-4 text-xs">
                <p>Mã đơn: <b>{order.order_code}</b></p>
                <p>Ngày: {new Date().toLocaleString('vi-VN')}</p>
                {/* Lấy tên thu ngân từ localStorage nếu có, không thì để Admin */}
                <p>Thu ngân: {JSON.parse(localStorage.getItem('user'))?.full_name || 'Nhân viên'}</p>
            </div>

            <div className="border-b border-dashed border-slate-300 pb-2 mb-2">
                <div className="flex font-bold uppercase text-xs">
                    <span className="flex-1">Tên món</span>
                    <span className="w-8 text-center">SL</span>
                    <span className="w-16 text-right">Tiền</span>
                </div>
            </div>

            <div className="space-y-2 border-b border-dashed border-slate-300 pb-4 mb-4">
                {items.map((item, idx) => (
                    <div key={idx} className="flex">
                        <span className="flex-1">{item.name}</span>
                        <span className="w-8 text-center font-bold">{item.qty}</span>
                        <span className="w-16 text-right">{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-1 text-right text-xs">
                <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{Number(order.sub_total).toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                    <div className="flex justify-between">
                        <span>Giảm giá:</span>
                        <span>-{Number(order.discount).toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Thuế ({settings.tax_rate}%):</span>
                    <span>{Number(order.tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200 mt-2">
                    <span>TỔNG:</span>
                    <span>{Number(order.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-2">
                    <span>Khách đưa:</span>
                    <span>{Number(order.payment?.received || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tiền thừa:</span>
                    <span>{(Number(order.payment?.received || 0) - order.total_amount).toLocaleString()}</span>
                </div>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-dashed border-slate-300 italic text-xs">
                <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                {/* --- FOOTER: WIFI TỪ SETTINGS --- */}
                <p>Wifi Pass: {settings.wifi_pass}</p>
            </div>
        </div>

        {/* NÚT BẤM (Không in ra giấy) */}
        <div className="p-4 bg-slate-100 flex gap-2 print:hidden">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-white">Đóng</button>
            <button onClick={handlePrint} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg">🖨 IN HÓA ĐƠN</button>
        </div>

        {/* CSS Ẩn mọi thứ khác khi in, chỉ hiện hoá đơn */}
        <style>{`
            @media print {
                body * { visibility: hidden; }
                #printable-receipt, #printable-receipt * { visibility: visible; }
                #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
            }
        `}</style>
      </div>
    </div>
  );
};

export default Receipt;