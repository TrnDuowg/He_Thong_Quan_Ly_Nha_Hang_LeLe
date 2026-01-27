const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken'); // Thư viện tạo "vé" đăng nhập

// Khóa bí mật (Giống như con dấu riêng của nhà hàng)
const SECRET_KEY = process.env.JWT_SECRET || 'mat_khau_bi_mat_cua_server';

exports.login = async (req, res) => {
    try {
        // 1. Nhận dữ liệu từ Frontend gửi lên
        const { username, password } = req.body;

        // 2. Gọi Model để tìm xem user có tồn tại không
        const user = await Staff.findByUsername(username);

        // Nếu không tìm thấy user
        if (!user) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại!' });
        }

        // 3. Kiểm tra mật khẩu (So sánh cái gửi lên và cái trong DB)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Sai mật khẩu!' });
        }

        // 4. Nếu đúng hết, tạo một cái "Vé" (Token)
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.full_name },
            SECRET_KEY,
            { expiresIn: '24h' } // Vé có hạn 24 giờ
        );

        // 5. Trả về kết quả cho React
        res.json({
            message: 'Đăng nhập thành công',
            token: token,
            // 👇 QUAN TRỌNG: Đặt tên thống nhất là 'user'
            user: { 
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};