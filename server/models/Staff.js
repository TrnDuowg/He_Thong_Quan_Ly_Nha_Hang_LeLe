const db = require('../config/db');

class Staff {
    // Hàm tìm nhân viên dựa vào tên đăng nhập
    static async findByUsername(username) {
        // Dấu ? là để điền username vào sau (tránh bị hack SQL Injection)
        const sql = 'SELECT * FROM Staff WHERE username = ?';
        
        // db.execute sẽ trả về 1 mảng [rows, fields], mình chỉ lấy rows
        const [rows] = await db.execute(sql, [username]);
        
        // Trả về người đầu tiên tìm thấy (hoặc undefined nếu không thấy)
        return rows[0]; 
    }
}

module.exports = Staff;