const db = require('../config/db');

exports.getCategories = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Categories ORDER BY display_order ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};