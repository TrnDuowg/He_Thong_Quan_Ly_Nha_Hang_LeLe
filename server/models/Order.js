const db = require('../config/db');

class Order {
    static async create(orderData, items) {
        // Lấy kết nối từ Pool để dùng Transaction
        const connection = await db.getConnection(); 
        
        try {
            await connection.beginTransaction(); // BẮT ĐẦU GIAO DỊCH

            // 1. Tạo mã đơn hàng (Ví dụ: ORD-170123456)
            const orderCode = 'ORD-' + Date.now();

            // 2. Chèn vào bảng Orders
            // LƯU Ý: Đã sửa 'total_amount' thành 'final_amount' cho khớp CSDL
            const sqlOrder = `
                INSERT INTO Orders 
                (order_code, staff_id, final_amount, status, created_at) 
                VALUES (?, ?, ?, 'pending', NOW())
            `;
            
            // Xử lý staff_id: Nếu không có thì mặc định là 1 (Admin) để không bị lỗi
            const staffId = orderData.staff_id || 1;

            const [orderResult] = await connection.execute(sqlOrder, [
                orderCode, 
                staffId,
                orderData.total_amount // Dữ liệu từ frontend gửi lên (vẫn là giá trị tổng)
            ]);
            
            const orderId = orderResult.insertId; // Lấy ID đơn hàng vừa tạo

            // 3. Chèn chi tiết từng món vào bảng Order_Details
            const sqlDetail = `
                INSERT INTO Order_Details (order_id, product_id, quantity, unit_price, total_price)
                VALUES (?, ?, ?, ?, ?)
            `;

            for (const item of items) {
                await connection.execute(sqlDetail, [
                    orderId,
                    item.id,
                    item.qty,
                    item.price, // unit_price
                    item.price * item.qty // total_price
                ]);
            }

            await connection.commit(); // LƯU THÀNH CÔNG
            return { id: orderId, order_code: orderCode };

        } catch (error) {
            await connection.rollback(); // CÓ LỖI THÌ HỦY HẾT
            throw error; // Ném lỗi ra để Controller bắt được
        } finally {
            connection.release(); // Trả kết nối về hồ
        }
    }
     static async getKitchenOrders() {
        const sql = `
            SELECT o.id, o.order_code, o.created_at, o.status, o.staff_id,
                   od.quantity, p.name as product_name, od.note
            FROM Orders o
            JOIN Order_Details od ON o.id = od.order_id
            JOIN Products p ON od.product_id = p.id
            WHERE o.status IN ('processing')
            ORDER BY o.created_at ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }

    // [MỚI] Cập nhật trạng thái đơn hàng
    static async updateStatus(orderId, status) {
        const sql = 'UPDATE Orders SET status = ? WHERE id = ?';
        await db.execute(sql, [status, orderId]);
    }
     static async getHistory(limit = 50) {
        const sql = `
            SELECT o.id, o.order_code, o.created_at, o.status, o.staff_id,
                   o.final_amount,
                   GROUP_CONCAT(CONCAT(od.quantity, 'x ', p.name) SEPARATOR ', ') as items_summary
            FROM Orders o
            JOIN Order_Details od ON o.id = od.order_id
            JOIN Products p ON od.product_id = p.id
            WHERE o.status IN ('completed', 'cancelled')
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT ?
        `;
        const [rows] = await db.execute(sql, [limit.toString()]); // Limit phải là string hoặc int
        return rows;
    }
}

module.exports = Order;