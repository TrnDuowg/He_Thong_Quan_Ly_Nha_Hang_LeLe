import React, { useState } from 'react';

const PromotionPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    // Sử dụng font-display và background-body từ config của bạn
    <div className="flex flex-col h-full overflow-hidden bg-background-body text-text-main font-display">
      
      {/* --- HEADER SECTION --- */}
      <header className="bg-surface-white border-b border-border-light px-8 py-6 shrink-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-text-main">Quản lý Khuyến Mãi</h1>
            <p className="text-text-secondary text-sm">Tạo và theo dõi các chương trình ưu đãi cho khách hàng</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm font-medium text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Thêm Khuyến Mãi</span>
          </button>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto">
          
          {/* Filters and Search Bar */}
          <div className="bg-surface-white p-4 rounded-xl shadow-sm border border-border-light flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-0 z-10">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-secondary">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border border-border-light rounded-lg leading-5 bg-background-body text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out" 
                placeholder="Tìm kiếm theo tên hoặc mã code..." 
                type="text" 
              />
            </div>
            
            {/* Filter Chips Group */}
            <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-start lg:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary hidden md:block">Loại:</span>
                <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-border-light focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-surface-white text-text-main">
                  <option>Tất cả loại</option>
                  <option>Giảm giá %</option>
                  <option>Giảm tiền mặt</option>
                  <option>Combo</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-secondary hidden md:block">Trạng thái:</span>
                <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-border-light focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-surface-white text-text-main">
                  <option>Tất cả</option>
                  <option>Đang hoạt động</option>
                  <option>Tạm dừng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-surface-white rounded-xl shadow-sm border border-border-light overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-light">
                {/* Dùng màu primary-light cho header bảng nhìn sẽ dịu mắt hơn */}
                <thead className="bg-primary-light">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Tên khuyến mãi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Mã Code</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Loại</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-surface-white divide-y divide-border-light">
                  {/* Row 1 */}
                  <tr className="hover:bg-primary-light/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined">percent</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-main">Giảm giá Mùa Hè</div>
                          <div className="text-xs text-text-secondary">Giảm 20% cho đơn từ 100k</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-background-body text-text-main font-mono border border-border-light">
                        HE2024
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      Giảm giá %
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      01/06 - 31/08
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Sử dụng màu pos-success từ config */}
                      <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-pos-success border border-green-200">
                        Đang hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button className="text-primary hover:text-primary-hover p-1 rounded-md hover:bg-primary-light transition-colors" title="Chỉnh sửa">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        {/* Dùng màu pos-error cho nút xóa */}
                        <button className="text-pos-error hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors" title="Xóa">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Row 2 */}
                  <tr className="hover:bg-primary-light/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined">fastfood</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-main">Combo Burger Bò</div>
                          <div className="text-xs text-text-secondary">Mua 2 tặng 1 nước</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-background-body text-text-main font-mono border border-border-light">
                        COMBOBO
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      Combo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      15/05 - 15/06
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Sử dụng màu text-secondary cho trạng thái dừng */}
                      <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-text-secondary border border-border-light">
                        Tạm dừng
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button className="text-primary hover:text-primary-hover p-1 rounded-md hover:bg-primary-light transition-colors" title="Chỉnh sửa">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="text-pos-error hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors" title="Xóa">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-primary-light/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined">payments</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-main">Khai Trương</div>
                          <div className="text-xs text-text-secondary">Giảm 50k đơn đầu</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-background-body text-text-main font-mono border border-border-light">
                        NEWUSER
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      Tiền mặt
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      Cả năm 2024
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-pos-success border border-green-200">
                        Đang hoạt động
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button className="text-primary hover:text-primary-hover p-1 rounded-md hover:bg-primary-light transition-colors" title="Chỉnh sửa">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="text-pos-error hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors" title="Xóa">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="bg-surface-white px-4 py-3 flex items-center justify-between border-t border-border-light sm:px-6 rounded-b-xl">
             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p className="text-sm text-text-secondary">
                  Hiển thị <span className="font-medium text-text-main">1</span> đến <span className="font-medium text-text-main">3</span> trong số <span className="font-medium text-text-main">12</span> kết quả
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-light bg-surface-white text-sm font-medium text-text-secondary hover:bg-background-body">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </a>
                  <a href="#" className="z-10 bg-primary-light border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </a>
                  <a href="#" className="bg-surface-white border-border-light text-text-secondary hover:bg-background-body relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-light bg-surface-white text-sm font-medium text-text-secondary hover:bg-background-body">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </a>
                </nav>
             </div>
          </div>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {showModal && (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-text-main/50 transition-opacity backdrop-blur-sm"></div>
          
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            {/* Sử dụng animation fade-in-up bạn đã định nghĩa trong config */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 animate-fade-in-up">
              <div className="relative transform overflow-hidden rounded-xl bg-surface-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                
                {/* Modal Header */}
                <div className="bg-surface-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-border-light">
                  <div className="sm:flex sm:items-start justify-between">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-xl font-semibold leading-6 text-text-main" id="modal-title">Tạo Khuyến Mãi Mới</h3>
                      <div className="mt-2">
                        <p className="text-sm text-text-secondary">Điền thông tin chi tiết để tạo chương trình khuyến mãi mới.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="text-text-secondary hover:text-text-main"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="px-4 py-6 sm:p-8 space-y-6">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="promo-name" className="block text-sm font-medium text-text-main">Tên chương trình <span className="text-pos-error">*</span></label>
                      <input type="text" id="promo-name" className="mt-1 block w-full rounded-lg border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white py-2.5 px-3 text-text-main" placeholder="Ví dụ: Giảm giá mùa hè" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="promo-code" className="block text-sm font-medium text-text-main">Mã Code (tùy chỉnh)</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border-light bg-background-body text-text-secondary text-sm">#</span>
                        <input type="text" id="promo-code" className="mt-0 block w-full rounded-none rounded-r-lg border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white py-2.5 px-3 uppercase font-mono text-text-main" placeholder="SUMMER20" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-text-main">Loại khuyến mãi</label>
                      <select className="mt-1 block w-full rounded-lg border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white py-2.5 px-3 text-text-main">
                        <option>Giảm giá %</option>
                        <option>Giảm tiền mặt</option>
                        <option>Combo đặc biệt</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-text-main">Giá trị giảm</label>
                      <div className="relative rounded-md shadow-sm">
                        <input type="number" className="block w-full rounded-lg border-border-light pl-3 pr-12 focus:border-primary focus:ring-primary sm:text-sm bg-surface-white py-2.5 text-text-main" placeholder="20" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-text-secondary sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 3 - Conditions */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-main">Điều kiện áp dụng</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background-body p-4 rounded-lg border border-border-light">
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">Giá trị đơn tối thiểu</label>
                        <input type="text" className="block w-full rounded-md border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white text-text-main" placeholder="0đ" />
                      </div>
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">Sản phẩm áp dụng</label>
                        <select className="block w-full rounded-md border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white text-text-main">
                          <option>Tất cả sản phẩm</option>
                          <option>Chỉ Burger</option>
                          <option>Chỉ Đồ uống</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 4 - Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-text-main">Thời gian áp dụng</label>
                      <div className="flex items-center gap-2">
                        <input type="date" className="block w-full rounded-lg border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white text-text-main py-2" />
                        <span className="text-text-secondary">-</span>
                        <input type="date" className="block w-full rounded-lg border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white text-text-main py-2" />
                      </div>
                    </div>
                    <div className="flex items-center h-full pt-6">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                        <div className="relative w-11 h-6 bg-border-light peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-text-main">Kích hoạt ngay</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-text-main">Mô tả chi tiết</label>
                    <textarea id="description" rows="3" className="block w-full rounded-lg border-border-light shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-surface-white px-3 py-2 text-text-main" placeholder="Nhập mô tả cho chương trình..."></textarea>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-background-body px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-border-light">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="inline-flex w-full justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover sm:w-auto transition-colors"
                  >
                    Lưu Khuyến Mãi
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-surface-white px-5 py-2.5 text-sm font-semibold text-text-main shadow-sm ring-1 ring-inset ring-border-light hover:bg-background-body sm:mt-0 sm:w-auto transition-colors"
                  >
                    Hủy bỏ
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PromotionPage;