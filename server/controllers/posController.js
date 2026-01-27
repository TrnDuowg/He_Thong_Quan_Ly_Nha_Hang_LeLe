const db = require('../config/db');

exports.getPosStats = async (req, res) => {
    try {
        // 1. Đếm đơn chờ xử lý (Pending)
        const [pendingOrders] = await db.execute(`
            SELECT COUNT(*) as count FROM Orders WHERE status = 'pending'
        `);

        // 2. Tính doanh thu ca hiện tại (Giả sử ca bắt đầu từ 6h sáng hôm nay)
        const startOfShift = new Date();
        startOfShift.setHours(6, 0, 0, 0); 
        
        const [revenue] = await db.execute(`
            SELECT SUM(final_amount) as total 
            FROM Orders 
            WHERE created_at >= ? AND status != 'cancelled'
        `, [startOfShift]);

        // 3. Thống kê bàn (SỬA LỖI TẠI ĐÂY)
        // Đổi tên alias từ 'empty' thành 'empty_count' để tránh lỗi cú pháp SQL
          const [tables] = await db.execute(`
            SELECT 
                SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as count_empty,
                SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as count_occupied
            FROM Dining_Tables
        `);

         // 4. Lấy danh sách đơn cần xử lý (Pending)
        const [recentOrders] = await db.execute(`
            SELECT id, order_code, created_at, status, final_amount, order_type
            FROM Orders 
            WHERE status = 'pending' -- Chỉ lấy đơn chưa duyệt
            ORDER BY created_at ASC -- Đơn cũ nhất lên đầu để duyệt trước
            LIMIT 10
        `);

        // Trả về dữ liệu (Map lại tên key cho khớp với Frontend)
        res.json({
            pendingCount: pendingOrders[0].count,
            shiftRevenue: revenue[0].total || 0,
            tables: {
                empty: Number(tables[0].count_empty || 0), // Map lại cho frontend
                occupied: Number(tables[0].count_occupied || 0)
            },
            recentOrders
        });

    } catch (error) {
        console.error("Lỗi POS Stats:", error); // Log lỗi ra để dễ debug
        res.status(500).json({ message: 'Lỗi lấy số liệu POS' });
    }
};