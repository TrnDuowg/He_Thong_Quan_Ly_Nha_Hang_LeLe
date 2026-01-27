const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Tính tổng doanh thu (Chỉ tính đơn không bị hủy)
        const sqlRevenue = `
            SELECT SUM(final_amount) as total_revenue, COUNT(*) as total_orders 
            FROM Orders 
            WHERE status != 'cancelled'
        `;
        const [revenueRows] = await db.execute(sqlRevenue);

        // 2. Tìm 5 món bán chạy nhất
        const sqlTopProducts = `
            SELECT p.name, SUM(od.quantity) as sold_count, SUM(od.total_price) as total_sales
            FROM Order_Details od
            JOIN Products p ON od.product_id = p.id
            JOIN Orders o ON od.order_id = o.id
            WHERE o.status != 'cancelled'
            GROUP BY p.id, p.name
            ORDER BY sold_count DESC
            LIMIT 5
        `;
        const [topProducts] = await db.execute(sqlTopProducts);

        // 3. Lấy 5 đơn hàng gần nhất
        const sqlRecentOrders = `
            SELECT id, order_code, final_amount, status, created_at 
            FROM Orders 
            ORDER BY created_at DESC 
            LIMIT 5
        `;
        const [recentOrders] = await db.execute(sqlRecentOrders);

        res.json({
            revenue: revenueRows[0].total_revenue || 0,
            ordersCount: revenueRows[0].total_orders || 0,
            topProducts,
            recentOrders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi lấy thống kê' });
    }
};