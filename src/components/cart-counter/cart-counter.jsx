//using supabase postgresql
import './cart-counter.css';
import IconMinus from '../../../public/icon-minus.svg';
import IconPlus from '../../../public/icon-plus.svg';
import { useState } from 'react';
import supabase from '../../../supabaseClient'; // Import your supabase client

function CartCounter() {
    const [count, setCount] = useState(0);
    const userId = 1;  // Hardcoded user ID; (for dev) ideally use the logged-in user's ID
    const productId = 1; // Hardcoded product ID; (for dev) ideally use the selected product's ID

    // Decrement the count
    const decrement = () => {
        setCount(prevCount => (prevCount > 0 ? prevCount - 1 : prevCount));
    };

    // Increment the count
    const increment = () => {
        setCount(prevCount => prevCount + 1);
    };

    const handleAddToCart = async () => {
        const quantity = count;
    
        if (quantity === 0) {
            console.error('Please select at least one item to add to the cart');
            return;  // Do not proceed if quantity is 0
        }
    
        try {
            // Step 1: Check if the product already exists in the user's cart
            const { data: existingCartItems, error: fetchError } = await supabase
                .from('carts')
                .select('id, quantity')
                .eq('user_id', userId)
                .eq('product_id', productId)
                .limit(1); // Ensure at most one row is returned
    
            if (fetchError) {
                console.error('Error fetching cart item:', fetchError.message);
                return;
            }
    
            // If multiple rows are returned, handle the situation gracefully (it should be unique per user and product)
            if (existingCartItems.length > 1) {
                console.error('Unexpected multiple rows returned for the same user and product.');
                return; // Handle this case as needed
            }
    
            if (existingCartItems.length === 1) {
                // Step 2: If the product already exists, update the quantity
                const existingCartItem = existingCartItems[0];
                const updatedQuantity = existingCartItem.quantity + quantity;
    
                const { data, error } = await supabase
                    .from('carts')
                    .update({ quantity: updatedQuantity })
                    .eq('id', existingCartItem.id);
    
                if (error) {
                    console.error('Failed to update cart item:', error.message);
                } else {
                    console.log('Cart item updated:', data);
                    setCount(0); // Optionally reset count after updating
                }
            } else {
                // Step 3: If the product doesn't exist in the cart, insert a new row
                const { data, error } = await supabase
                    .from('carts')
                    .insert([{ user_id: userId, product_id: productId, quantity }]);
    
                if (error) {
                    console.error('Failed to add item to cart:', error.message);
                } else {
                    console.log('Item added to cart:', data);
                    setCount(0); // Optionally reset count after adding
                }
            }
        } catch (error) {
            console.error('Error adding item to cart:', error.message);
        }
    };

    return (
        <>
            <div className="cart-container">
                <button className="btn" onClick={decrement}>
                    <img src={IconMinus} alt="Decrease quantity" />
                </button>
                <p className="amount">{count}</p>
                <button className="btn" onClick={increment}>
                    <img src={IconPlus} alt="Increase quantity" />
                </button>
            </div>
            <div className="btn-shadow-container">
                <button className="add-cart-btn" onClick={handleAddToCart}>
                    Add to cart
                </button>
                <div className="shadow"></div>
            </div>
        </>
    );
}

export default CartCounter;
