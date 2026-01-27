-- 1. Tạo Database
CREATE DATABASE IF NOT EXISTS fastfood_db;
USE fastfood_db;

-- =============================================
-- NHÓM 1: CÁC BẢNG DANH MỤC (Không có Foreign Key)
-- =============================================

-- Bảng Staff (Nhân viên)
CREATE TABLE Staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(30) NOT NULL, -- Vd: 'admin', 'kitchen', 'cashier'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Customers (Khách hàng)
CREATE TABLE Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(120),
    membership_tier VARCHAR(30) DEFAULT 'Bronze',
    current_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Categories (Danh mục món)
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- Vd: 'food', 'drink'
    display_order INT DEFAULT 0
);

-- Bảng Modifiers (Topping/Tùy chọn thêm)
CREATE TABLE Modifiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_name VARCHAR(80), -- Vd: 'Size', 'Độ ngọt'
    name VARCHAR(120) NOT NULL, -- Vd: 'Size L', 'Ít đường'
    price_extra DECIMAL(12,2) DEFAULT 0.00
);

-- Bảng Dining_Tables (Bàn ăn)
CREATE TABLE Dining_Tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- Vd: 'Bàn 1', 'Bàn 2'
    capacity INT DEFAULT 4,
    status VARCHAR(30) DEFAULT 'available' -- 'available', 'occupied', 'reserved'
);

-- Bảng Promotions (Khuyến mãi)
CREATE TABLE Promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL, -- 'percent', 'fixed'
    discount_value DECIMAL(12,2) NOT NULL,
    min_order_value DECIMAL(12,2) DEFAULT 0.00
);

-- =============================================
-- NHÓM 2: SẢN PHẨM VÀ LIÊN KẾT (Cấp 2)
-- =============================================

-- Bảng Products (Món ăn)
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    is_combo TINYINT(1) DEFAULT 0, -- 0: Món lẻ, 1: Combo
    is_active TINYINT(1) DEFAULT 1,
    image_url VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- Bảng liên kết Món ăn - Modifier (Món nào có topping nào)
CREATE TABLE Product_Modifier_Link (
    product_id INT,
    modifier_id INT,
    PRIMARY KEY (product_id, modifier_id),
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (modifier_id) REFERENCES Modifiers(id) ON DELETE CASCADE
);

-- Bảng cấu hình Combo (Nếu món là Combo thì gồm những món con nào)
CREATE TABLE Combo_Config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    combo_product_id INT, -- ID của món Combo cha
    item_product_id INT,  -- ID của món con bên trong
    quantity INT DEFAULT 1,
    is_swappable TINYINT(1) DEFAULT 0, -- Có được đổi món không
    FOREIGN KEY (combo_product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (item_product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- =============================================
-- NHÓM 3: QUẢN LÝ CA LÀM VIỆC (Shift)
-- =============================================

CREATE TABLE Shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    start_cash DECIMAL(12,2) DEFAULT 0.00,
    total_difference DECIMAL(12,2) DEFAULT 0.00, -- Chênh lệch tiền cuối ca
    FOREIGN KEY (staff_id) REFERENCES Staff(id)
);

CREATE TABLE Shift_Settlements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shift_id INT,
    payment_method VARCHAR(30), -- 'cash', 'card', 'transfer'
    system_amount DECIMAL(12,2) DEFAULT 0.00, -- Tiền hệ thống tính
    actual_amount DECIMAL(12,2) DEFAULT 0.00, -- Tiền thực tế đếm được
    difference DECIMAL(12,2) DEFAULT 0.00,
    note VARCHAR(255),
    FOREIGN KEY (shift_id) REFERENCES Shifts(id) ON DELETE CASCADE
);

CREATE TABLE Shift_Reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shift_id INT,
    total_revenue DECIMAL(12,2),
    total_orders INT,
    FOREIGN KEY (shift_id) REFERENCES Shifts(id) ON DELETE CASCADE
);

-- =============================================
-- NHÓM 4: ĐẶT BÀN & ĐƠN HÀNG (Quan trọng nhất)
-- =============================================

-- Đặt bàn trước
CREATE TABLE IF NOT EXISTS Reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(120),
    phone VARCHAR(20),
    booking_time DATETIME NOT NULL,
    guests INT DEFAULT 2,
    table_id INT,
    status VARCHAR(30) DEFAULT 'pending', -- pending, confirmed, cancelled, seated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES Dining_Tables(id)
);

-- Đơn hàng (Orders)
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT NULL, -- Có thể NULL nếu khách vãng lai
    staff_id INT,
    table_id INT NULL,    -- Có thể NULL nếu mang về
    promotion_id INT NULL,
    order_type VARCHAR(30) DEFAULT 'dine_in', -- 'dine_in', 'takeaway', 'delivery'
    subtotal_amount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) DEFAULT 0.00,
    customer_tax_info VARCHAR(255),
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES Staff(id),
    FOREIGN KEY (table_id) REFERENCES Dining_Tables(id) ON DELETE SET NULL,
    FOREIGN KEY (promotion_id) REFERENCES Promotions(id) ON DELETE SET NULL
);

-- Chi tiết đơn hàng (Món ăn trong đơn)
CREATE TABLE Order_Details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL, -- Lưu giá tại thời điểm bán
    total_price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Modifier đã chọn cho từng món trong đơn (Vd: Ly cafe đó chọn Ít đường)
CREATE TABLE Order_Detail_Modifiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_detail_id INT,
    modifier_id INT,
    price_at_sale DECIMAL(12,2) NOT NULL, -- Giá modifier tại thời điểm bán
    FOREIGN KEY (order_detail_id) REFERENCES Order_Details(id) ON DELETE CASCADE,
    FOREIGN KEY (modifier_id) REFERENCES Modifiers(id)
);

-- =============================================
-- NHÓM 5: HẬU CẦN (Bếp, Thanh toán, Giao hàng)
-- =============================================

-- Hàng đợi bếp (Kitchen)
CREATE TABLE Kitchen_Queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_detail_id INT,
    station VARCHAR(30), -- Vd: 'Bếp nóng', 'Quầy pha chế'
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'cooking', 'ready', 'served'
    started_at DATETIME,
    FOREIGN KEY (order_detail_id) REFERENCES Order_Details(id) ON DELETE CASCADE
);

-- Thanh toán
CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(30), -- 'cash', 'card', 'momo'
    amount DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);

-- Thông tin giao hàng (Cho đơn Delivery)
CREATE TABLE Delivery_Info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    customer_name VARCHAR(120),
    phone VARCHAR(20),
    address VARCHAR(255),
    shipping_fee DECIMAL(12,2) DEFAULT 0.00,
    shipper_name VARCHAR(120),
    status VARCHAR(30) DEFAULT 'finding_driver',
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);

CREATE TABLE Delivery_Logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT,
    status_update VARCHAR(80),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES Delivery_Info(id) ON DELETE CASCADE
);

-- =============================================
-- NHÓM 6: LỊCH SỬ & LOGS
-- =============================================

-- Lịch sử tích điểm
CREATE TABLE Point_History (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_id INT,
    type VARCHAR(20), -- 'earn', 'redeem'
    points_change INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE SET NULL
);

-- Log thao tác đơn hàng (Để audit ai hủy món, ai giảm giá...)
CREATE TABLE Order_Logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT,
    order_id INT,
    action VARCHAR(80),
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES Staff(id),
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);

CREATE TABLE Schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    work_date DATE NOT NULL,
    shift_type VARCHAR(20) NOT NULL, -- 'morning', 'afternoon', 'full'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES Staff(id) ON DELETE CASCADE,
    UNIQUE KEY unique_schedule (staff_id, work_date) -- Một người 1 ngày chỉ có 1 ca
);

CREATE TABLE Settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(100) DEFAULT 'FastFood Lele',
    address VARCHAR(255) DEFAULT '123 Cầu Giấy, Hà Nội',
    phone VARCHAR(20) DEFAULT '1900 1000',
    wifi_pass VARCHAR(50) DEFAULT 'Lelelele',
    tax_rate INT DEFAULT 8,
    currency VARCHAR(10) DEFAULT 'VND'
);

-- Tạo dòng dữ liệu mặc định
INSERT INTO Settings (id, store_name) VALUES (1, 'FastFood Lele')
ON DUPLICATE KEY UPDATE id=1;
-- Thêm dữ liệu mẫu cho tuần này (để test hiển thị)
INSERT INTO Schedules (staff_id, work_date, shift_type) VALUES 
(1, CURDATE(), 'morning'),
(1, CURDATE() + INTERVAL 1 DAY, 'full'),
(2, CURDATE(), 'afternoon');

-- =============================================
-- TẠO DỮ LIỆU MẪU (SEED DATA - OPTIONAL)
-- Để bạn có tài khoản đăng nhập ngay
-- =============================================

-- Mật khẩu ở đây là '123456' (đã hash mẫu, thực tế code backend sẽ hash sau)
INSERT INTO Staff (username, password, full_name, role) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere...', 'Quản trị viên', 'admin');

INSERT INTO Categories (name, type) VALUES ('Burger', 'food'), ('Đồ uống', 'drink');

USE fastfood_db;

-- Tạo một nhân viên là Admin, mật khẩu là '123456'
INSERT INTO Staff (username, password, full_name, role) 
VALUES ('admin', '123456', 'Quản Trị Viên', 'admin');

USE fastfood_db;

-- 1. Tạo danh mục
INSERT INTO Categories (name, type, display_order) VALUES 
('Burger & Cơm', 'food', 1),
('Gà Rán', 'food', 2),
('Thức Uống', 'drink', 3),
('Tráng Miệng', 'food', 4);

-- 2. Tạo món ăn (Lưu ý: image_url đang dùng ảnh mẫu trên mạng)
INSERT INTO Products (category_id, name, price, image_url, is_active) VALUES 
(1, 'Burger Bò Phô Mai', 45000, 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', 1),
(1, 'Burger Tôm Hùm', 65000, 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', 1),
(1, 'Cơm Gà Sốt Cay', 40000, 'https://cdn-icons-png.flaticon.com/512/706/706164.png', 1),
(2, 'Gà Rán Giòn (1 miếng)', 32000, 'https://cdn-icons-png.flaticon.com/512/10609/10609386.png', 1),
(2, 'Combo Gà Rán (3 miếng)', 89000, 'https://cdn-icons-png.flaticon.com/512/10609/10609386.png', 1),
(3, 'Coca Cola Tươi', 15000, 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png', 1),
(3, 'Trà Đào Cam Sả', 25000, 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png', 1),
(4, 'Kem Vani', 10000, 'https://cdn-icons-png.flaticon.com/512/9373/9373733.png', 1);
ALTER TABLE Order_Details ADD COLUMN note VARCHAR(255) NULL;
INSERT INTO Dining_Tables (name, capacity, status) VALUES 
('Bàn 01', 4, 'available'), ('Bàn 02', 4, 'occupied'), 
('Bàn 03', 2, 'available'), ('Bàn 04', 6, 'reserved'),
('Bàn 05', 4, 'available'), ('Bàn 06', 4, 'available');

INSERT INTO Shifts (staff_id, start_time, start_cash) VALUES 
(1, NOW() - INTERVAL 8 HOUR, 1000000), -- Ca đang chạy
(1, NOW() - INTERVAL 1 DAY, 1000000);  -- Ca hôm qua

ALTER TABLE Shifts
ADD COLUMN total_revenue DECIMAL(12,2) DEFAULT 0.00,
ADD COLUMN end_cash DECIMAL(12,2) DEFAULT 0.00,
ADD COLUMN difference DECIMAL(12,2) DEFAULT 0.00,
ADD COLUMN note TEXT NULL;


ALTER TABLE Products MODIFY COLUMN image_url TEXT;
ALTER TABLE Customers ADD COLUMN password VARCHAR(255) NULL;

INSERT INTO Customers (name, phone, password) 
VALUES ('Khách Demo', '0909000111', '123456');
INSERT INTO Dining_Tables (name, capacity, status) VALUES 
('Bàn 25', 4, 'available'), ('Bàn 28', 4, 'available'), 
('Bàn 26', 2, 'available'), ('Bàn 29', 6, 'available'),
('Bàn 27', 4, 'available'), ('Bàn 30', 4, 'available');

UPDATE Categories SET name = 'Burger', display_order = 1 WHERE id = 1;
UPDATE Categories SET name = 'Gà rán', display_order = 2 WHERE id = 4;
UPDATE Categories SET name = 'Đồ uống', display_order = 3 WHERE id = 2;
UPDATE Categories SET name = 'Tráng miệng', display_order = 4 WHERE id = 6;

-- Xóa các mục thừa (như Combo & Cơm cũ hoặc Thức uống trùng lặp)
DELETE FROM Categories WHERE id IN (3, 5);

-- Thêm các mục còn thiếu
INSERT INTO Categories (name, type, display_order) VALUES 
('Combo', 'food', 5),
('Cơm', 'food', 6),
('Khác', 'food', 7);

USE fastfood_db;
SET SQL_SAFE_UPDATES = 0;
-- 1. Biến tất cả các món đang NULL thành món lẻ (0)
UPDATE Products SET is_combo = 0 WHERE is_combo IS NULL;

-- 2. Đảm bảo tất cả đang ở trạng thái Kinh doanh
UPDATE Products SET is_active = 1 WHERE is_active IS NULL;
SET SQL_SAFE_UPDATES = 1;

