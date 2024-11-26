// routes/productRoutes.js
import express from 'express';
import { pool } from '../models/connect_db.js'; 

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
