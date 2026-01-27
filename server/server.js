const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cấu hình
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (Quan trọng để kết nối với React)
app.use(cors()); // Cho phép React truy cập
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên

// Import Database (để server chạy thì kết nối DB luôn)
require('./config/db');

// --- [MỚI 1] Import Route vừa tạo ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tableRoutes = require('./routes/tableRoutes');
const staffRoutes = require('./routes/staffRoutes');

// --- [MỚI 2] Sử dụng Route ---
// Nghĩa là: Tất cả đường dẫn bắt đầu bằng /api/auth sẽ vào authRoutes xử lý
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/tables', tableRoutes);
app.use('/api/promotions', require('./routes/promotionRoutes'));
app.use('/api/revenue', require('./routes/revenueRoutes'));
app.use('/api/shifts', require('./routes/shiftRoutes'));
app.use('/api/staff', staffRoutes);
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/pos', require('./routes/posRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
// Route Test cơ bản
app.get('/', (req, res) => {
    res.send('<h1>Backend Nhà Hàng FastFood đang chạy! 🚀</h1>');
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});