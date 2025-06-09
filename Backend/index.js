const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to Café Management System API');
});

// Generic GET all data from any table
app.get('/getData/:table', async (req, res) => {
    const { table } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM ${table}`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ======================= POST ROUTES ======================= //

// 1. Categories
app.post('/addCategory', async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Customers
app.post('/addCustomer', async (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Employees
app.post('/addEmployee', async (req, res) => {
    const { name, position, salary } = req.body;
    if (!name || !position || !salary) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO employees (name, position, salary) VALUES ($1, $2, $3) RETURNING *`,
            [name, position, salary]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Inventory
app.post('/addInventory', async (req, res) => {
    const { item_name, quantity, supplier_id } = req.body;
    if (!item_name || !quantity || !supplier_id) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO inventory (item_name, quantity, supplier_id) VALUES ($1, $2, $3) RETURNING *`,
            [item_name, quantity, supplier_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Menu Items
app.post('/addMenuItem', async (req, res) => {
    const { name, price, category_id } = req.body;
    if (!name || !price || !category_id) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO menu_items (name, price, category_id) VALUES ($1, $2, $3) RETURNING *`,
            [name, price, category_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Orders (single clean route, no duplicates)
app.post('/addOrder', async (req, res) => {
    const { customer_id, table_id, total_amount } = req.body;

    if (!customer_id) return res.status(400).json({ error: "Missing customer_id" });

    try {
        const result = await pool.query(
            `INSERT INTO orders (customer_id, table_id, total_amount, order_time)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`,
            [customer_id, table_id || null, total_amount || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Order Items
app.post('/addOrderItem', async (req, res) => {
    const { order_id, menu_item_id, quantity, price_at_purchase } = req.body;
    if (!order_id || !menu_item_id || !quantity || !price_at_purchase) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4) RETURNING *`,
            [order_id, menu_item_id, quantity, price_at_purchase]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Payments
app.post('/addPayment', async (req, res) => {
    const { order_id, payment_method, amount_paid } = req.body;
    if (!order_id || !payment_method || !amount_paid) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO payments (order_id, payment_method, amount_paid, payment_time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`,
            [order_id, payment_method, amount_paid]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Suppliers
app.post('/addSupplier', async (req, res) => {
    const { name, contact_info } = req.body;
    if (!name || !contact_info) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO suppliers (name, contact_info) VALUES ($1, $2) RETURNING *`,
            [name, contact_info]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Tables
app.post('/addTable', async (req, res) => {
    const { table_number, capacity } = req.body;
    if (!table_number || !capacity) return res.status(400).json({ error: "Missing fields" });
    try {
        const result = await pool.query(
            `INSERT INTO tables (table_number, capacity) VALUES ($1, $2) RETURNING *`,
            [table_number, capacity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
