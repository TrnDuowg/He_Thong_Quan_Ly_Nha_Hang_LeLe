const db = require('../config/db');

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        
        // Check trùng SĐT
        const [exists] = await db.execute('SELECT * FROM Customers WHERE phone = ?', [phone]);
        if (exists.length > 0) return res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });

        // Tạo user (Thực tế nên hash password, ở đây demo lưu text)
        await db.execute('INSERT INTO Customers (name, phone, password) VALUES (?, ?, ?)', [name, phone, password]);
        
        res.json({ message: 'Đăng ký thành công' });
    } catch (e) { res.status(500).json({ message: 'Lỗi server' }); }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const [users] = await db.execute('SELECT * FROM Customers WHERE phone = ?', [phone]);
        
        if (users.length === 0 || users[0].password !== password) {
            return res.status(401).json({ message: 'Sai số điện thoại hoặc mật khẩu' });
        }

        const user = users[0];
        // Trả về thông tin khách
        res.json({
            message: 'Đăng nhập thành công',
            customer: { id: user.id, name: user.name, phone: user.phone, points: user.current_points }
        });
    } catch (e) { res.status(500).json({ message: 'Lỗi server' }); }
};