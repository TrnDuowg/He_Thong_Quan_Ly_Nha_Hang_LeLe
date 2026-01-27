const db = require('../config/db');

// Lấy danh sách bàn kèm tổng tiền đang phục vụ
exports.getTables = async (req, res) => {
    try {
        // SQL: Tính tổng tiền các đơn chưa thanh toán (pending + processing)
        const sql = `
            SELECT 
                t.*,
                (
                    SELECT SUM(final_amount) 
                    FROM Orders o 
                    WHERE o.table_id = t.id AND o.status IN ('pending', 'processing')
                ) as current_total,
                (
                    SELECT COUNT(*) 
                    FROM Order_Details od 
                    JOIN Orders o ON od.order_id = o.id 
                    WHERE o.table_id = t.id AND o.status IN ('pending', 'processing')
                ) as item_count
            FROM Dining_Tables t
        `;
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật trạng thái (Dùng cho POS)
exports.updateTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.execute('UPDATE Dining_Tables SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// [MỚI] Thêm bàn mới
exports.createTable = async (req, res) => {
    try {
        const { name, capacity } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên bàn là bắt buộc' });

        const sql = 'INSERT INTO Dining_Tables (name, capacity, status) VALUES (?, ?, "available")';
        await db.execute(sql, [name, capacity || 4]); // Mặc định 4 ghế
        res.json({ message: 'Thêm bàn thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thêm bàn' });
    }
};

// [MỚI] Sửa thông tin bàn
exports.updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, capacity } = req.body;
        const sql = 'UPDATE Dining_Tables SET name = ?, capacity = ? WHERE id = ?';
        await db.execute(sql, [name, capacity, id]);
        res.json({ message: 'Sửa bàn thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi sửa bàn' });
    }
};

// [MỚI] Xóa bàn
exports.deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM Dining_Tables WHERE id = ?', [id]);
        res.json({ message: 'Xóa bàn thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa bàn' });
    }
};