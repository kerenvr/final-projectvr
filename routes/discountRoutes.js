// routes/discountRoutes.js
import express from 'express';
import { pool } from '../models/connect_db.js'; // Import the database connection

const router = express.Router();

// GET all discounts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM discounts'); // Fetch all discounts
    res.json(result.rows); // Send the discount data as JSON
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
