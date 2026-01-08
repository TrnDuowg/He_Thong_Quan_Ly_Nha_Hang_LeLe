import React, { useState } from 'react';

// --- MOCK DATA: Nhân viên & Lịch ---
const STAFFS = [
  { id: 1, name: 'Nguyễn Văn A', role: 'Quản lý', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Trần Thị B', role: 'Thu ngân', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 3, name: 'Lê Văn C', role: 'Phục vụ', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 4, name: 'Phạm Thị D', role: 'Bếp', avatar: 'https://i.pravatar.cc/150?u=6' },
];

const DAYS = [
  { day: 'Thứ 2', date: '05/01' },
  { day: 'Thứ 3', date: '06/01' },
  { day: 'Thứ 4', date: '07/01' },
  { day: 'Thứ 5', date: '08/01' },
  { day: 'Thứ 6', date: '09/01' },
  { day: 'Thứ 7', date: '10/01' },
  { day: 'CN', date: '11/01' },
];

// Ca làm việc: Morning (Sáng), Afternoon (Chiều), Full (Cả ngày)
const SHIFTS = {
  '1-Mon': 'Morning',
  '1-Wed': 'Full',
  '1-Fri': 'Morning',
  '2-Tue': 'Afternoon',
  '2-Thu': 'Afternoon',
  '2-Sat': 'Full',
  '3-Mon': 'Afternoon',
  '3-Wed': 'Afternoon',
  '3-Fri': 'Full',
  '3-Sun': 'Morning',
  '4-Tue': 'Morning',
  '4-Thu': 'Morning',
  '4-Sat': 'Afternoon',
  '4-Sun': 'Full',
};

const StaffSchedule = () => {
  const [currentWeek, setCurrentWeek] = useState('Tuần 02, 2026');

  // Helper: Lấy màu theo loại ca
  const getShiftStyle = (type) => {
    switch (type) {
      case 'Morning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Afternoon':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Full':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return '';
    }
  };

  const getShiftLabel = (type) => {
    switch (type) {
      case 'Morning': return 'Sáng (6h-14h)';
      case 'Afternoon': return 'Chiều (14h-22h)';
      case 'Full': return 'Full (8h-20h)';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-body font-display text-text-main">
      
      {/* --- HEADER --- */}
      <div className="bg-surface-white border-b border-border-light px-8 py-5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xếp Lịch Làm Việc</h1>
          <p className="text-text-secondary text-sm mt-1">Quản lý ca làm việc và phân công nhân sự.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface-white border border-border-light rounded-lg text-sm font-medium hover:bg-background-body transition-colors">
            Xuất Excel
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-hover transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">save</span>
            Lưu Lịch
          </button>
        </div>
      </div>

      {/* --- TOOLBAR: Chọn Tuần --- */}
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center bg-surface-white border border-border-light rounded-lg p-1 shadow-sm">
          <button className="p-1.5 hover:bg-background-body rounded-md text-text-secondary transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="px-4 font-bold text-sm min-w-[140px] text-center">{currentWeek}</span>
          <button className="p-1.5 hover:bg-background-body rounded-md text-text-secondary transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Chú thích màu */}
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div> Ca Sáng
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div> Ca Chiều
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-400"></div> Full-time
          </div>
        </div>
      </div>

      {/* --- SCHEDULE TABLE --- */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="bg-surface-white rounded-xl border border-border-light shadow-sm overflow-hidden min-w-[1000px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-background-body border-b border-border-light">
              <tr>
                <th className="px-6 py-4 font-bold w-64 sticky left-0 bg-background-body z-10 border-r border-border-light">Nhân viên</th>
                {DAYS.map((d, i) => (
                  <th key={i} className="px-4 py-4 text-center border-r border-border-light last:border-0 min-w-[120px]">
                    <div className="font-bold text-text-main">{d.day}</div>
                    <div className="text-[10px] font-medium">{d.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {STAFFS.map((staff) => (
                <tr key={staff.id} className="hover:bg-background-body/50 transition-colors">
                  {/* Cột Nhân Viên */}
                  <td className="px-6 py-4 sticky left-0 bg-surface-white z-10 border-r border-border-light group-hover:bg-background-body/50">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full bg-gray-200" src={staff.avatar} alt="" />
                      <div>
                        <div className="font-bold text-text-main">{staff.name}</div>
                        <div className="text-xs text-text-secondary">{staff.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Các ô lịch */}
                  {DAYS.map((day, idx) => {
                    // Key để check xem hôm nay nhân viên này có ca không
                    // Ví dụ: 1-Mon (ID nhân viên - Thứ)
                    // Lưu ý: Logic thực tế sẽ phức tạp hơn, đây là Mock đơn giản.
                    const dayKey = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx];
                    const shiftKey = `${staff.id}-${dayKey}`;
                    const shiftType = SHIFTS[shiftKey];

                    return (
                      <td key={idx} className="p-2 border-r border-border-light last:border-0 h-24 relative align-top">
                        {shiftType ? (
                          <div className={`w-full h-full rounded-lg border px-2 py-1.5 flex flex-col justify-between cursor-pointer hover:opacity-80 transition-opacity ${getShiftStyle(shiftType)}`}>
                            <span className="font-bold text-xs">{getShiftLabel(shiftType)}</span>
                            <div className="flex justify-end">
                                <button className="hover:bg-black/10 rounded p-0.5">
                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                </button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-lg border-2 border-dashed border-transparent hover:border-border-light flex items-center justify-center cursor-pointer group/cell">
                             <span className="material-symbols-outlined text-border-light group-hover/cell:text-primary transition-colors text-xl">add_circle</span>
                          </div>
                        )}
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