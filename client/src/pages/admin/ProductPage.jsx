import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, Upload, Plus, Search, ChevronDown, SlidersHorizontal, 
  ChevronLeft, ChevronRight, Edit, Trash2, RefreshCw 
} from 'lucide-react';
import EditProductModal from '../../components/products/EditProductModal';

// Helper render màu badge
const CategoryBadge = ({ cat }) => {
  let color = 'bg-gray-100 text-gray-600 border-gray-200';
  const name = cat?.toLowerCase() || '';
  
  if (name.includes('burger')) color = 'bg-orange-50 text-orange-600 border-orange-200';
  else if (name.includes('gà')) color = 'bg-yellow-50 text-yellow-600 border-yellow-200';
  else if (name.includes('uống') || name.includes('drink')) color = 'bg-blue-50 text-blue-600 border-blue-200';
  else if (name.includes('kem') || name.includes('tráng')) color = 'bg-pink-50 text-pink-600 border-pink-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {cat || 'Chưa phân loại'}
    </span>
  );
};

const ProductPage = () => {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // [MỚI] State chứa danh mục chuẩn
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State bộ lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCatId, setFilterCatId] = useState('All'); // [MỚI] Lọc theo ID

  // --- 1. GỌI API LẤY DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi song song 2 API: Lấy món & Lấy danh mục
      const [resProducts, resCats] = await Promise.all([
          fetch('http://localhost:3000/api/products'),
          fetch('http://localhost:3000/api/categories')
      ]);

      const dataProducts = await resProducts.json();
      const dataCats = await resCats.json();

      if (Array.isArray(dataProducts)) setProducts(dataProducts);
      if (Array.isArray(dataCats)) setCategories(dataCats);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. XỬ LÝ LƯU (THÊM / SỬA) ---
  const handleSaveProduct = async (formData, id) => {
    try {
      const url = id 
        ? `http://localhost:3000/api/products/${id}` 
        : 'http://localhost:3000/api/products';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData(); // Tải lại danh sách
        alert(id ? 'Cập nhật thành công!' : 'Thêm món thành công!');
      } else {
        alert('Có lỗi xảy ra!');
      }
    } catch (error) { alert('Lỗi kết nối server!'); }
  };

  // --- 3. XỬ LÝ XÓA ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa món này không?")) return;
    try {
      await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) { alert("Lỗi xóa sản phẩm"); }
  };

  // --- 4. LỌC DỮ LIỆU ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      // So sánh ID danh mục (Lưu ý: filterCatId là string 'All' hoặc số)
      const matchCat = filterCatId === 'All' || p.category_id == filterCatId;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, filterCatId]);

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
            <button 
              onClick={fetchData}
              className="p-2.5 rounded-lg border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
              title="Tải lại dữ liệu"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
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
            <div className="md:col-span-5 lg:col-span-6">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">TÌM KIẾM</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-slate-400 group-focus-within:text-blue-600" size={20}/>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 h-11 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-sm" 
                  placeholder="Tên sản phẩm..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-3 lg:col-span-4">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">DANH MỤC</label>
              <div className="relative">
                <select 
                  className="block w-full h-11 pl-3 pr-10 bg-white border border-slate-200 rounded-lg text-slate-900 appearance-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm cursor-pointer font-medium"
                  value={filterCatId}
                  onChange={(e) => setFilterCatId(e.target.value)}
                >
                  <option value="All">Tất cả danh mục</option>
                  {/* [MỚI] Render danh mục từ API */}
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 w-16 text-center">#</th>
                  <th className="p-4 min-w-[250px]">SẢN PHẨM</th>
                  <th className="p-4 text-center">DANH MỤC</th>
                  <th className="p-4 text-right">GIÁ BÁN</th>
                  <th className="p-4 text-center">TRẠNG THÁI</th>
                  <th className="p-4 text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-400">Đang tải dữ liệu...</td></tr>
                ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-400">Không tìm thấy sản phẩm nào</td></tr>
                ) : (
                  filteredProducts.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 text-center font-mono text-xs text-slate-400">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 rounded-lg p-1 shrink-0 size-12 flex items-center justify-center overflow-hidden border border-gray-200">
                          <img src={item.image_url} onError={(e) => e.target.src='https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-base">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-slate-400 text-[10px] font-mono tracking-wide">ID: {item.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <CategoryBadge cat={item.category_name} />
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">
                        {Number(item.price).toLocaleString()} ₫
                    </td>
                    <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            item.is_active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            {item.is_active ? 'Kinh doanh' : 'Ngừng bán'}
                        </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedProduct(item); setIsModalOpen(true); }} className="p-2 rounded-lg hover:bg-blue-100 text-slate-500 hover:text-blue-600 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="h-10"></div>
      </div>

      {/* Modal Component */}
      <EditProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
        onSave={handleSaveProduct}
        categories={categories}
      />
    </div>
  );
};

export default ProductPage;