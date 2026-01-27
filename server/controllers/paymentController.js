const db = require('../config/db');

exports.processPayment = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { order_id, payment_method, amount_received, amount_total } = req.body;

        // 1. Lưu vào bảng Payments
        const sqlPayment = `INSERT INTO Payments (order_id, payment_method, amount, created_at) VALUES (?, ?, ?, NOW())`;
        await connection.execute(sqlPayment, [order_id, payment_method, amount_total]);

        // 2. Cập nhật trạng thái đơn hàng -> 'paid' (hoặc 'completed' nếu giao luôn)
        // Lưu ý: Nếu là mô hình F&B, thường thanh toán xong là chờ chế biến -> 'processing'
        // Nhưng nếu là Fastfood mang đi luôn thì 'completed'
        const sqlUpdateOrder = `UPDATE Orders SET status = 'processing', payment_status = 'paid' WHERE id = ?`;
        await connection.execute(sqlUpdateOrder, [order_id]);

        await connection.commit();
        res.json({ message: 'Thanh toán thành công' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Lỗi thanh toán' });
    } finally {
        connection.release();
    }
};