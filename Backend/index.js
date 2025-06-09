const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


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
        console.error("Error in GET /getData:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ======================= POST ROUTES ======================= //

// 1. Categories
app.post('/addCategory', async (req, res) => {
    const { name } = req.body;
    console.log("Received category:", name);

    if (!name) return res.status(400).json({ error: "Name is required" });

    try {
        const result = await pool.query(
            `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
            [name]
        );
        console.log("Inserted category:", result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error in /addCategory:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. Customers
app.post('/addCustomer', async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ error: "Name and phone are required" });

    try {
        const result = await pool.query(
            `INSERT INTO customers (name, phone) VALUES ($1, $2) RETURNING *`,
            [name, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Employees
app.post('/addEmployee', async (req, res) => {
    const { name, role, salary } = req.body;
    if (!name || !role || !salary) return res.status(400).json({ error: "All fields required" });

    try {
        const result = await pool.query(
            `INSERT INTO employees (name, role, salary) VALUES ($1, $2, $3) RETURNING *`,
            [name, role, salary]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Inventory
app.post('/addInventory', async (req, res) => {
    const { item_name, quantity, supplier_id } = req.body;
    if (!item_name || !quantity || !supplier_id) return res.status(400).json({ error: "All fields required" });

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
    if (!name || !price || !category_id) return res.status(400).json({ error: "All fields required" });

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
// 6. Orders
app.post('/addOrder', async (req, res) => {
    const { customer_id } = req.body;
    if (!customer_id) return res.status(400).json({ error: "Customer ID is required" });

    try {
        const result = await pool.query(
            `INSERT INTO orders (customer_id, created_at) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *`,
            [customer_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Order Items
app.post('/addOrderItem', async (req, res) => {
    const { order_id, menu_item_id, quantity } = req.body;
    if (!order_id || !menu_item_id || !quantity) return res.status(400).json({ error: "All fields required" });

    try {
        const result = await pool.query(
            `INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
            [order_id, menu_item_id, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Payments
app.post('/addPayment', async (req, res) => {
    const { order_id, amount, method } = req.body;
    if (!order_id || !amount || !method) return res.status(400).json({ error: "All fields required" });

    try {
        const result = await pool.query(
            `INSERT INTO payments (order_id, amount, method) VALUES ($1, $2, $3) RETURNING *`,
            [order_id, amount, method]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Suppliers
app.post('/addSupplier', async (req, res) => {
    const { name, contact } = req.body;
    if (!name || !contact) return res.status(400).json({ error: "All fields required" });

    try {
        const result = await pool.query(
            `INSERT INTO suppliers (name, contact) VALUES ($1, $2) RETURNING *`,
            [name, contact]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Tables
app.post('/addTable', async (req, res) => {
    const { table_number } = req.body;
    if (!table_number) return res.status(400).json({ error: "Table number is required" });

    try {
        const result = await pool.query(
            `INSERT INTO tables (table_number) VALUES ($1) RETURNING *`,
            [table_number]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
