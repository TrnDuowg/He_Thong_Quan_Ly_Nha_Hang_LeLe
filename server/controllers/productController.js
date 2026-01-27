const db = require('../config/db');

// 1. Lấy danh sách món (QUAN TRỌNG: Backend phải có hàm này)
exports.getMenu = async (req, res) => {
    try {
        // PHẢI LÀ SELECT * (hoặc p.*) ĐỂ LẤY CỘT is_combo
        const sql = `
            SELECT p.*, c.name as category_name 
            FROM Products p
            LEFT JOIN Categories c ON p.category_id = c.id 
            ORDER BY p.id DESC
        `;
        const [rows] = await db.execute(sql);
        res.json(rows); // Trả về mảng []
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server lấy danh sách món' });
    }
};
// 1. Thêm món ăn (Sửa lại để nhận is_combo)
exports.createProduct = async (req, res) => {
    try {
        // Nhận thêm is_combo từ body
        const { name, category_id, price, image_url, is_combo } = req.body;
        
        // SQL: Thêm cột is_combo
        const sql = `
            INSERT INTO Products 
            (name, category_id, price, image_url, is_active, is_combo) 
            VALUES (?, ?, ?, ?, 1, ?)
        `;
        
        // Mặc định is_combo là 0 nếu không truyền lên
        const comboValue = is_combo ? 1 : 0; 

        await db.execute(sql, [name, category_id, price, image_url, comboValue]);
        res.json({ message: 'Thêm thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi thêm món' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image_url, category_id, is_active, is_combo } = req.body;

        // --- 1. XỬ LÝ DỮ LIỆU AN TOÀN ---
        // Xóa dấu chấm trong giá tiền (VD: "54.000" -> 54000)
        const cleanPrice = price ? Number(price.toString().replace(/\./g, '')) : 0;
        
        // Chuyển đổi sang số 0 hoặc 1
        const comboValue = is_combo ? 1 : 0;
        // Nếu không gửi is_active thì mặc định là 1 (đang bán)
        const activeValue = (is_active === undefined || is_active === true || is_active == 1) ? 1 : 0;

        // --- 2. CÂU LỆNH SQL ---
        // Lưu ý: Thứ tự các dấu ? phải khớp chính xác với mảng bên dưới
        const sql = `
            UPDATE Products 
            SET name = ?, 
                price = ?, 
                image_url = ?, 
                category_id = ?, 
                is_active = ?, 
                is_combo = ? 
            WHERE id = ?
        `;

        // Debug: In ra xem dữ liệu chuẩn chưa
        console.log("Đang update ID:", id);
        console.log("Dữ liệu:", { name, cleanPrice, comboValue });

        // --- 3. THỰC THI ---
        await db.execute(sql, [
            name, 
            cleanPrice, 
            image_url, 
            category_id, 
            activeValue, 
            comboValue, 
            id // ID nằm cuối cùng vì WHERE id = ?
        ]);

        res.json({ message: 'Cập nhật thành công' });

    } catch (error) {
        // QUAN TRỌNG: In lỗi chi tiết ra Terminal để biết đường sửa
        console.error("❌ LỖI UPDATE:", error);
        res.status(500).json({ message: 'Lỗi cập nhật: ' + error.message });
    }
};

// 4. Xóa món
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Câu lệnh cũ gây lỗi 500: DELETE FROM Products WHERE id = ?
        // Câu lệnh mới an toàn:
        const sql = 'UPDATE Products SET is_active = 0 WHERE id = ?';
        
        await db.execute(sql, [id]);
        
        res.json({ message: 'Đã xóa sản phẩm (Chuyển sang ngừng kinh doanh)' });

    } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        // Trả về lỗi chi tiết để bạn đọc được trong Console nếu vẫn lỗi
        res.status(500).json({ message: 'Không thể xóa: ' + error.message });
    }
};
// [SỬA] Thêm/Tạo Combo (Có xử lý transaction để lưu món con)
exports.createProduct = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const { name, category_id, price, image_url, is_combo, combo_items } = req.body;
        // Xử lý giá: xóa dấu chấm, chuyển thành số
        const cleanPrice = price ? Number(price.toString().replace(/\./g, '')) : 0;
        const comboValue = is_combo ? 1 : 0;

        // 1. Lưu vào bảng Products
        const sqlProduct = `
            INSERT INTO Products (name, category_id, price, image_url, is_active, is_combo) 
            VALUES (?, ?, ?, ?, 1, ?)
        `;
        const [result] = await connection.execute(sqlProduct, [name, category_id, cleanPrice, image_url, comboValue]);
        const newProductId = result.insertId;

        // 2. Nếu là Combo và có món con -> Lưu vào Combo_Config
        if (comboValue === 1 && combo_items && combo_items.length > 0) {
            const sqlConfig = `INSERT INTO Combo_Config (combo_product_id, item_product_id, quantity) VALUES (?, ?, ?)`;
            for (const item of combo_items) {
                await connection.execute(sqlConfig, [newProductId, item.id, item.qty || 1]);
            }
        }

        await connection.commit();
        res.json({ message: 'Thêm thành công', id: newProductId });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Lỗi: ' + error.message });
    } finally {
        connection.release();
    }
};

// [SỬA] Cập nhật Combo
exports.updateProduct = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { name, price, image_url, category_id, is_combo, combo_items } = req.body;
        const cleanPrice = price ? Number(price.toString().replace(/\./g, '')) : 0;

        // 1. Update bảng Products
        const sqlProduct = `
            UPDATE Products SET name=?, price=?, image_url=?, category_id=?, is_combo=? WHERE id=?
        `;
        await connection.execute(sqlProduct, [name, cleanPrice, image_url, category_id, is_combo ? 1 : 0, id]);

        // 2. Xử lý Combo Items: Xóa hết cũ -> Thêm mới (Cách đơn giản nhất)
        if (is_combo) {
            // Xóa cũ
            await connection.execute('DELETE FROM Combo_Config WHERE combo_product_id = ?', [id]);
            
            // Thêm mới nếu có
            if (combo_items && combo_items.length > 0) {
                const sqlConfig = `INSERT INTO Combo_Config (combo_product_id, item_product_id, quantity) VALUES (?, ?, ?)`;
                for (const item of combo_items) {
                    await connection.execute(sqlConfig, [id, item.id, item.qty || 1]);
                }
            }
        }

        await connection.commit();
        res.json({ message: 'Cập nhật thành công' });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Lỗi cập nhật: ' + error.message });
    } finally {
        connection.release();
    }
};

// [MỚI] Lấy chi tiết món ăn (Kèm danh sách món con nếu là Combo)
exports.getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Lấy thông tin chính
        const [product] = await db.execute('SELECT * FROM Products WHERE id = ?', [id]);
        if (product.length === 0) return res.status(404).json({ message: 'Không tìm thấy' });

        const result = product[0];

        // 2. Nếu là combo, lấy thêm danh sách món con
        if (result.is_combo) {
            const sqlItems = `
                SELECT p.id, p.name, p.price, p.image_url, c.quantity as qty
                FROM Combo_Config c
                JOIN Products p ON c.item_product_id = p.id
                WHERE c.combo_product_id = ?
            `;
            const [items] = await db.execute(sqlItems, [id]);
            result.items = items; // Gán vào kết quả trả về
        } else {
            result.items = [];
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};