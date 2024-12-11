import "./navbar.css"
import CartDropdown from "../cart-dropdown/cart-dropdown"
import { useState, useEffect } from "react"

function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const userId = 1 // Use the logged-in user's ID (replace with actual user ID)

  // Function to toggle the cart dropdown visibility
  const toggleCartDropDown = () => {
    setIsCartOpen((prevState) => !prevState)
  }

  // Fetch the cart item count from Supabase
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        // Fetch the total quantity of items in the cart for the current user
        const supaBaseData = await fetch(
          "https://final-projectvr-2.onrender.com",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        )

        const { existingCartItems, error, details } = await supaBaseData.json()

        if (!existingCartItems || error) {
          console.error("Error fetching cart items:", details)
          return
        }

        // Calculate the total count by summing up the quantity of all cart items
        const totalQuantity = existingCartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        )

        setCartItemCount(totalQuantity)
      } catch (error) {
        console.error("Error fetching cart item count:", error.message)
      }
    }

    fetchCartItemCount()
  }, [userId]) // Re-fetch if the userId changes (could be dynamically set)

  return (
    <>
      <nav className="navbar">
        <div className="navbar__container">
          <div className="hamburger-logo">
            <a href="/">
              <img src="/icon-menu.svg" alt="Hamburger" className="hamburger" />
            </a>
            <a href="/">
              <img src="/logo.svg" alt="Logo" className="logo" />
            </a>

            <ul className="navbar__menu">
              <li className="navbar__item">
                <a href="/collections" className="navbar__link">
                  Collections
                </a>
              </li>
              <li className="navbar__item">
                <a href="/men" className="navbar__link">
                  Men
                </a>
              </li>
              <li className="navbar__item">
                <a href="/women" className="navbar__link">
                  Women
                </a>
              </li>
              <li className="navbar__item">
                <a href="/about" className="navbar__link">
                  About
                </a>
              </li>
              <li className="navbar__item">
                <a href="/contact" className="navbar__link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="cart-avatar">
            <a href="#" onClick={toggleCartDropDown}>
              <img src="/icon-cart.svg" alt="Cart" className="cart" />
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </a>
            {isCartOpen && <CartDropdown />}
            <a href="/">
              <img
                src="/image-avatar.png"
                alt="Avatar"
                className="avatar-image"
              />
            </a>
          </div>
        </div>
      </nav>
      <div className="horizontal-line"></div>
    </>
  )
}

export default Navbar
