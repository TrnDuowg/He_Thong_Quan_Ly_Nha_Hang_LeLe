import React from 'react';
import { X, CloudUpload, GripVertical, Plus } from 'lucide-react';

const EditProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-end backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Chỉnh sửa sản phẩm</h3>
            <p className="text-xs text-slate-500">Chicken Whopper Jr (SKU: CH-005)</p>
          </div>
          <button 
            onClick={onClose}
            className="size-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-6 shrink-0 bg-white">
          <button className="py-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600">Thông tin chung</button>
          <button className="py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tuỳ chọn</button>
          <button className="py-3 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Cấu hình nâng cao</button>
        </div>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-50/50">
          <div className="flex flex-col gap-6">
            
            {/* Image & Basic Info */}
            <div className="flex gap-6 items-start">
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-600 transition-colors flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer bg-slate-50 relative group overflow-hidden">
                {/* Giả lập ảnh có sẵn */}
                <img 
                   src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" 
                   alt="Preview" 
                   className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity"
                />
                <CloudUpload size={24} className="z-10" />
                <span className="text-xs mt-1 z-10 font-medium">Thay ảnh</span>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-900 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  defaultValue="Chicken Whopper Jr"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 mb-4 shadow-sm" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Mã SKU</label>
                    <input type="text" defaultValue="CH-005" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono text-sm shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Giá bán cơ bản</label>
                    <div className="relative">
                      <input type="text" defaultValue="45.000" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-right pr-12 shadow-sm font-medium" />
                      <span className="absolute right-3 top-2 text-slate-500 text-sm">VND</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-2">Mô tả ngắn</label>
              <textarea 
                rows="3" 
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm placeholder-slate-400 shadow-sm"
                defaultValue="Burger gà chiên giòn với rau xà lách tươi và sốt mayo đặc biệt."
              ></textarea>
            </div>

            <div className="border-t border-slate-200 my-2"></div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Danh mục</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm cursor-pointer">
                  <option>Burger - Gà</option>
                  <option>Burger - Bò</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Nhóm máy in (Bếp)</label>
                <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm cursor-pointer">
                  <option>Bếp Nóng</option>
                  <option>Quầy Bar</option>
                </select>
              </div>
            </div>

            {/* Toppings Group */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-900">Nhóm Topping liên kết</label>
                <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                  <Plus size={14}/> Liên kết nhóm
                </button>
              </div>
              <div className="bg-slate-100 rounded-lg border border-slate-200 p-3 flex flex-col gap-2">
                
                {/* Topping Item 1 */}
                <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded shadow-sm">
                  <div className="flex items-center gap-2">
                    <GripVertical size={18} className="text-slate-400 cursor-move"/>
                    <span className="text-sm text-slate-900">Size (Cỡ nước)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Bắt buộc chọn 1</span>
                    <button className="text-slate-400 hover:text-red-500"><X size={16}/></button>
                  </div>
                </div>

                {/* Topping Item 2 */}
                <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded shadow-sm">
                  <div className="flex items-center gap-2">
                    <GripVertical size={18} className="text-slate-400 cursor-move"/>
                    <span className="text-sm text-slate-900">Topping thêm (Phô mai, Bacon)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Tùy chọn</span>
                    <button className="text-slate-400 hover:text-red-500"><X size={16}/></button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Trạng thái:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            <span className="text-sm font-medium text-slate-900 ml-1">Đang bán</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">Lưu thay đổi</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;