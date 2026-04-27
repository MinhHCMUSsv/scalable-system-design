import pg from 'pg';

const { Pool } = pg;

// Kết nối tới Master (Ghi)
export const poolMaster = new Pool({
    host: process.env.DB_MASTER_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Kết nối tới Slave (Đọc)
export const poolSlave = new Pool({
    host: process.env.DB_SLAVE_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Khởi tạo bảng ban đầu trên Master
poolMaster.query(`
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price NUMERIC
    )
`).catch(err => console.error("Lỗi khởi tạo database:", err));