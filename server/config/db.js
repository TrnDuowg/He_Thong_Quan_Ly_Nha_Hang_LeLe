const mysql = require('mysql2');
require('dotenv').config();

// Tạo Connection Pool (tốt hơn createConnection đơn lẻ)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Chuyển sang dạng Promise để dùng async/await cho gọn code
const db = pool.promise();

// Kiểm tra kết nối thử (Optional)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Lỗi kết nối Database:', err.code);
        console.error('⚠️ Kiểm tra lại file .env hoặc MySQL service!');
    } else {
        console.log('✅ Đã kết nối thành công với MySQL Database');
        connection.release();
    }
});

module.exports = db;