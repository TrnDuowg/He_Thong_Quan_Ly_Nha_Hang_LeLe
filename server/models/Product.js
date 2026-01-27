const db = require('../config/db');

class Product {
    // Lấy tất cả sản phẩm đang hoạt động, kèm tên danh mục
    static async getAllActive() {
        const sql = `
            SELECT p.*, c.name as category_name, c.type as category_type 
            FROM Products p
            LEFT JOIN Categories c ON p.category_id = c.id
            WHERE p.is_active = 1
            ORDER BY c.display_order ASC, p.name ASC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
}

module.exports = Product;