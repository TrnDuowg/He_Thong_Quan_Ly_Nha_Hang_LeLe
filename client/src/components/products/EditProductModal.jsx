import React, { useState, useEffect } from 'react';
import { X, Save, UploadCloud } from 'lucide-react';

// Nhận thêm prop 'categories' từ cha truyền xuống
const EditProductModal = ({ isOpen, onClose, product, onSave, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '', // Để rỗng ban đầu
    price: '',
    image_url: '',
    is_active: 1
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category_id: product.category_id,
        price: product.price,
        image_url: product.image_url || '',
        is_active: product.is_active
      });
    } else {
      // Nếu thêm mới, mặc định chọn danh mục đầu tiên trong danh sách (nếu có)
      setFormData({ 
          name: '', 
          category_id: categories.length > 0 ? categories[0].id : '', 
          price: '', 
          image_url: '', 
          is_active: 1 
      });
    }
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, product ? product.id : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            {product ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Mới'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tên món */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn</label>
            <input 
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ví dụ: Burger Bò Phô Mai"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Danh mục (SỬA PHẦN NÀY) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: Number(e.target.value)})}
              >
                {/* Render danh sách danh mục thật từ Database */}
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
              </select>
            </div>

            {/* Giá bán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
              <input 
                required
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                value={formData.price ? Number(formData.price.toString().replace(/\./g, '')).toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, price: val});
                }}
              />
            </div>
          </div>

          {/* Link ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link hình ảnh (URL)</label>
            <div className="flex gap-2">
              <input 
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="https://..."
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
              <div className="w-10 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                ) : (
                  <UploadCloud size={16} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              Lưu Sản Phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;