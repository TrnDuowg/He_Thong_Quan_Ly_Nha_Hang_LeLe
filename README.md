# HỆ THỐNG QUẢN LÝ NHÀ HÀNG ĐỒ ĂN NHANH LELE
Bài tập Lớn môn Phân tích và Thiết kế hệ thống - Đại học Bách Khoa Hà Nội.

MI3120 - Mã lớp: 163628.
# 1. Thông tin nhóm sinh viên
- Trần Đoàn Hoàng Anh: 20237294
- Đặng Thị Thùy Dương: 20237321
- Trần Công Dương: 20237321
- Nguyễn Thị Minh Hằng: 20237324
# 2. Cấu trúc mã nguồn
Mã nguồn Frontend được xây dựng bằng ReactJS (Vite), tổ chức theo cấu trúc phân hệ rõ ràng:

- `src/main.jsx`: Điểm khởi chạy chính của ứng dụng, render DOM ảo.
- `src/App.jsx`: Component gốc, chứa cấu hình Router để điều hướng giữa các phân hệ (Admin, POS, Bếp, Khách hàng).
- `src/layouts/`: Các khung giao diện mẫu (Layout) cho từng đối tượng người dùng:
  - `AdminLayout.jsx`: Layout quản trị với thanh sidebar.
  - `POSLayout.jsx`: Layout bán hàng tối ưu cho thao tác chạm/nhanh.
  - `KitchenLayout.jsx`: Layout hiển thị thông tin đơn hàng cho bếp.
  - `CustomerLayout.jsx`: Layout thân thiện cho khách hàng tự đặt món.
- `src/context/OrderContext.jsx`: Quản lý trạng thái toàn cục (Global State) về đơn hàng và giỏ hàng, giúp đồng bộ dữ liệu giữa các component.
- `src/pages/admin/`: Các trang chức năng của Quản lý:
  - `Dashboard.jsx`: Thống kê tổng quan.
  - `ProductPage.jsx`, `ComboPage.jsx`: Quản lý danh sách món ăn và combo.
  - `StaffPage.jsx`, `StaffSchedule.jsx`, `ShiftPage.jsx`: Quản lý nhân viên, lịch làm việc và phân ca.
  - `RevenuePage.jsx`, `PromotionPage.jsx`: Báo cáo doanh thu và quản lý khuyến mãi.
- `src/pages/pos/`: Các trang chức năng của Thu ngân:
  - `POSLogin.jsx`, `OpenShiftModal.jsx`, `EndShift.jsx`: Quy trình đóng/mở ca làm việc.
  - `TableMap.jsx`: Sơ đồ bàn trực quan.
  - `OrderPage.jsx`: Giao diện gọi món tại quầy.
  - `DeliveryPage.jsx`: Quản lý đơn giao hàng.
- `src/pages/kitchen/`: Phân hệ hiển thị bếp (KDS):
  - `KitchenLive.jsx`: Màn hình nhận đơn thời gian thực.
  - `KitchenHistory.jsx`: Lịch sử các món đã trả.
- `src/pages/customer/`: Giao diện Web App cho khách hàng:
  - `Home.jsx`, `Menu.jsx`: Trang chủ và thực đơn đặt món.
  - `Cart.jsx`: Giỏ hàng.
  - `OrderTracking.jsx`: Theo dõi trạng thái đơn hàng.
- `vite.config.js`, `tailwind.config.js`: Các tệp cấu hình cho công cụ build Vite và thư viện giao diện TailwindCSS.

## 3. Mô tả tổng quan
Hệ thống được thiết kế để số hóa toàn diện quy trình vận hành của nhà hàng FastFood với 4 phân hệ chính:

### Phân hệ Khách hàng (Customer Web App)
- **Đặt món đa nền tảng**: Khách có thể xem menu, chọn món, chọn size/topping và thêm ghi chú cho bếp.
- **Theo dõi đơn hàng**: Xem tiến trình thực tế của đơn hàng (Đang chuẩn bị -> Sẵn sàng -> Đang giao).
- **Cá nhân hóa**: Quản lý hồ sơ cá nhân và lịch sử đặt hàng.

### Phân hệ Thu ngân (POS - Point of Sale)
- **Quản lý ca làm việc**: Kiểm soát quy trình mở ca, chốt ca, tổng kết tiền mặt đầu/cuối ca.
- **Bán hàng tại quầy**: Giao diện chọn món nhanh, hỗ trợ sơ đồ bàn (Table Map) để quản lý trạng thái bàn trống/có khách.
- **Quản lý giao hàng**: Xử lý các đơn hàng mang đi và giao tận nơi.

### Phân hệ Bếp (Kitchen Display System)
- **Hiển thị thời gian thực**: Thay thế máy in bill, hiển thị danh sách món cần làm ngay lập tức.
- **Tương tác trực tiếp**: Đầu bếp tích chọn hoàn thành từng món hoặc cả đơn để thông báo ra ngoài (cho khách hoặc phục vụ).
- **Lịch sử chế biến**: Xem lại danh sách các món đã hoàn thành trong ngày.

### Phân hệ Quản trị (Admin Dashboard)
- **Quản lý tài nguyên**: Thêm/Sửa/Xóa Món ăn, Combo, và Nhân viên.
- **Quản lý vận hành**: Sắp xếp lịch làm việc, phân ca cho nhân viên.
- **Báo cáo thống kê**: Xem biểu đồ doanh thu, hiệu suất bán hàng và quản lý các chương trình khuyến mãi.



