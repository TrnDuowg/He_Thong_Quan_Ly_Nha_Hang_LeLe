import React, { useState } from 'react';
import { 
  Plus, Search, MoreHorizontal, ChevronRight, Save, 
  FileEdit, Image as ImageIcon, Layers, PlusCircle, 
  Trash2, X, GripVertical, GripHorizontal 
} from 'lucide-react';

// --- MOCK DATA ---
const mockCombos = [
  { 
    id: 1, name: 'Combo Bữa Trưa Vui Vẻ', items: 3, price: '129.000', 
    status: 'active', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=150&q=80' 
  },
  { 
    id: 2, name: 'Tiệc Gia Đình', items: 5, price: '345.000', 
    status: 'draft', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=150&q=80' 
  },
  { 
    id: 3, name: 'Hộp Vui Vẻ Cho Bé', items: 2, price: '65.000', 
    status: 'active', img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=150&q=80' 
  },
];

const mockLibrary = [
  { id: 'L1', name: 'Coca Cola (L)', price: '25.000', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=60' },
  { id: 'L2', name: 'Vòng Hành Chiên', price: '40.000', img: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=100&q=60' },
  { id: 'L3', name: 'Kem Ốc Quế Vani', price: '15.000', img: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=100&q=60' },
  { id: 'L4', name: 'Gà Viên (6 miếng)', price: '50.000', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=100&q=60' },
  { id: 'L5', name: 'Salad Vườn', price: '65.000', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=60' },
];

const ComboPage = () => {
  const [selectedComboId, setSelectedComboId] = useState(1);

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      
      {/* --- CỘT 1: DANH SÁCH COMBO (LEFT SIDEBAR) --- */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Danh sách Combo</h3>
            <button className="size-8 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all" title="Tạo Combo Mới">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:ring-1 focus:ring-blue-600 placeholder-slate-400 transition-shadow outline-none" 
              placeholder="Tìm kiếm combo..." 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 whitespace-nowrap border border-blue-100">Tất cả</button>
            <button className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 whitespace-nowrap hover:text-blue-600 hover:bg-slate-200 transition-colors">Hoạt động</button>
            <button className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 whitespace-nowrap hover:text-blue-600 hover:bg-slate-200 transition-colors">Bản nháp</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {mockCombos.map((combo) => (
            <div 
              key={combo.id}
              onClick={() => setSelectedComboId(combo.id)}
              className={`group flex gap-3 p-3 rounded-lg border cursor-pointer transition-colors shadow-sm ${
                selectedComboId === combo.id 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              <div 
                className={`size-16 rounded-md bg-cover bg-center shrink-0 ${combo.status === 'draft' ? 'grayscale opacity-70' : ''}`}
                style={{ backgroundImage: `url(${combo.img})` }}
              ></div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-bold text-sm text-slate-900 truncate">{combo.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{combo.items} món • <span className="font-medium text-slate-700">{combo.price} ₫</span></p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`size-2 rounded-full ${combo.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                  <span className={`text-[10px] uppercase font-bold ${combo.status === 'active' ? 'text-green-500' : 'text-slate-400'}`}>
                    {combo.status === 'active' ? 'Hoạt động' : 'Nháp'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-blue-600">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CỘT 2: TRÌNH CHỈNH SỬA (MAIN CONTENT) --- */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden min-w-[600px]">
        {/* Header Editor */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hover:text-blue-600 transition-colors cursor-pointer">Combo</span>
            <ChevronRight size={16} />
            <span className="text-slate-900 font-medium">Sửa "Combo Bữa Trưa Vui Vẻ"</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center gap-2 transition-all">
              <Save size={18} />
              Lưu Thay Đổi
            </button>
          </div>
        </div>

        {/* Scrollable Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Block 1: Thông tin cơ bản */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileEdit className="text-blue-600" size={24} />
                  Thông Tin Cơ Bản
                </h3>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                  <span className="text-xs font-medium px-2 text-slate-500">Trạng thái:</span>
                  <button className="px-3 py-1 bg-white rounded shadow-sm text-xs font-bold text-green-500">Hoạt động</button>
                  <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-400 transition-colors">Ngừng</button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Image Upload */}
                <div className="col-span-4">
                  <label className="block text-sm font-medium mb-2 text-slate-700">Ảnh đại diện</label>
                  <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-600 cursor-pointer flex flex-col items-center justify-center bg-slate-50 group transition-colors relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-30 transition-opacity" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=300&q=80)'}}></div>
                    <div className="relative z-10 flex flex-col items-center text-slate-500 group-hover:text-blue-600">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-xs font-medium">Đổi ảnh</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="col-span-8 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Tên Combo</label>
                    <input className="w-full rounded-lg bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-shadow outline-none" type="text" defaultValue="Combo Bữa Trưa Vui Vẻ" placeholder="vd: Khuyến mãi mùa hè"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-700">Chiến lược giá</label>
                      <select className="w-full rounded-lg bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 focus:ring-1 focus:ring-blue-600 outline-none">
                        <option>Giá cố định</option>
                        <option>Động (Tổng các món)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-700">Giá bán (VND)</label>
                      <input className="w-full rounded-lg bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 focus:ring-1 focus:ring-blue-600 font-mono outline-none font-bold" type="text" defaultValue="129.000"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Mô tả</label>
                    <textarea className="w-full rounded-lg bg-slate-50 border border-slate-200 text-sm px-4 py-2.5 focus:ring-1 focus:ring-blue-600 h-20 resize-none outline-none" defaultValue="Một combo bữa trưa hoàn hảo bao gồm món chính, món phụ và đồ uống giải khát."></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2: Cấu trúc Combo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="text-blue-600" size={24} />
                  Cấu Trúc Combo
                </h3>
                <button className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1">
                  <PlusCircle size={18} /> Thêm bước
                </button>
              </div>

              {/* Step 1 */}
              <div className="bg-white rounded-xl border border-slate-200 p-1 shadow-sm group">
                <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 size-6 rounded flex items-center justify-center text-xs font-bold">1</div>
                    <input className="bg-transparent border-none p-0 text-sm font-bold focus:ring-0 text-slate-900 w-64 hover:bg-slate-200 rounded px-1 cursor-text transition-colors outline-none" type="text" defaultValue="Chọn 1 Món Chính"/>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 bg-transparent" type="checkbox"/>
                      <span className="text-slate-600">Bắt buộc</span>
                    </label>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Min:</span>
                      <input className="w-12 h-7 rounded border border-slate-200 bg-white text-center text-xs outline-none focus:border-blue-600" type="number" defaultValue="1"/>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Max:</span>
                      <input className="w-12 h-7 rounded border border-slate-200 bg-white text-center text-xs outline-none focus:border-blue-600" type="number" defaultValue="1"/>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 transition-colors ml-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[100px]">
                  {/* Item in step */}
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200 relative group/item">
                    <GripVertical className="text-slate-400 cursor-move absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100" size={16} />
                    <div className="size-12 rounded bg-cover bg-center ml-4" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=60)'}}></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Burger Bò Cổ Điển</p>
                      <p className="text-xs text-slate-500">Món chính • 85.000 ₫</p>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 p-1"><X size={16} /></button>
                  </div>
                   {/* Item in step */}
                   <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200 relative group/item">
                    <GripVertical className="text-slate-400 cursor-move absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100" size={16} />
                    <div className="size-12 rounded bg-cover bg-center ml-4" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?auto=format&fit=crop&w=100&q=60)'}}></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Burger Gà Cay</p>
                      <p className="text-xs text-slate-500">Món chính • 79.000 ₫</p>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 p-1"><X size={16} /></button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-xl border border-slate-200 p-1 shadow-sm group">
                <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-200 text-slate-600 size-6 rounded flex items-center justify-center text-xs font-bold">2</div>
                    <input className="bg-transparent border-none p-0 text-sm font-bold focus:ring-0 text-slate-900 w-64 hover:bg-slate-200 rounded px-1 cursor-text transition-colors outline-none" type="text" defaultValue="Chọn Món Phụ"/>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 bg-transparent" type="checkbox"/>
                      <span className="text-slate-600">Bắt buộc</span>
                    </label>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Min:</span>
                      <input className="w-12 h-7 rounded border border-slate-200 bg-white text-center text-xs outline-none focus:border-blue-600" type="number" defaultValue="0"/>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>Max:</span>
                      <input className="w-12 h-7 rounded border border-slate-200 bg-white text-center text-xs outline-none focus:border-blue-600" type="number" defaultValue="2"/>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 transition-colors ml-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[100px]">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200 relative group/item">
                    <GripVertical className="text-slate-400 cursor-move absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100" size={16} />
                    <div className="size-12 rounded bg-cover bg-center ml-4" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?auto=format&fit=crop&w=100&q=60)'}}></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Khoai Tây Chiên (M)</p>
                      <p className="text-xs text-slate-500">Món phụ • 35.000 ₫</p>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 p-1"><X size={16} /></button>
                  </div>
                  {/* Drag Placeholder */}
                  <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-lg flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xs font-semibold text-blue-600">Thả món vào đây</p>
                    <p className="text-[10px] text-slate-500">Kéo từ thư viện</p>
                  </div>
                </div>
              </div>
            
            </div>
          </div>
        </div>
      </div>

      {/* --- CỘT 3: THƯ VIỆN SẢN PHẨM (RIGHT SIDEBAR) --- */}
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10">
        <div className="p-4 border-b border-slate-200">
          <h4 className="font-bold text-slate-900 mb-3">Thư Viện Sản Phẩm</h4>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2 text-slate-400" size={16} />
            <input 
              type="text" 
              className="w-full h-8 pl-9 pr-3 rounded bg-slate-100 border-none text-xs focus:ring-1 focus:ring-blue-600 placeholder-slate-500 transition-shadow outline-none" 
              placeholder="Tìm sản phẩm..." 
            />
          </div>
          <div className="flex gap-2">
            <select className="flex-1 h-8 rounded bg-slate-100 border-none text-xs text-slate-700 focus:ring-0 cursor-pointer outline-none">
              <option>Danh mục: Tất cả</option>
              <option>Món chính</option>
              <option>Món phụ</option>
              <option>Đồ uống</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {mockLibrary.map((item) => (
            <div key={item.id} className="p-2 rounded border border-slate-200 bg-slate-50 hover:border-blue-300 cursor-grab active:cursor-grabbing flex gap-3 items-center group shadow-sm hover:shadow-md transition-all">
              <div className="size-10 rounded bg-cover bg-center" style={{backgroundImage: `url(${item.img})`}}></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-500">{item.price} ₫</p>
              </div>
              <GripHorizontal size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ComboPage;