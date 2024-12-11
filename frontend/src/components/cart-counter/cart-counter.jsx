import "./cart-counter.css"
import { useState } from "react"

function CartCounter() {
  const [count, setCount] = useState(0)
  const userId = 1 // Hardcoded user ID; (for dev) ideally use the logged-in user's ID
  const productId = 1 // Hardcoded product ID; (for dev) ideally use the selected product's ID

  // Decrement the count
  const decrement = () => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : prevCount))
  }

  // Increment the count
  const increment = () => {
    setCount((prevCount) => prevCount + 1)
  }

  const handleAddToCart = async () => {
    const quantity = count

    if (quantity === 0) {
      console.error("Please select at least one item to add to the cart")
      return // Do not proceed if quantity is 0
    }

    try {
      // Step 1: Check if the product already exists in the user's cart
      const supaBaseData = await fetch(
        "https://final-projectvr-2.onrender.com/api/cart/fetch-single-item",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId }),
        }
      )

      const { data: existingCartItems, error: fetchError } =
        await supaBaseData.json()

      if (fetchError) {
        console.error("Error fetching cart item:", fetchError.message)
        return
      }

      // If multiple rows are returned, handle the situation gracefully
      if (existingCartItems.length > 1) {
        console.error(
          "Unexpected multiple rows returned for the same user and product."
        )
        return // Handle this case as needed
      }

      if (existingCartItems.length === 1) {
        // Step 2: If the product already exists, update the quantity
        const existingCartItem = existingCartItems[0]
        const updatedQuantity = existingCartItem.quantity + quantity

        const supaBaseData = await fetch(
          "http://localhost:3000/api/cart/update-item-qty",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cartId: existingCartItem.id,
              quantity: updatedQuantity,
            }),
          }
        )

        const { data, error } = await supaBaseData.json()

        if (error) {
          console.error("Failed to update cart item:", error.message)
        } else {
          console.log("Cart item updated:", data)
          setCount(0) // Optionally reset count after updating
        }
      } else {
        // Step 3: If the product doesn't exist in the cart, insert a new row

        const supaBaseData = await fetch(
          "http://localhost:3000/api/cart/add-item",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, productId, quantity }),
          }
        )

        const { data, error } = await supaBaseData.json()

        if (error) {
          console.error("Failed to add item to cart:", error.message)
        } else {
          console.log("Item added to cart:", data)
          setCount(0) // Optionally reset count after adding
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error.message)
    }
  }

  return (
    <>
      <div className="cart-container">
        <button className="btn" onClick={decrement}>
          <img src="/icon-minus.svg" alt="Decrease quantity" />
        </button>
        <p className="amount">{count}</p>
        <button className="btn" onClick={increment}>
          <img src="/icon-plus.svg" alt="Increase quantity" />
        </button>
      </div>
      <div className="btn-shadow-container">
        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to cart
        </button>
        <div className="shadow"></div>
      </div>
    </>
  )
}

export default CartCounter
