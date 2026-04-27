import express from 'express';
import { poolMaster, poolSlave } from './database.js';

const app = express();
app.use(express.json());

const SERVER_ID = process.env.SERVER_ID || 'Unknown_Node';

app.post('/products', async (req, res) => {
    try {
        const { name, price } = req.body;
        const result = await poolMaster.query(
            'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
            [name, price]
        );
        res.status(201).json({ 
            message: "Đã lưu vào Master", 
            data: result.rows[0], 
            processed_by: SERVER_ID 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const result = await poolSlave.query('SELECT * FROM products');
        res.status(200).json({ 
            data: result.rows, 
            processed_by: SERVER_ID 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log(`${SERVER_ID} đang chạy trên port 3000`));