const Order = require('../models/Order');
const db = require('../config/db'); 

// 1. TẠO ĐƠN HÀNG (FULL CHỨC NĂNG)
exports.createOrder = async (req, res) => {
    // Lấy kết nối để dùng Transaction (đảm bảo lưu thành công hết hoặc hủy hết)
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Nhận tất cả dữ liệu từ Frontend
        const { 
            items, sub_total, discount, tax, total_amount, 
            staff_id, order_type, table_id, payment 
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng đang trống' });
        }

        // --- BƯỚC 1: TẠO ĐƠN HÀNG (INSERT ORDERS) ---
        const orderCode = 'ORD-' + Date.now();
        
        // Mặc định trạng thái là 'pending' (chờ xử lý)
        let status = 'pending'; 
        // Nếu đã thanh toán luôn thì chuyển sang 'processing' (để bếp làm ngay)
        if (payment) status = 'processing';

        const sqlOrder = `
            INSERT INTO Orders 
            (order_code, staff_id, subtotal_amount, discount_amount, tax_amount, final_amount, order_type, table_id, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const [orderResult] = await connection.execute(sqlOrder, [
            orderCode,
            staff_id || 1,
            sub_total || 0,
            discount || 0,
            tax || 0,
            total_amount,
            order_type || 'dine_in',
            table_id || null, // Nếu mang về thì null
            status
        ]);
        
        const orderId = orderResult.insertId;

        // --- BƯỚC 2: LƯU CHI TIẾT MÓN (INSERT ORDER_DETAILS) ---
        const sqlDetail = `
            INSERT INTO Order_Details (order_id, product_id, quantity, unit_price, total_price, note)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        for (const item of items) {
            await connection.execute(sqlDetail, [
                orderId,
                item.id,
                item.qty,
                item.price,
                item.price * item.qty,
                item.note || '' // Lưu ghi chú món ăn (ít đá, không hành...)
            ]);
        }

        // --- BƯỚC 3: XỬ LÝ THANH TOÁN (NẾU CÓ) ---
        if (payment) {
            const sqlPay = `INSERT INTO Payments (order_id, payment_method, amount, created_at) VALUES (?, ?, ?, NOW())`;
            await connection.execute(sqlPay, [orderId, payment.method, total_amount]);
            
            // Cập nhật trạng thái đơn thành 'paid' trong cột payment_status (nếu bạn có cột này)
            // Hoặc chỉ cần status 'processing' là đủ để bếp làm
        }

        // --- BƯỚC 4: CẬP NHẬT TRẠNG THÁI BÀN (NẾU ĂN TẠI BÀN) ---
         if (table_id) {
            const tableStatus = payment ? 'available' : 'occupied';

            const sqlUpdateTable = `UPDATE Dining_Tables SET status = ? WHERE id = ?`;
            await connection.execute(sqlUpdateTable, [tableStatus, table_id]);
        }

        // Hoàn tất giao dịch
        await connection.commit();

        res.status(201).json({ 
            message: 'Tạo đơn hàng thành công', 
            order: { id: orderId, order_code: orderCode, status: status } 
        });

    } catch (error) {
        await connection.rollback(); // Nếu lỗi thì hoàn tác tất cả
        console.error('Lỗi tạo đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn: ' + error.message });
    } finally {
        connection.release(); // Trả kết nối về hồ
    }
};

// 2. LẤY DANH SÁCH ĐƠN BẾP (Gom nhóm món ăn)
exports.getKitchenOrders = async (req, res) => {
    try {
        const rawRows = await Order.getKitchenOrders();
        const ordersMap = {};
        
        rawRows.forEach(row => {
            if (!ordersMap[row.id]) {
                ordersMap[row.id] = {
                    id: row.id,
                    order_code: row.order_code,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                };
            }
            ordersMap[row.id].items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                note: row.note
            });
        });

        const orders = Object.values(ordersMap);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy đơn bếp' });
    }
};

// 3. CẬP NHẬT TRẠNG THÁI (Bếp bấm nấu xong / hoàn thành)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        
        await Order.updateStatus(id, status);
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật' });
    }
};

// 4. TRA CỨU ĐƠN HÀNG (Tracking cho khách)
exports.getOrderByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const sql = `
            SELECT o.order_code, o.status, o.final_amount, o.created_at,
                   GROUP_CONCAT(p.name SEPARATOR ', ') as items_summary
            FROM Orders o
            JOIN Order_Details od ON o.id = od.order_id
            JOIN Products p ON od.product_id = p.id
            WHERE o.order_code = ?
            GROUP BY o.id
        `;
        const [rows] = await db.execute(sql, [code]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 5. LẤY LỊCH SỬ ĐƠN (History Bếp)
exports.getKitchenHistory = async (req, res) => {
    try {
        const history = await Order.getHistory();
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy lịch sử' });
    }
};

// 6. LẤY ĐƠN GIAO HÀNG (SHIPPER)
exports.getDeliveryOrders = async (req, res) => {
    try {
        const sql = `
            SELECT id, order_code, final_amount, status, created_at,
                   'Khách lẻ' as customer_name, 'Mang về / Giao hàng' as address
            FROM Orders 
            WHERE status IN ('processing', 'delivering')
            ORDER BY created_at ASC
        `;
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (e) { res.status(500).json({ message: 'Lỗi server' }); }
};
exports.getOrdersByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params;
        
        const sql = `
            SELECT o.id, o.order_code, o.status, o.final_amount, o.created_at,
                   GROUP_CONCAT(p.name SEPARATOR ', ') as items_summary
            FROM Orders o
            JOIN Order_Details od ON o.id = od.order_id
            JOIN Products p ON od.product_id = p.id
            WHERE o.customer_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        
        const [rows] = await db.execute(sql, [customerId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};