import React, { useState } from 'react';
import { 
  Download, Plus, Search, ChevronDown, Edit, Trash2, 
  RotateCcw, ChevronLeft, ChevronRight, X, CheckSquare, 
  LayoutGrid, Package, BarChart3, Users
} from 'lucide-react';

const StaffPage = () => {
  const [isRolePanelOpen, setIsRolePanelOpen] = useState(false);

  // --- MOCK DATA ---
  const employees = [
    { 
      id: 'NV001', name: 'Nguyễn Văn An', phone: '090 123 4567', 
      role: 'Quản lý cửa hàng', roleColor: 'blue', 
      shift: 'Ca sáng (6:00 - 14:00)', 
      status: 'active', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80' 
    },
    { 
      id: 'NV002', name: 'Trần Thị Bích', phone: '091 234 5678', 
      role: 'Thu ngân', roleColor: 'indigo', 
      shift: 'Ca tối (14:00 - 22:00)', 
      status: 'offline', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' 
    },
    { 
      id: 'NV003', name: 'Lê Hoàng', phone: '098 765 4321', 
      role: 'Nhân viên bếp', roleColor: 'sky', 
      shift: 'Toàn thời gian', 
      status: 'active', avatar: null // Test avatar chữ cái
    },
    { 
      id: 'NV004', name: 'Phạm Tùng', phone: '093 333 4444', 
      role: 'Tạp vụ', roleColor: 'gray', 
      shift: 'Ca sáng', 
      status: 'inactive', avatar: null 
    },
  ];

  const roleColors = {
    blue:   { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    sky:    { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    gray:   { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 relative">
      
      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="flex-shrink-0 px-8 py-6 border-b border-slate-200 bg-white z-10">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-slate-500 hover:text-blue-600 cursor-pointer">Trang chủ</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-500 hover:text-blue-600 cursor-pointer">Quản trị</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-900 font-medium">Nhân sự</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản Lý Nhân Viên</h1>
              <p className="text-slate-500 mt-1">Quản lý danh sách nhân viên, vai trò và phân quyền truy cập hệ thống.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all text-sm font-medium bg-white">
                <Download size={20} /> Xuất Excel
              </button>
              <button 
                onClick={() => setIsRolePanelOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-200"
              >
                <Plus size={20} /> Thêm nhân viên
              </button>
            </div>
          </div>

          <div className="mt-8 border-b border-slate-200">
            <div className="flex gap-8">
              <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-bold text-sm px-1 transition-colors">
                Danh sách nhân viên
              </button>
              <button 
                onClick={() => setIsRolePanelOpen(true)}
                className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors font-medium text-sm px-1"
              >
                Phân quyền (Vai trò)
              </button>
            </div>
          </div>
        </header>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400 transition-colors" placeholder="Tìm kiếm theo tên, SĐT..." type="text"/>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer min-w-[160px]">
                  <option>Tất cả vai trò</option>
                  <option>Quản lý cửa hàng</option>
                  <option>Thu ngân</option>
                  <option>Nhân viên bếp</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer min-w-[160px]">
                  <option>Tất cả trạng thái</option>
                  <option>Đang hoạt động</option>
                  <option>Đã nghỉ</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-6 py-4">Nhân viên</th>
                    <th className="px-6 py-4">Số điện thoại</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Ca làm việc</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {employees.map((emp) => {
                    const roleStyle = roleColors[emp.roleColor] || roleColors.gray;
                    return (
                      <tr key={emp.id} className={`hover:bg-blue-50/30 transition-colors group ${emp.status === 'inactive' ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {emp.avatar ? (
                               <img src={emp.avatar} alt={emp.name} className="h-9 w-9 rounded-full object-cover shadow-sm" />
                            ) : (
                               <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                                  {emp.name.split(' ').pop().substring(0,2).toUpperCase()}
                               </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-900">{emp.name}</p>
                              <p className="text-xs text-slate-500">{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-mono">{emp.phone}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{emp.shift}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {emp.status === 'active' && (
                              <>
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                <span className="text-green-600 font-medium text-xs">Hoạt động</span>
                              </>
                            )}
                            {emp.status === 'offline' && (
                              <>
                                <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
                                <span className="text-gray-500 font-medium text-xs">Offline</span>
                              </>
                            )}
                            {emp.status === 'inactive' && (
                              <>
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                                <span className="text-red-500 font-medium text-xs">Đã nghỉ</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {emp.status !== 'inactive' ? (
                              <>
                                <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm text-slate-500 hover:text-blue-600 transition-all">
                                  <Edit size={18} />
                                </button>
                                <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm text-slate-500 hover:text-red-500 transition-all">
                                  <Trash2 size={18} />
                                </button>
                              </>
                            ) : (
                              <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm text-slate-500 hover:text-blue-600 transition-all" title="Khôi phục">
                                <RotateCcw size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <p className="text-sm text-slate-500">Hiển thị <span className="font-medium text-slate-900">1-4</span> trong <span className="font-medium text-slate-900">24</span> nhân viên</p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-500 disabled:opacity-50 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">1</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-500 font-medium text-sm transition-all">2</button>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-500 font-medium text-sm transition-all">3</button>
                <span className="text-slate-500 px-1">...</span>
                <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-900 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR: CREATE ROLE --- */}
      {isRolePanelOpen && (
        <div className="absolute inset-y-0 right-0 w-[400px] border-l border-slate-200 bg-white flex flex-col h-full shadow-2xl z-20 animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-900">Tạo vai trò mới</h2>
            <button onClick={() => setIsRolePanelOpen(false)} className="text-slate-500 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-900 mb-2">Tên vai trò</label>
              <input className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400/50 transition-shadow" placeholder="Ví dụ: Giám sát kho" type="text" />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-900">Phân quyền chi tiết</label>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium underline">Chọn tất cả</button>
            </div>

            <div className="space-y-4">
              {/* Permission Group 1 */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                <div className="flex items-center gap-3 p-3 bg-slate-100 border-b border-slate-200 cursor-pointer">
                  <LayoutGrid className="text-blue-600" size={20} />
                  <span className="font-semibold text-slate-900 text-sm flex-1">Module POS</span>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4" />
                </div>
                <div className="p-3 pl-10 space-y-3 bg-white">
                  {['Tạo đơn hàng mới', 'Thanh toán & In hóa đơn'].map((perm, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4" />
                      <span className="text-slate-500 text-sm group-hover:text-slate-900 transition-colors">{perm}</span>
                    </label>
                  ))}
                  {['Hủy món / Hủy đơn', 'Áp dụng giảm giá thủ công'].map((perm, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4" />
                      <span className="text-slate-500 text-sm group-hover:text-slate-900 transition-colors">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Permission Group 2 */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                <div className="flex items-center gap-3 p-3 bg-slate-100 border-b border-slate-200 cursor-pointer">
                  <Package className="text-blue-600" size={20} />
                  <span className="font-semibold text-slate-900 text-sm flex-1">Module Sản phẩm</span>
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4" />
                </div>
                <div className="p-3 pl-10 space-y-3 bg-white">
                   {['Xem danh sách sản phẩm', 'Điều chỉnh tồn kho'].map((perm, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4" />
                      <span className="text-slate-500 text-sm group-hover:text-slate-900 transition-colors">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Permission Group 3 */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                <div className="flex items-center gap-3 p-3 bg-slate-100 border-b border-slate-200 cursor-pointer">
                  <BarChart3 className="text-blue-600" size={20} />
                  <span className="font-semibold text-slate-900 text-sm flex-1">Module Báo cáo</span>
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-white flex gap-3">
            <button onClick={() => setIsRolePanelOpen(false)} className="flex-1 py-3 px-4 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition-colors">Hủy bỏ</button>
            <button className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Lưu vai trò</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffPage;