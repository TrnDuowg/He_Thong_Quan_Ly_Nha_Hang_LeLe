const db = require('../config/db');

// Lấy danh sách khuyến mãi
exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Promotions ORDER BY id DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ message: 'Lỗi server' }); }
};

// Tạo mã mới
exports.create = async (req, res) => {
    try {
        const { code, discount_type, discount_value, min_order_value } = req.body;
        
        // Kiểm tra trùng mã
        const [exists] = await db.execute('SELECT * FROM Promotions WHERE code = ?', [code]);
        if (exists.length > 0) return res.status(400).json({ message: 'Mã này đã tồn tại!' });

        const sql = `INSERT INTO Promotions (code, discount_type, discount_value, min_order_value) VALUES (?, ?, ?, ?)`;
        await db.execute(sql, [code, discount_type, discount_value, min_order_value || 0]);
        
        res.json({ message: 'Tạo mã thành công' });
    } catch (e) { res.status(500).json({ message: 'Lỗi tạo mã' }); }
};

// Xóa mã
exports.delete = async (req, res) => {
    try {
        await db.execute('DELETE FROM Promotions WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa' });
    } catch (e) { res.status(500).json({ message: 'Lỗi xóa' }); }
};
// [MỚI] Kiểm tra mã giảm giá
exports.checkVoucher = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;

        // 1. Tìm mã trong DB
        const [rows] = await db.execute('SELECT * FROM Promotions WHERE code = ?', [code]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Mã giảm giá không tồn tại' });
        }

        const voucher = rows[0];

        // 2. Kiểm tra điều kiện (Ví dụ: Đơn tối thiểu)
        if (orderTotal < voucher.min_order_value) {
            return res.status(400).json({ 
                message: `Đơn hàng phải từ ${Number(voucher.min_order_value).toLocaleString()}đ mới được áp dụng!` 
            });
        }

        // 3. Tính số tiền giảm
        let discountAmount = 0;
        if (voucher.discount_type === 'percent') {
            discountAmount = orderTotal * (voucher.discount_value / 100);
        } else {
            discountAmount = voucher.discount_value;
        }

        // Trả về số tiền được giảm
        res.json({ 
            success: true, 
            discountAmount: discountAmount,
            message: 'Áp dụng mã thành công!' 
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Lỗi kiểm tra mã' });
    }
};