const db = require('../config/db');

exports.createReservation = async (req, res) => {
    try {
        const { name, phone, time, date, guests, table_id } = req.body;

        // Validation cơ bản
        if (!name || !phone || !time) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        // --- XỬ LÝ NGÀY GIỜ ---
        // 1. Lấy ngày: Nếu frontend gửi lên thì dùng, không thì lấy hôm nay
        let bookingDateStr = date;
        if (!bookingDateStr) {
            const today = new Date();
            // Format YYYY-MM-DD
            bookingDateStr = today.toISOString().split('T')[0]; 
        }

        // 2. Ghép thành chuỗi DATETIME cho MySQL: "2026-01-26 23:11:00"
        // time gửi lên dạng "23:11"
        const finalBookingTime = `${bookingDateStr} ${time}:00`;

        // --- LƯU VÀO DB ---
        const sql = `
            INSERT INTO Reservations 
            (customer_name, phone, booking_time, guests, table_id, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        // Nếu có table_id (đặt tại sơ đồ bàn) thì status là 'confirmed', ngược lại 'pending'
        const status = table_id ? 'confirmed' : 'pending';

        await db.execute(sql, [name, phone, finalBookingTime, guests || 2, table_id || null, status]);

        // Nếu đặt đích danh bàn nào, cập nhật trạng thái bàn đó thành 'reserved'
        if (table_id) {
            await db.execute("UPDATE Dining_Tables SET status = 'reserved' WHERE id = ?", [table_id]);
        }

        res.json({ message: 'Đặt bàn thành công' });

    } catch (error) {
        console.error("Lỗi đặt bàn:", error); // Xem lỗi chi tiết ở Terminal
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};