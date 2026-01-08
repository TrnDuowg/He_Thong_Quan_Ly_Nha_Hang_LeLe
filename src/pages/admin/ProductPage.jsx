import React, { useState } from 'react';
import { 
  Download, Upload, Plus, Search, ChevronDown, SlidersHorizontal, 
  ChevronLeft, ChevronRight, Edit, Trash2 
} from 'lucide-react';
import EditProductModal from '../../components/products/EditProductModal';

// Dữ liệu giả lập
const productsData = [
  { id: 1, name: 'Double Cheese Burger', sku: 'BG-001', cat: 'Burger - Bò', price: '59.000', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=60', status: true, catColor: 'orange' },
  { id: 2, name: 'Chicken Whopper Jr', sku: 'CH-005', cat: 'Burger - Gà', price: '45.000', img: 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?auto=format&fit=crop&w=100&q=60', status: true, catColor: 'yellow' },
  { id: 3, name: 'Coca Cola (L)', sku: 'DR-102', cat: 'Đồ uống', price: '15.000', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=60', status: false, catColor: 'blue' },
  { id: 4, name: 'Khoai tây chiên', sku: 'SD-003', cat: 'Món ăn kèm', price: '25.000', img: 'https://images.unsplash.com/photo-1630384060421-a4323ceca0ad?auto=format&fit=crop&w=100&q=60', status: true, catColor: 'green' },
];

// Helper render màu badge
const CategoryBadge = ({ cat, color }) => {
  const colorMap = {
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[color] || colorMap.blue}`}>
      {cat}
    </span>
  );
};

const ProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full relative">
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        
        {/* Header Page */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản Lý Sản Phẩm</h1>
            <p className="text-slate-500 text-sm">Danh sách và quản lý thực đơn toàn hệ thống</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-blue-200 bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 transition-all shadow-sm">
              <Download size={18} />
              <span>Xuất Excel</span>
            </button>
            <button className="flex items-center gap-2 px-4 h-10 rounded-lg border border-blue-200 bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 transition-all shadow-sm">
              <Upload size={18} />
              <span>Nhập Excel</span>
            </button>
            <button 
              onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-4 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <Plus size={20} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5 lg:col-span-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Tìm kiếm</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-slate-400 group-focus-within:text-blue-600" size={20}/>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 h-11 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-sm" 
                  placeholder="Tên sản phẩm, SKU..." 
                />
              </div>
            </div>
            <div className="md:col-span-3 lg:col-span-3">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Danh mục</label>
              <div className="relative">
                <select className="block w-full h-11 pl-3 pr-10 bg-white border border-slate-200 rounded-lg text-slate-900 appearance-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm cursor-pointer">
                  <option>Tất cả danh mục</option>
                  <option>Burger - Bò</option>
                  <option>Burger - Gà</option>
                  <option>Đồ uống</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
            <div className="md:col-span-3 lg:col-span-3">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Trạng thái</label>
              <div className="relative">
                <select className="block w-full h-11 pl-3 pr-10 bg-white border border-slate-200 rounded-lg text-slate-900 appearance-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm cursor-pointer">
                  <option>Tất cả trạng thái</option>
                  <option>Đang kinh doanh</option>
                  <option>Ngừng kinh doanh</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
            <div className="md:col-span-1 lg:col-span-2 flex justify-end">
              <button className="h-11 w-full md:w-11 flex items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 transition-colors" title="Lọc nâng cao">
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 w-16 text-center">
                    <input type="checkbox" className="custom-checkbox rounded border-gray-300 bg-white size-4 cursor-pointer" />
                  </th>
                  <th className="p-4 min-w-[300px]">Sản phẩm</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4 text-right">Giá bán</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {productsData.map((item) => (
                  <tr key={item.id} className="group hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="custom-checkbox rounded border-gray-300 bg-white size-4 cursor-pointer" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-lg p-1 shrink-0 size-12 flex items-center justify-center overflow-hidden border border-gray-200">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-slate-500 text-[10px] font-mono tracking-wide">SKU: {item.sku}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <CategoryBadge cat={item.cat} color={item.catColor} />
                    </td>
                    <td className="p-4 text-right font-medium text-slate-900">{item.price} VND</td>
                    <td className="p-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={item.status} />
                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-slate-500 hover:text-blue-600 transition-colors" 
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Hiển thị</span>
              <select className="bg-white border border-slate-200 text-slate-900 text-xs rounded p-1 focus:outline-none focus:border-blue-600 cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>hàng mỗi trang</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-slate-500 disabled:opacity-50 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button className="size-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-sm">1</button>
              <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-slate-500 text-sm transition-colors">2</button>
              <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-slate-500 text-sm transition-colors">3</button>
              <span className="text-slate-500 text-xs px-1">...</span>
              <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-slate-500 text-sm transition-colors">12</button>
              <button className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-slate-500 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="h-10"></div>
      </div>

      {/* Modal Component */}
      <EditProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default ProductPage;