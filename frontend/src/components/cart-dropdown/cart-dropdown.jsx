import "./cart-dropdown.css"
import { useEffect, useState } from "react"

function CartDropdown() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const userId = 1 // Use the logged-in user's ID (replace with actual user ID)

  // Fetch cart items and product details
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true)
      try {
        // Fetch cart items for the logged-in user
        const supaBaseData = await fetch(
          "https://final-projectvr-2.onrender.com/api/cart/fetch-all-items",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        )

        const { existingCartItems, error, details } = await supaBaseData.json()

        if (error) {
          console.error("Error fetching cart items:", details)
        } else {
          setCartItems(existingCartItems)
        }
      } catch (error) {
        console.error("Error fetching cart items:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [userId])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="cart-dropdown-container">
      <h3 className="cart-name">Cart</h3>
      <div className="horizontal-line"></div>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cartItems.map((item) => {
          const { name, price } = item.products
          const { quantity } = item

          const finalPrice = price * quantity

          return (
            <div key={item.product_id} className="info-container">
              <img
                src="/image-product-1-thumbnail.jpg"
                className="thumbnail"
                alt={name}
              />
              <div className="name-price">
                <h4 className="dropdown-name">{name}</h4>
                <div className="price-info">
                  <p>
                    ${price} x {quantity}
                  </p>
                  <p className="final-price">${finalPrice}</p>
                </div>
              </div>
              <img src="/icon-delete.svg" className="trash-icon" alt="Delete" />
            </div>
          )
        })
      )}

      <button className="checkout-btn">Checkout</button>
    </div>
  )
}

export default CartDropdown
