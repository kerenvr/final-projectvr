import "./cart-dropdown.css"
import { useEffect, useState } from "react"
import supabase from "../../../supabaseClient" // Import your supabase client

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
        const { data: cartData, error } = await supabase
          .from("carts")
          .select("product_id, quantity, products(name, price)") // Join products to get name and price
          .eq("user_id", userId)

        if (error) {
          console.error("Error fetching cart items:", error.message)
        } else {
          setCartItems(cartData)
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
