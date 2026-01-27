import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Filter, Percent, DollarSign, Package, 
  Calendar, Edit, Trash2, X, Save, MoreHorizontal, ChevronLeft, ChevronRight 
} from 'lucide-react';

const PromotionPage = () => {
  // --- STATE ---
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: '',
    min_order_value: 0,
    // Các trường mở rộng cho UI (Backend chưa có thì tạm để đó hoặc xử lý sau)
    name: '',
    description: '' 
  });

  // --- 1. LOAD DỮ LIỆU TỪ API ---
  const fetchPromotions = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/promotions');
      const data = await res.json();
      setPromotions(data);
    } catch (error) {
      console.error("Lỗi tải khuyến mãi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPromotions(); }, []);

  // --- 2. XỬ LÝ THÊM MỚI ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        alert("Tạo mã thành công!");
        setShowModal(false);
        setFormData({ code: '', discount_type: 'percent', discount_value: '', min_order_value: 0, name: '' });
        fetchPromotions();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    }
  };

  // --- 3. XỬ LÝ XÓA ---
  const handleDelete = async (id) => {
    if(!window.confirm("Bạn chắc chắn muốn xóa mã này?")) return;
    try {
      await fetch(`http://localhost:3000/api/promotions/${id}`, { method: 'DELETE' });
      fetchPromotions();
    } catch (error) {
      alert("Lỗi xóa mã");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 text-gray-900 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shrink-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý Khuyến Mãi</h1>
            <p className="text-gray-500 text-sm">Tạo và theo dõi các chương trình ưu đãi cho khách hàng</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm font-medium text-sm"
          >
            <Plus size={20} />
            <span>Thêm Khuyến Mãi</span>
          </button>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto">
          
          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-0 z-10">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={20} />
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out" 
                placeholder="Tìm kiếm theo tên hoặc mã code..." 
                type="text" 
              />
            </div>
            
            {/* Filter Chips Group */}
            <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-start lg:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 hidden md:block">Loại:</span>
                <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white text-gray-700">
                  <option>Tất cả loại</option>
                  <option>Giảm giá %</option>
                  <option>Giảm tiền mặt</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin mã</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại giảm</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá trị</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Điều kiện</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                      <tr><td colSpan="6" className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
                  ) : promotions.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-8 text-gray-500">Chưa có mã khuyến mãi nào</td></tr>
                  ) : (
                    promotions.map((promo) => (
                      <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                                promo.discount_type === 'percent' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                            }`}>
                              {promo.discount_type === 'percent' ? <Percent size={20} /> : <DollarSign size={20} />}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {promo.discount_type === 'percent' ? 'Giảm theo %' : 'Giảm tiền mặt'}
                              </div>
                              <div className="text-xs text-gray-500">ID: {promo.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-md bg-gray-100 text-gray-800 font-mono border border-gray-200">
                            {promo.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {promo.discount_type === 'percent' ? 'Phần trăm' : 'Cố định'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-800">
                            {Number(promo.discount_value).toLocaleString()}
                            {promo.discount_type === 'percent' ? '%' : 'đ'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Đơn tối thiểu: <span className='font-medium'>{Number(promo.min_order_value).toLocaleString()}đ</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors" title="Xóa">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination (Tĩnh) */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-xl">
             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Hiển thị <span className="font-medium text-gray-900">{promotions.length}</span> kết quả
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 z-10">1</button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronRight size={20} />
                  </button>
                </nav>
             </div>
          </div>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {showModal && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 animate-fade-in-up">
              <form onSubmit={handleSubmit} className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                
                {/* Modal Header */}
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-200 flex justify-between items-center">
                  <div>
                      <h3 className="text-xl font-semibold leading-6 text-gray-900">Tạo Khuyến Mãi Mới</h3>
                      <p className="text-sm text-gray-500 mt-1">Điền thông tin để tạo mã giảm giá.</p>
                  </div>
                  <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="px-4 py-6 sm:p-8 space-y-5">
                  {/* Mã Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã Code <span className="text-red-500">*</span></label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">#</span>
                      <input 
                        required
                        type="text" 
                        className="block w-full rounded-none rounded-r-lg border border-gray-300 py-2.5 px-3 uppercase font-mono text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        placeholder="SALE50" 
                        value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      />
                    </div>
                  </div>

                  {/* Loại & Giá trị */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Loại giảm</label>
                      <select 
                        className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.discount_type}
                        onChange={e => setFormData({...formData, discount_type: e.target.value})}
                      >
                        <option value="percent">Giảm giá %</option>
                        <option value="fixed">Tiền mặt (VNĐ)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giá trị giảm <span className="text-red-500">*</span></label>
                      <div className="relative mt-1">
                        <input 
                            required
                            type="number" 
                            className="block w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-8 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                            placeholder="VD: 20" 
                            value={formData.discount_value}
                            onChange={e => setFormData({...formData, discount_value: e.target.value})}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">
                              {formData.discount_type === 'percent' ? '%' : 'đ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Điều kiện */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Đơn hàng tối thiểu</label>
                    <input 
                        type="number" 
                        className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-3 text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                        placeholder="0" 
                        value={formData.min_order_value}
                        onChange={e => setFormData({...formData, min_order_value: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Áp dụng cho đơn hàng có giá trị từ mức này trở lên.</p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-gray-200">
                  <button 
                    type="submit" 
                    className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto transition-colors flex items-center gap-2"
                  >
                    <Save size={18} /> Lưu Khuyến Mãi
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
                  >
                    Hủy bỏ
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PromotionPage;