import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, Download, Calendar, User, Clock, PlusCircle, RefreshCw } from 'lucide-react';

const StaffSchedule = () => {
  // --- STATE ---
  const [staffs, setStaffs] = useState([]);
  const [schedules, setSchedules] = useState([]); // Dữ liệu lịch từ DB
  const [currentDate, setCurrentDate] = useState(new Date()); // Ngày hiện tại để tính tuần
  const [loading, setLoading] = useState(true);

  // --- 1. HÀM HỖ TRỢ NGÀY THÁNG ---
  // Lấy danh sách 7 ngày trong tuần hiện tại
  const getDaysInWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Thứ 2 là ngày đầu tuần
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push({
            dayName: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
            dateStr: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            fullDate: d.toLocaleDateString('en-CA') // YYYY-MM-DD để khớp DB
        });
    }
    return days;
  };

  const daysInWeek = getDaysInWeek(currentDate);

  // --- 2. GỌI API ---
  const fetchData = async () => {
    setLoading(true);
    try {
        // Gọi song song 2 API: Nhân viên & Lịch
        const [resStaff, resSched] = await Promise.all([
            fetch('http://localhost:3000/api/staff'),
            fetch('http://localhost:3000/api/schedules')
        ]);

        const staffData = await resStaff.json();
        const schedData = await resSched.json();

        setStaffs(staffData);
        setSchedules(schedData);
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 3. XỬ LÝ LƯU LỊCH (Khi bấm vào ô) ---
  const handleShiftClick = async (staffId, dateStr, currentShift) => {
    // Logic vòng tròn: Trống -> Sáng -> Chiều -> Full -> Trống
    let nextShift = 'morning';
    if (currentShift === 'morning') nextShift = 'afternoon';
    else if (currentShift === 'afternoon') nextShift = 'full';
    else if (currentShift === 'full') nextShift = 'off'; // Off nghĩa là xóa (tùy logic backend xử lý xóa hoặc update null)

    // Ở đây mình demo đơn giản: Update đè lên. Nếu muốn xóa phải gọi API delete riêng hoặc gửi null.
    // Tạm thời mình cho nó xoay vòng 3 ca chính.
    
    // Cập nhật Optimistic UI (Hiển thị ngay lập tức)
    const newEntry = { staff_id: staffId, work_date: dateStr, shift_type: nextShift };
    
    // Cập nhật state local để giao diện đổi màu ngay
    const updatedSchedules = [...schedules];
    const index = updatedSchedules.findIndex(s => s.staff_id === staffId && s.work_date === dateStr);
    if (index > -1) {
        updatedSchedules[index].shift_type = nextShift;
    } else {
        updatedSchedules.push(newEntry);
    }
    setSchedules(updatedSchedules);

    // Gọi API lưu xuống DB
    try {
        await fetch('http://localhost:3000/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry)
        });
    } catch (e) {
        alert("Lỗi lưu lịch");
        fetchData(); // Revert lại nếu lỗi
    }
  };

  // --- HELPER STYLES ---
  const getShiftStyle = (type) => {
    switch (type) {
      case 'morning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'afternoon': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'full': return 'bg-green-100 text-green-700 border-green-200';
      default: return '';
    }
  };

  const getShiftLabel = (type) => {
    switch (type) {
      case 'morning': return 'Sáng (6h-14h)';
      case 'afternoon': return 'Chiều (14h-22h)';
      case 'full': return 'Full (8h-20h)';
      default: return '';
    }
  };

  // Chuyển tuần
  const changeWeek = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (offset * 7));
    setCurrentDate(newDate);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xếp Lịch Làm Việc</h1>
          <p className="text-slate-500 text-sm mt-1">Bấm vào ô để xếp lịch: Sáng -&gt; Chiều -&gt; Full</p>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save size={18} /> Đã Lưu Tự Động
            </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="px-6 font-bold text-sm min-w-[200px] text-center flex items-center gap-2 justify-center">
            <Calendar size={16} /> 
            {daysInWeek[0].dateStr} - {daysInWeek[6].dateStr}
          </span>
          <button onClick={() => changeWeek(1)} className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex gap-4 text-xs font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Ca Sáng</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400"></div> Ca Chiều</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-400"></div> Full-time</div>
        </div>
      </div>

      {/* SCHEDULE TABLE */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-[1000px]">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold w-64 sticky left-0 bg-slate-50 z-20 border-r border-slate-200">
                    <div className="flex items-center gap-2"><User size={16}/> Nhân viên</div>
                </th>
                {daysInWeek.map((d, i) => (
                  <th key={i} className={`px-4 py-4 text-center border-r border-slate-200 last:border-0 min-w-[140px] ${
                      d.fullDate === new Date().toLocaleDateString('en-CA') ? 'bg-blue-50 text-blue-700' : ''
                  }`}>
                    <div className="font-bold">{d.dayName}</div>
                    <div className="text-[10px] font-medium opacity-70">{d.dateStr}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {staffs.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Cột Nhân Viên */}
                  <td className="px-6 py-4 sticky left-0 bg-white z-10 border-r border-slate-200 group-hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {staff.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{staff.full_name}</div>
                        <div className="text-xs text-slate-500">{staff.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Các ô lịch */}
                  {daysInWeek.map((day, idx) => {
                    // Tìm xem trong state 'schedules' có ca nào khớp staff_id và ngày này không
                    const shift = schedules.find(s => s.staff_id === staff.id && s.work_date === day.fullDate);
                    const shiftType = shift ? shift.shift_type : null;

                    return (
                      <td key={idx} className="p-2 border-r border-slate-200 last:border-0 h-28 relative align-top bg-white">
                        <div 
                            onClick={() => handleShiftClick(staff.id, day.fullDate, shiftType)}
                            className={`w-full h-full rounded-lg border flex flex-col justify-between cursor-pointer hover:shadow-md transition-all 
                            ${shiftType ? getShiftStyle(shiftType) : 'border-dashed border-transparent hover:border-slate-300 group/cell'}`}
                        >
                            {shiftType ? (
                                <div className="px-3 py-2 h-full flex flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <span className="font-bold text-xs">{getShiftLabel(shiftType)}</span>
                                        <Clock size={14} className="opacity-50" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <PlusCircle className="text-slate-200 group-hover/cell:text-blue-500 transition-colors" size={24} />
                                </div>
                            )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StaffSchedule;