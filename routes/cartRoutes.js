// routes/cartRoutes.js
import express from 'express';
import { pool } from '../models/connect_db.js'; // Import the database connection

const router = express.Router();

// GET route: Fetch all cart items for a specific user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params; // Get the user ID from the route parameter

  try {
    const result = await pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No items found in the cart' });
    }
    res.json(result.rows); // Send the cart items as JSON
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST to add/update items in the cart
router.post('/add', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    // First, check if the product is already in the user's cart
    try {
        const result = await pool.query(
            'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );

        if (result.rows.length > 0) {
            // Product already exists in the cart, update the quantity
            const existingQuantity = result.rows[0].quantity;
            const newQuantity = existingQuantity + quantity;  // Add the new quantity to the existing one

            const updateResult = await pool.query(
                'UPDATE carts SET quantity = $1, updated_at = NOW() WHERE user_id = $2 AND product_id = $3 RETURNING *',
                [newQuantity, user_id, product_id]
            );

            res.status(200).json({
                message: 'Cart updated successfully',
                cartItem: updateResult.rows[0],
            });
        } else {
            // Product does not exist in the cart, insert a new entry
            const insertResult = await pool.query(
                'INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [user_id, product_id, quantity]
            );

            res.status(201).json({
                message: 'Item added to cart successfully',
                cartItem: insertResult.rows[0],
            });
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT route: Update the quantity of an item in the cart
router.put('/update/:cart_id', async (req, res) => {
  const { cart_id } = req.params; // Get the cart item ID from the route parameter
  const { quantity } = req.body; // Get the new quantity from the request body

  try {
    const result = await pool.query(
      'UPDATE carts SET quantity = $1 WHERE cart_id = $2 RETURNING *',
      [quantity, cart_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(result.rows[0]); // Return the updated cart item
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE route: Remove an item from the cart
router.delete('/remove/:cart_id', async (req, res) => {
  const { cart_id } = req.params; // Get the cart item ID from the route parameter

  try {
    const result = await pool.query(
      'DELETE FROM carts WHERE cart_id = $1 RETURNING *',
      [cart_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
