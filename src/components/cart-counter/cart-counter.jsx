import './cart-counter.css';
import IconMinus from '../../../public/icon-minus.svg'; 
import IconPlus from '../../../public/icon-plus.svg'; 
import { useState } from 'react';

function CartCounter() {
    const [count, setCount] = useState(0);
    const userId = 1;  // Hardcoded user ID; should be dynamic based on logged-in user
    const productId = 1; // Hardcoded product ID; should be dynamic based on the selected product

    const increment = () => {
        setCount(prevCount => prevCount + 1);
    };

    const decrement = () => {
        setCount(prevCount => (prevCount > 0 ? prevCount - 1 : prevCount));
    };

    // Handle the "Add to Cart" functionality
    const handleAddToCart = async () => {
        const quantity = count;

        if (quantity === 0) {
            console.error('Please select at least one item to add to the cart');
            return;  // Do not proceed if quantity is 0
        }

        try {
            const response = await fetch('http://localhost:3001/api/carts/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Item added to cart:', data);
                // Optionally: Display a confirmation message, reset count, etc.
                setCount(0);  // Optionally reset the quantity count after adding to the cart
            } else {
                console.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    return (
        <>
            <div className='cart-container'>
                <button className='btn' onClick={decrement}>
                    <img src={IconMinus} alt="Decrease quantity" />
                </button>
                <p className='amount'>{count}</p>
                <button className='btn' onClick={increment}>
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
