const db = require('../config/db');

// Lấy lịch làm việc (Trong khoảng thời gian hoặc tất cả)
exports.getSchedules = async (req, res) => {
    try {
        // Lấy lịch kèm thông tin nhân viên
        const sql = `
            SELECT s.staff_id, s.work_date, s.shift_type, st.full_name, st.role 
            FROM Schedules s
            JOIN Staff st ON s.staff_id = st.id
            ORDER BY s.work_date ASC
        `;
        const [rows] = await db.execute(sql);
        
        // Format lại ngày giờ để trả về YYYY-MM-DD chuẩn (tránh lệch múi giờ)
        const schedules = rows.map(row => ({
            ...row,
            work_date: new Date(row.work_date).toLocaleDateString('en-CA') // Format YYYY-MM-DD
        }));

        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy lịch' });
    }
};

// Lưu/Cập nhật lịch (Nếu đã có thì update, chưa có thì insert)
exports.saveSchedule = async (req, res) => {
    try {
        const { staff_id, work_date, shift_type } = req.body;

        // Dùng câu lệnh "INSERT ... ON DUPLICATE KEY UPDATE" của MySQL
        const sql = `
            INSERT INTO Schedules (staff_id, work_date, shift_type) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE shift_type = VALUES(shift_type)
        `;
        
        await db.execute(sql, [staff_id, work_date, shift_type]);
        res.json({ message: 'Đã lưu lịch' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lưu lịch' });
    }
};