const db = require('../config/db');

// 1. Lấy danh sách tất cả nhân viên
exports.getAllStaff = async (req, res) => {
    try {
        // Lấy tất cả cột trừ mật khẩu (để bảo mật)
        const sql = 'SELECT id, username, full_name, role, created_at FROM Staff ORDER BY id DESC';
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách nhân viên' });
    }
};

// 2. Tạo nhân viên mới
exports.createStaff = async (req, res) => {
    try {
        const { username, password, full_name, role } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password || !full_name) {
            return res.status(400).json({ message: 'Vui lòng điền đủ thông tin' });
        }

        // Kiểm tra xem username đã tồn tại chưa
        const [exists] = await db.execute('SELECT * FROM Staff WHERE username = ?', [username]);
        if (exists.length > 0) {
            return res.status(400).json({ message: 'Tên đăng nhập này đã được sử dụng!' });
        }

        // Thêm vào database
        // Lưu ý: Thực tế nên mã hóa password bằng bcrypt, nhưng ở đây mình lưu text để bạn dễ test
        const sql = 'INSERT INTO Staff (username, password, full_name, role) VALUES (?, ?, ?, ?)';
        await db.execute(sql, [username, password, full_name, role || 'pos']);

        res.json({ message: 'Tạo nhân viên thành công' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi tạo nhân viên' });
    }
};

// 3. Xóa nhân viên
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Không cho phép xóa chính mình (nếu cần logic này thì thêm sau) hoặc xóa Admin gốc (ID=1)
        if (id == 1) {
             return res.status(400).json({ message: 'Không thể xóa tài khoản Admin gốc!' });
        }

        await db.execute('DELETE FROM Staff WHERE id = ?', [id]);
        res.json({ message: 'Đã xóa nhân viên' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi xóa' });
    }
};