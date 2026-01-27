const db = require('../config/db');

// Lấy cấu hình
exports.getSettings = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Settings WHERE id = 1');
        res.json(rows[0] || {});
    } catch (e) { res.status(500).json({ message: 'Lỗi server' }); }
};

// Cập nhật cấu hình
exports.updateSettings = async (req, res) => {
    try {
        const { store_name, address, phone, wifi_pass, tax_rate } = req.body;
        const sql = `
            UPDATE Settings 
            SET store_name = ?, address = ?, phone = ?, wifi_pass = ?, tax_rate = ?
            WHERE id = 1
        `;
        await db.execute(sql, [store_name, address, phone, wifi_pass, tax_rate]);
        res.json({ message: 'Lưu cài đặt thành công' });
    } catch (e) { res.status(500).json({ message: 'Lỗi cập nhật' }); }
};