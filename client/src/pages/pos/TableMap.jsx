import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, LayoutGrid, User, Clock, Armchair, DollarSign, 
  CalendarClock, X, PlusCircle, CreditCard, Phone, Calendar 
} from 'lucide-react';

const STATUS_CONFIG = {
  available: { color: 'slate', icon: Armchair, label: 'Trống', bg: 'bg-white', border: 'border-slate-200' },
  occupied: { color: 'emerald', icon: User, label: 'Có khách', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  reserved: { color: 'amber', icon: CalendarClock, label: 'Đặt trước', bg: 'bg-amber-50', border: 'border-amber-200' },
};
// --- MODAL CHI TIẾT BÀN ---
const TableDetailModal = ({ table, onClose, onAction }) => {
  const [bookingData, setBookingData] = useState({ name: '', phone: '', time: '', guests: 2 });
  const [mode, setMode] = useState('view'); 

  if (!table) return null;

  // Xử lý logic hiển thị theo trạng thái
  const isOccupied = table.status === 'occupied';
  const isReserved = table.status === 'reserved';
  const isAvailable = table.status === 'available';

const handleBookingSubmit = async () => {
      // 1. Validate
      if (!bookingData.name || !bookingData.phone || !bookingData.time) {
          alert("Vui lòng nhập tên, SĐT và giờ đến!");
          return;
      }

      try {
          // 2. Gọi API
          const res = await fetch('http://localhost:3000/api/reservations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  ...bookingData,
                  table_id: table.id,
                  // Tự động thêm ngày hôm nay nếu form không có chọn ngày
                  date: new Date().toISOString().slice(0, 10) 
              })
          });

          const data = await res.json();

          if (res.ok) {
              alert(`✅ Đặt bàn thành công cho khách: ${bookingData.name}`);
              onClose();
              // Refresh lại sơ đồ bàn (nếu component cha có prop reload, hoặc reload trang)
              window.location.reload(); 
          } else {
              alert("❌ Lỗi: " + data.message);
          }
      } catch (e) { 
          alert("Lỗi kết nối Server"); 
      }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center size-10 rounded-full ${isOccupied ? 'bg-emerald-100 text-emerald-600' : isReserved ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'}`}>
              {isOccupied ? <User size={20}/> : isReserved ? <CalendarClock size={20}/> : <Armchair size={20}/>}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{table.name}</h3>
              <p className={`text-xs font-bold ${isOccupied ? 'text-emerald-600' : isReserved ? 'text-amber-600' : 'text-slate-500'}`}>
                 {isOccupied ? 'Đang phục vụ' : isReserved ? 'Đã đặt trước' : 'Bàn trống'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          
          {/* TRƯỜNG HỢP 1: BÀN CÓ KHÁCH (Occupied) */}
          {isOccupied && (
            <div className="space-y-6">
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Tổng tiền tạm tính</p>
                        <p className="text-2xl font-black text-emerald-700">{Number(table.current_total || 0).toLocaleString()}đ</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Số món</p>
                        <p className="text-xl font-bold text-emerald-700">{table.item_count || 0}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
          {/* NÚT 1: GỌI THÊM MÓN -> Truyền action 'order' */}
          <button 
              onClick={() => onAction('order')} 
              className="flex flex-col items-center justify-center gap-1 rounded-lg bg-blue-600 p-3 text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-200"
          >
              <PlusCircle size={24} />
              <span className="font-bold text-sm">Gọi thêm món</span>
          </button>

          {/* NÚT 2: THANH TOÁN -> Truyền action 'payment' (QUAN TRỌNG) */}
          <button 
              onClick={() => onAction('payment')} 
              className="flex flex-col items-center justify-center gap-1 rounded-lg bg-emerald-600 p-3 text-white transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-200"
          >
              <CreditCard size={24} />
              <span className="font-bold text-sm">Thanh toán</span>
          </button>
      </div>
  </div>
)}

          {/* TRƯỜNG HỢP 2: BÀN TRỐNG HOẶC ĐẶT TRƯỚC (Available / Reserved) */}
              {(isAvailable || isReserved) && mode === 'view' && (
            <div className="space-y-4">
                <div className="text-center text-slate-500 mb-4">
                    {isReserved ? (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-2">
                            <p className="text-amber-800 font-bold text-sm">⚠️ Bàn này đang được Đặt Trước</p>
                            <p className="text-xs text-amber-600">Bạn có muốn mở bàn cho khách này?</p>
                        </div>
                    ) : (
                        <p>Bàn này đang trống. Bạn muốn làm gì?</p>
                    )}
                </div>

                <button 
                    onClick={() => onAction('order')} 
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                    <PlusCircle size={20} /> 
                    {/* Đổi chữ hiển thị cho rõ nghĩa */}
                    {isReserved ? 'NHẬN KHÁCH & GỌI MÓN' : 'MỞ BÀN & GỌI MÓN'}
                </button>
                
                {/* Chỉ hiện nút đặt bàn nếu bàn đang trống */}
                {isAvailable && (
                    <button onClick={() => setMode('booking')} className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2">
                        <CalendarClock size={20} /> ĐẶT BÀN TRƯỚC
                    </button>
                )}
            </div>
          )}

          {/* TRƯỜNG HỢP 3: FORM ĐẶT BÀN (Booking Mode) */}
          {(isAvailable || isReserved) && mode === 'booking' && (
             <div className="space-y-4 animate-in slide-in-from-right duration-200">
                <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Thông tin đặt bàn</h4>
                <div className="space-y-3">
                    <input className="w-full pl-4 p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border border-transparent" 
                        placeholder="Tên khách hàng" value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} />
                    <input className="w-full pl-4 p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border border-transparent" 
                        placeholder="Số điện thoại" value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="time" className="w-full pl-4 p-3 bg-slate-50 rounded-lg outline-none" 
                            value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} />
                        <input type="number" className="w-full pl-4 p-3 bg-slate-50 rounded-lg outline-none" 
                            placeholder="Số khách" value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: e.target.value})} />
                    </div>
                </div>
                <div className="pt-4 flex gap-3">
                    <button onClick={() => setMode('view')} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Quay lại</button>
                    <button onClick={handleBookingSubmit} className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 shadow-md">XÁC NHẬN</button>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const TableMap = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/tables');
      const data = await res.json();
      setTables(data);
    } catch (error) { console.error("Lỗi tải bàn:", error); } 
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 5000); // 5s refresh
    return () => clearInterval(interval);
  }, []);

  // Xử lý khi bấm vào bàn (Luôn mở Modal để chọn hành động)
  const handleTableClick = (table) => {
    setSelectedTable(table);
  };

  // Chuyển sang Order Page
  const handleNavigateOrder = (tableId, tableName) => {
      navigate('/pos/order', { 
          state: { 
              tableId: tableId, 
              tableName: tableName,
              orderType: 'dine_in' // Đánh dấu là ăn tại bàn
          } 
      });
  };

const handleModalAction = (action) => {
    if (!selectedTable) return;

    // Cấu hình dữ liệu để truyền sang trang Order
    const navigationState = {
        tableId: selectedTable.id,
        tableName: selectedTable.name,
        orderType: 'dine_in'
    };

    if (action === 'order') {
        // Mode: ordering - Chỉ hiện menu gọi món
        navigate('/pos/order', { 
            state: { ...navigationState, mode: 'ordering' } 
        });
    } 
    else if (action === 'payment') {
        // Mode: payment - Hiện giao diện tính tiền
        navigate('/pos/order', { 
            state: { ...navigationState, mode: 'payment' } 
        });
    }
    
    // Đóng modal sau khi chọn
    setSelectedTable(null);
};

  return (
    <div className="flex flex-col h-full bg-slate-50">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 bg-white shrink-0">
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <LayoutGrid className="text-blue-600" /> Sơ Đồ Bàn Ăn
            </h1>
            <button onClick={fetchTables} className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-colors">
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} /> Làm mới
            </button>
        </div>
        
        <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300"></div> <span>Trống</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> <span>Có khách</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> <span>Đặt trước</span></div>
        </div>
      </div>

      {/* Map Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        {isLoading && tables.length === 0 ? <div className="text-center mt-10">Đang tải...</div> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {tables.map(table => {
                const status = STATUS_CONFIG[table.status] || STATUS_CONFIG.available;
                
                return (
                  <div 
                    key={table.id}
                    onClick={() => handleTableClick(table)}
                    className={`group relative flex flex-col justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg h-32 ${status.bg} ${status.border} ${status.animate || ''} hover:border-blue-400`}
                  >
                    <div className="flex justify-between items-start">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${table.status === 'occupied' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {table.status === 'occupied' ? 'ĐANG PHỤC VỤ' : table.name}
                        </span>
                        {table.status === 'occupied' && <User size={16} className="text-emerald-600" />}
                    </div>

                    <div className="text-center">
                        <h4 className={`text-lg font-bold ${table.status === 'occupied' ? 'text-emerald-800' : 'text-slate-700'}`}>
                            {table.name}
                        </h4>
                        {/* Hiển thị thông tin nếu có khách */}
                        {table.status === 'occupied' ? (
                            <p className="text-xs font-medium text-emerald-600 mt-1">
                                {table.item_count || 0} món • {(table.current_total || 0).toLocaleString()}đ
                            </p>
                        ) : (
                            <p className="text-xs text-slate-400 mt-1">{table.capacity} Ghế</p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </div>

      {/* Modal Detail */}
      <TableDetailModal 
        table={selectedTable} 
        onClose={() => setSelectedTable(null)} 
        onAction={handleModalAction}
      />
    </div>
  );
};

export default TableMap;