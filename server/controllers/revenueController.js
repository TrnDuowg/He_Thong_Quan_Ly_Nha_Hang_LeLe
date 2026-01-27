const db = require('../config/db');

exports.getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Nhận tham số từ URL

        // Mặc định lấy 30 ngày gần nhất nếu không truyền
        let sql = `
            SELECT DATE(created_at) as date, 
                   SUM(final_amount) as revenue, 
                   COUNT(*) as order_count 
            FROM Orders 
            WHERE status != 'cancelled'
        `;
        
        const params = [];
        if (startDate && endDate) {
            sql += ` AND DATE(created_at) BETWEEN ? AND ?`;
            params.push(startDate, endDate);
        }
        
        sql += ` GROUP BY DATE(created_at) ORDER BY date ASC`;

        const [rows] = await db.execute(sql, params);
        res.json(rows);
    } catch (e) { 
        console.error(e);
        res.status(500).json({ message: 'Lỗi báo cáo' }); 
    }
};
// [MỚI] Lấy chi tiết đơn hàng trong 1 ngày cụ thể
exports.getDetailsByDate = async (req, res) => {
    try {
        const { date } = req.params; // Nhận ngày dạng YYYY-MM-DD
        
        const sql = `
            SELECT o.id, o.order_code, o.created_at, o.final_amount, o.status, s.full_name as staff_name
            FROM Orders o
            LEFT JOIN Staff s ON o.staff_id = s.id
            WHERE DATE(o.created_at) = ? AND o.status != 'cancelled'
            ORDER BY o.created_at DESC
        `;
        
        const [rows] = await db.execute(sql, [date]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy chi tiết' });
    }
};
// [MỚI] Thống kê tỷ trọng thanh toán
exports.getPaymentStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        // Tính tổng tiền theo payment_method trong khoảng thời gian
        const sql = `
            SELECT payment_method, SUM(amount) as total_amount
            FROM Payments
            WHERE DATE(created_at) BETWEEN ? AND ?
            GROUP BY payment_method
        `;
        
        const [rows] = await db.execute(sql, [startDate, endDate]);
        
        // Chuẩn hóa dữ liệu trả về (Nếu không có dữ liệu thì trả mảng rỗng)
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi thống kê thanh toán' });
    }
};