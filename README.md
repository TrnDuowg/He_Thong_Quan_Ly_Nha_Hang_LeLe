# HỆ THỐNG QUẢN LÝ NHÀ HÀNG ĐỒ ĂN NHANH LELE
**Bài tập Lớn môn Phân tích và Thiết kế hệ thống - Đại học Bách Khoa Hà Nội.**

**MI3120 - Mã lớp: 163628.**

---

## 1. Thông tin nhóm sinh viên
- **Trần Đoàn Hoàng Anh**: 20237297
- **Đặng Thị Thùy Dương**: 20237318
- **Trần Công Dương**: 20237321
- **Nguyễn Thị Minh Hằng**: 20237324

---

## 2. Cấu trúc mã nguồn & Công nghệ
Dự án được xây dựng theo mô hình **Client-Server (Fullstack)** với cấu trúc Monorepo.

### A. Client (Frontend)
Mã nguồn Frontend được xây dựng bằng **ReactJS (Vite)** + **TailwindCSS**, tổ chức theo cấu trúc phân hệ rõ ràng trong thư mục `client/`:

- `src/main.jsx`: Điểm khởi chạy chính của ứng dụng, render DOM ảo.
- `src/App.jsx`: Component gốc, chứa cấu hình Router bảo vệ (Protected Route) để điều hướng và phân quyền giữa các phân hệ (Admin, POS, Bếp, Khách hàng).
- **`src/layouts/`**: Các khung giao diện mẫu cho từng đối tượng:
  - `AdminLayout.jsx`: Layout quản trị với Sidebar điều hướng.
  - `POSLayout.jsx`: Layout bán hàng tối ưu cho thao tác nhanh.
  - `KitchenLayout.jsx`: Layout hiển thị KDS cho bếp.
  - `CustomerLayout.jsx`: Layout Mobile-first cho khách hàng.
- **`src/pages/admin/`**: Các trang chức năng của Quản lý:
  - `Dashboard.jsx`, `RevenuePage.jsx`: Thống kê và báo cáo doanh thu.
  - `ProductPage.jsx`, `ComboPage.jsx`: Quản lý thực đơn và combo.
  - `StaffPage.jsx`, `StaffSchedule.jsx`, `ShiftPage.jsx`: Quản lý nhân sự, lịch làm việc và đối soát ca.
  - `PromotionPage.jsx`, `SettingsPage.jsx`: Quản lý khuyến mãi và cấu hình hệ thống.
- **`src/pages/pos/`**: Các trang chức năng của Thu ngân:
  - `POSDashboard.jsx`, `POSLogin.jsx`: Màn hình tổng quan và đăng nhập.
  - `OpenShiftModal.jsx`, `EndShift.jsx`: Quy trình mở/chốt ca nghiêm ngặt.
  - `TableMap.jsx`, `OrderPage.jsx`: Sơ đồ bàn và giao diện bán hàng (Order/Payment).
  - `DeliveryPage.jsx`: Quản lý đơn giao hàng.
- **`src/pages/kitchen/`**: Phân hệ hiển thị bếp (KDS):
  - `KitchenLive.jsx`: Nhận đơn thời gian thực (Real-time).
  - `KitchenHistory.jsx`: Lịch sử chế biến.
- **`src/pages/customer/`**: Web App cho khách hàng:
  - `Home.jsx`, `Menu.jsx`, `Cart.jsx`: Luồng đặt món.
  - `OrderTracking.jsx`: Tra cứu trạng thái đơn hàng.

### B. Server (Backend)
Mã nguồn Backend được xây dựng bằng **Node.js** + **Express**, sử dụng CSDL **MySQL**, tổ chức trong thư mục `server/`:

- `server.js`: File khởi chạy Server, cấu hình CORS và kết nối các Routes.
- **`config/db.js`**: Cấu hình kết nối cơ sở dữ liệu MySQL (sử dụng Connection Pool để tối ưu hiệu năng).
- **`models/`**: (Model Layer) Chứa các Class tương tác trực tiếp với Database, thực thi các câu lệnh SQL (CRUD).
  - `Order.js`: Xử lý transaction tạo đơn hàng, chi tiết đơn và lịch sử.
  - `Product.js`: Truy vấn dữ liệu món ăn, combo.
  - `Staff.js`: Xử lý thông tin nhân viên.
- **`controllers/`**: (Controller Layer) Xử lý logic nghiệp vụ, nhận request từ Frontend và trả về response.
  - `authController.js`: Xử lý đăng nhập, cấp phát Token.
  - `orderController.js`: Xử lý luồng đặt món, thanh toán, cập nhật trạng thái đơn (Bếp/Giao vận).
  - `revenueController.js`, `posController.js`: Tính toán báo cáo, thống kê doanh thu.
  - `shiftController.js`, `tableController.js`: Quản lý ca làm việc và trạng thái bàn ăn.
- **`routes/`**: (Route Layer) Định nghĩa các API Endpoints (RESTful API).
  - `authRoutes.js`, `productRoutes.js`, `orderRoutes.js`, `staffRoutes.js`...
- **`database.sql`**: File Script SQL dùng để khởi tạo cấu trúc bảng và dữ liệu mẫu ban đầu.

---

## 3. Mô tả tổng quan chức năng
Hệ thống được thiết kế để số hóa toàn diện quy trình vận hành của nhà hàng FastFood với 4 phân hệ chính liên kết chặt chẽ:

### 1. Phân hệ Khách hàng (Customer Web App)
- **Đặt món đa nền tảng**: Khách có thể xem menu, chọn món, chọn size/topping và thêm ghi chú cho bếp.
- **Theo dõi đơn hàng**: Xem tiến trình thực tế của đơn hàng (Đang chuẩn bị -> Sẵn sàng -> Đang giao).
- **Cá nhân hóa**: Đăng nhập/Đăng ký, Quản lý hồ sơ và xem lại lịch sử đặt hàng.

### 2. Phân hệ Thu ngân (POS - Point of Sale)
- **Quản lý ca làm việc**: Kiểm soát chặt chẽ quy trình mở ca (nhập tiền đầu ca), chốt ca (đối soát doanh thu thực tế và hệ thống).
- **Bán hàng tại quầy**: Giao diện chọn món nhanh, hỗ trợ Sơ đồ bàn (Table Map) cập nhật trạng thái bàn (Trống/Có khách/Đặt trước) theo thời gian thực.
- **Thanh toán & In hóa đơn**: Tính toán thuế, khuyến mãi và hỗ trợ in phiếu thanh toán.
- **Quản lý giao hàng**: Điều phối đơn hàng cho Shipper.

### 3. Phân hệ Bếp (Kitchen Display System)
- **Hiển thị thời gian thực**: Thay thế máy in bill giấy, hiển thị danh sách món cần làm ngay lập tức khi POS hoặc Khách hàng đặt đơn.
- **Quy trình chế biến**: Chuyển trạng thái đơn từ "Đang nấu" -> "Hoàn thành".
- **Lịch sử**: Tra cứu và khôi phục các đơn đã hoàn thành nếu có sai sót.

### 4. Phân hệ Quản trị (Admin Dashboard)
- **Quản lý tài nguyên**: Thêm/Sửa/Xóa Món ăn, Combo, và tạo tài khoản Nhân viên.
- **Quản lý vận hành**: Sắp xếp lịch làm việc, phân ca cho nhân viên.
- **Báo cáo thống kê**: Biểu đồ trực quan về doanh thu, top món bán chạy, hiệu suất nhân viên theo ngày/tháng.
- **Cấu hình hệ thống**: Thiết lập thông tin nhà hàng, thuế, wifi...
