import React, { useState, useEffect } from 'react';
import { 
  Download, Plus, Search, ChevronDown, Edit, Trash2, 
  RotateCcw, ChevronLeft, ChevronRight, X, CheckSquare, 
  LayoutGrid, Package, BarChart3, Users, UserPlus, Key, Shield
} from 'lucide-react';

const StaffPage = () => {
  // --- STATE ---
  const [staffList, setStaffList] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form thêm nhân viên
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    role: 'pos' // Mặc định là thu ngân
  });

  // --- 1. GỌI API LẤY DANH SÁCH ---
  const fetchStaff = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/staff');
      const data = await res.json();
      setStaffList(data);
    } catch (error) {
      console.error("Lỗi tải nhân viên:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  // --- 2. XỬ LÝ THÊM NHÂN VIÊN ---
  const handleCreate = async () => {
    if (!formData.username || !formData.password || !formData.full_name) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();

        if (res.ok) {
            alert("Tạo nhân viên thành công!");
            setIsPanelOpen(false);
            setFormData({ full_name: '', username: '', password: '', role: 'pos' }); // Reset form
            fetchStaff(); // Tải lại danh sách
        } else {
            alert(data.message);
        }
    } catch (e) { alert("Lỗi kết nối"); }
  };

  // --- 3. XỬ LÝ XÓA ---
  const handleDelete = async (id) => {
    if(!window.confirm("Bạn muốn xóa nhân viên này? Tài khoản sẽ không thể đăng nhập được nữa.")) return;
    try {
        await fetch(`http://localhost:3000/api/staff/${id}`, { method: 'DELETE' });
        fetchStaff();
    } catch (e) { alert("Lỗi xóa"); }
  };

  // Config màu sắc role
  const getRoleStyle = (role) => {
    switch(role) {
        case 'admin': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Quản trị viên' };
        case 'kitchen': return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Bếp / Bar' };
        default: return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Thu ngân (POS)' };
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 relative">
      
      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="flex-shrink-0 px-8 py-6 border-b border-slate-200 bg-white z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản Lý Nhân Sự</h1>
              <p className="text-slate-500 mt-1">Quản lý tài khoản truy cập hệ thống.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPanelOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-200"
              >
                <Plus size={20} /> Thêm nhân viên
              </button>
            </div>
          </div>
        </header>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-6 py-4">Họ và tên</th>
                    <th className="px-6 py-4">Tên đăng nhập</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Ngày tạo</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {isLoading ? (
                      <tr><td colSpan="5" className="text-center py-8 text-slate-400">Đang tải danh sách...</td></tr>
                  ) : staffList.map((emp) => {
                    const style = getRoleStyle(emp.role);
                    return (
                      <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                {emp.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{emp.full_name}</p>
                              <p className="text-xs text-slate-500">ID: #{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-mono font-bold">@{emp.username}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border border-transparent ${style.bg} ${style.text}`}>
                            {style.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                            {new Date(emp.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDelete(emp.id)} className="p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 text-slate-400 hover:text-red-600 transition-all">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR: THÊM NHÂN VIÊN --- */}
      {isPanelOpen && (
        <div className="absolute inset-y-0 right-0 w-[400px] border-l border-slate-200 bg-white flex flex-col h-full shadow-2xl z-20 animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-900">Thêm nhân viên mới</h2>
            <button onClick={() => setIsPanelOpen(false)} className="text-slate-500 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">
                
                {/* 1. Thông tin cá nhân */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Users size={16} className="text-blue-600"/> Thông tin cơ bản
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Họ và tên (*)</label>
                            <input 
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600" 
                                placeholder="VD: Nguyễn Văn A"
                                value={formData.full_name}
                                onChange={e => setFormData({...formData, full_name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Vai trò (*)</label>
                            <select 
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600 bg-white"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="pos">Thu ngân (POS)</option>
                                <option value="kitchen">Đầu bếp (Kitchen)</option>
                                <option value="admin">Quản lý (Admin)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Thông tin đăng nhập */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Shield size={16} /> Tài khoản đăng nhập
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-blue-600 mb-1">Tên đăng nhập (*)</label>
                            <input 
                                className="w-full border border-blue-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600" 
                                placeholder="VD: thungan01"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-blue-600 mb-1">Mật khẩu (*)</label>
                            <input 
                                type="password"
                                className="w-full border border-blue-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-600" 
                                placeholder="••••••"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

            </div>
          </div>

          <div className="p-6 border-t border-slate-200 bg-white flex gap-3">
            <button onClick={() => setIsPanelOpen(false)} className="flex-1 py-3 px-4 rounded-lg border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50">Hủy</button>
            <button 
                onClick={handleCreate}
                className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
                Tạo Tài Khoản
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffPage;