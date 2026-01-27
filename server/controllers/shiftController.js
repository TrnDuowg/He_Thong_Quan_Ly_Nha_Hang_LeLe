const db = require('../config/db');

// Lấy danh sách ca làm việc (kèm tên nhân viên)
exports.getAllShifts = async (req, res) => {
    try {
        const sql = `
            SELECT s.*, st.full_name as staff_name, st.username 
            FROM Shifts s
            JOIN Staff st ON s.staff_id = st.id
            ORDER BY s.start_time DESC
        `;
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (e) { 
        console.error(e);
        res.status(500).json({ message: 'Lỗi server' }); 
    }
};

// Lấy chi tiết 1 ca (bao gồm tổng tiền bán được trong ca đó)
exports.getShiftDetail = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Lấy thông tin ca
        const [shift] = await db.execute('SELECT * FROM Shifts WHERE id = ?', [id]);
        if (shift.length === 0) return res.status(404).json({ message: 'Không tìm thấy ca' });

        // 2. Tính tổng tiền các đơn hàng trong khoảng thời gian của ca
        // (Logic đơn giản: lấy đơn hàng tạo ra sau start_time và trước end_time)
        // Nếu ca chưa kết thúc (end_time null) thì lấy đến hiện tại
        const startTime = shift[0].start_time;
        const endTime = shift[0].end_time || new Date();

        const sqlRevenue = `
            SELECT SUM(final_amount) as system_revenue, COUNT(*) as total_orders
            FROM Orders 
            WHERE created_at BETWEEN ? AND ? AND status != 'cancelled'
        `;
        const [revenue] = await db.execute(sqlRevenue, [startTime, endTime]);

        res.json({
            shift: shift[0],
            revenue: revenue[0].system_revenue || 0,
            orders_count: revenue[0].total_orders || 0
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Lỗi lấy chi tiết ca' });
    }
};
// [MỚI] Mở ca làm việc
exports.openShift = async (req, res) => {
    try {
        const { staff_id, start_cash } = req.body;

        // 1. Kiểm tra xem nhân viên này có đang mở ca nào chưa đóng không?
        // (Tùy chọn, ở đây mình cho phép mở luôn để đơn giản)

        // 2. Tạo ca mới
        const sql = `INSERT INTO Shifts (staff_id, start_time, start_cash) VALUES (?, NOW(), ?)`;
        const [result] = await db.execute(sql, [staff_id, start_cash]);

        // 3. Trả về ID ca vừa tạo
        res.json({ 
            message: 'Mở ca thành công', 
            shift_id: result.insertId 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi mở ca' });
    }
};
exports.closeShift = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { shift_id, actual_cash, note } = req.body; // Tiền thực tế thu ngân đếm được

        // 1. Tính tổng doanh thu hệ thống trong ca này
        // Lấy start_time của ca
        const [shiftInfo] = await connection.execute('SELECT start_time, start_cash FROM Shifts WHERE id = ?', [shift_id]);
        if (shiftInfo.length === 0) throw new Error('Ca không tồn tại');
        
        const startTime = shiftInfo[0].start_time;
        const endTime = new Date(); // Thời điểm hiện tại

        // Tính tổng tiền bán được (Chỉ tính tiền mặt nếu muốn đối soát két tiền, ở đây mình tính tổng hết để đơn giản)
        // Nếu muốn chuẩn: WHERE payment_method = 'cash'
        const [revenue] = await connection.execute(`
            SELECT SUM(amount) as total 
            FROM Payments 
            WHERE created_at BETWEEN ? AND ?
        `, [startTime, endTime]);

        const systemRevenue = Number(revenue[0].total || 0);
        const startCash = Number(shiftInfo[0].start_cash || 0);
        const expectedCash = startCash + systemRevenue; // Tiền lý thuyết phải có trong két
        const difference = actual_cash - expectedCash; // Chênh lệch

        // 2. Cập nhật bảng Shifts
        await connection.execute(`
            UPDATE Shifts 
            SET end_time = ?, total_revenue = ?, end_cash = ?, difference = ?, note = ?
            WHERE id = ?
        `, [endTime, systemRevenue, actual_cash, difference, note, shift_id]);

        await connection.commit();
        res.json({ 
            message: 'Kết ca thành công', 
            report: {
                systemRevenue,
                actualCash: actual_cash,
                difference
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Lỗi kết ca' });
    } finally {
        connection.release();
    }
};