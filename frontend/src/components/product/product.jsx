import Slideshow from "../slideshow/slideshow"
import ProductDescription from "../description/description"
import "./product.css"
import { useEffect, useState } from "react"

function ProductPage({ updateCartCount }) {
  const [product, setProduct] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(null)

  // Fetch product data from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const supaBaseData = await fetch(
          "https://final-projectvr-2.onrender.com/api/cart/fetch-products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 1 }),
          }
        )

        const { data, error } = await supaBaseData.json()

        if (error) {
          throw new Error(error.message)
        }
        setProduct(data[0]) // Store the first product from the array
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    fetchProduct()
  }, [])

  // Fetch discount data from Supabase
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const supaBaseData = await fetch(
          "https://final-projectvr-2.onrender.com/api/cart/fetch-discounts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 1 }),
          }
        )

        const { data, error } = await supaBaseData.json()

        if (error) {
          throw new Error(error.message)
        }

        setDiscountAmount(data[0]) // Store the first discount from the array
      } catch (error) {
        console.error("Error fetching discounts:", error)
      }
    }

    fetchDiscounts()
  }, [])

  // If product or discount data isn't fetched yet, show a loading message
  if (!product || !discountAmount) {
    return <div>Loading...</div>
  }

  // Destructure product and discount details
  const { name, description, price, discount_id } = product
  const company = "SNEAKER COMPANY"

  const { discountId, description: discountDesc, type, amount } = discountAmount

  const oldprice = (price / (1 - amount / 100)).toFixed(2) // Calculate old price based on discount

  return (
    <div className="product-page">
      <Slideshow className="product-slideshow" />
      <ProductDescription
        className="product-description"
        company={company}
        title={name}
        description={description}
        price={price}
        discount={amount}
        prevPrice={oldprice}
        updateCartCount={updateCartCount}
      />
    </div>
  )
}

export default ProductPage
