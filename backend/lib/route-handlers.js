import express from "express"
import multer from "multer"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import csrf from "csurf"
import cors from "cors"
import dotenv from "dotenv"
import sgMail from "@sendgrid/mail"
import supabase from "../supabaseClient.js"
import { database } from "./persistent-database.js" // or use "./in-memory-database.js"

const router = express.Router() // Create a router

/**
 * Mount Middleware
 */

// Public files, form data, JSON, CSRF protection, and CORS
router.use(express.static("public"))
router.use(bodyParser.urlencoded({ extended: false }))
router.use(express.json())
router.use(cookieParser())
const csrfProtection = csrf({ cookie: true })
router.use(
  cors({
    origin: true, // Allows any origin
    credentials: true,
  })
)

// Configure for multi-part, form-based file uploads
const upload = multer({ dest: "uploads/" })

// configs for sendgrid and credentials
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Shopping Cart Route Definitions
 */

// Route to fetch all products
router.post("/api/cart/fetch-products", async (req, res) => {
  try {
    const limit = req.body.limit || 10 // Default limit to 10 products

    // Query Supabase
    const { data, error } = await supabase
      .from("products") // Access the 'products' table
      .select("*")
      .limit(limit)

    // Handle Supabase errors
    if (error) {
      return res.status(500).json({
        error: "Failed to fetch products.",
        details: error.message,
      })
    }

    // Return the result
    res.status(200).json({ data })
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    })
  }
})

// Route to fetch all items in the cart
router.post("/api/cart/fetch-all-items", async (req, res) => {
  try {
    const { userId } = req.body

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" })
    }

    // Query Supabase
    const { data, error } = await supabase
      .from("carts")
      .select("product_id, quantity, products(name, price)") // Join products to get name and price
      .eq("user_id", userId)

    // Handle Supabase errors
    if (error) {
      return res.status(500).json({
        error: "Failed to fetch any items from cart.",
        details: error.message,
      })
    }

    // Return the result
    res.status(200).json({ existingCartItems: data })
  } catch (err) {
    // Handle unexpected errors
    res
      .status(500)
      .json({ error: "An unexpected error occurred.", details: err.message })
  }
})

// Route to fetch a single item in the cart
router.post("/api/cart/fetch-single-item", async (req, res) => {
  try {
    const { userId, productId } = req.body

    // Validate required fields
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ error: "Missing userId or productId in request body." })
    }

    // Query Supabase
    const { data, error } = await supabase
      .from("carts")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .limit(1)
      .single() // Directly fetch a single result for better clarity

    // Handle Supabase errors
    if (error) {
      return res.status(500).json({
        error: "Failed to fetch item from cart.",
        details: error.message,
      })
    }

    // Return the result
    res.status(200).json({ data })
  } catch (err) {
    // Handle unexpected errors
    res
      .status(500)
      .json({ error: "An unexpected error occurred.", details: err.message })
  }
})

// Route to update the quantity for a cart item
router.patch("/api/cart/update-item-qty", async (req, res) => {
  try {
    const { cartId, quantity } = req.body

    // Validate required fields
    if (!cartId || !quantity) {
      return res
        .status(400)
        .json({ error: "Missing cartId or quantity in request body." })
    }

    // Update the cart item
    const { data, error } = await supabase
      .from("carts")
      .update({ quantity })
      .eq("id", cartId)

    // Handle Supabase errors
    if (error) {
      return res.status(500).json({
        error: "Failed to update item in cart.",
        details: error.message,
      })
    }

    // Return the updated item
    res.status(200).json(data)
  } catch (err) {
    // Handle unexpected errors
    res
      .status(500)
      .json({ error: "An unexpected error occurred.", details: err.message })
  }
})

// Route to add an item to the cart
router.put("/api/cart/add-item", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body

    // Validate required fields
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        error: "Missing userId, productId, or quantity in request body.",
      })
    }

    // Query Supabase
    const { data: existingCartItems, error: fetchError } = await supabase
      .from("carts")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .limit(1) // Ensure at most one row is returned

    // Handle Supabase errors
    if (fetchError) {
      return res.status(500).json({
        error: "Failed to fetch item from cart.",
        details: fetchError.message,
      })
    }

    // If multiple rows are returned, handle the situation gracefully
    if (existingCartItems.length > 1) {
      return res.status(500).json({
        error:
          "Unexpected multiple rows returned for the same user and product.",
      })
    }

    if (existingCartItems.length === 1) {
      // If the product already exists, update the quantity
      const existingCartItem = existingCartItems[0]
      const updatedQuantity = existingCartItem.quantity + quantity

      const { data, error } = await supabase
        .from("carts")
        .update({ quantity: updatedQuantity })
        .eq("id", existingCartItem.id)

      // Handle Supabase errors
      if (error) {
        return res.status(500).json({
          error: "Failed to update item in cart.",
          details: error.message,
        })
      }

      // Return the updated item
      res.status(200).json(data)
    } else {
      // If the product doesn't exist in the cart, insert a new row
      const { data, error } = await supabase
        .from("carts")
        .insert([{ user_id: userId, product_id: productId, quantity }])

      // Handle Supabase errors
      if (error) {
        return res.status(500).json({
          error: "Failed to add item to cart.",
          details: error.message,
        })
      }
    }
  } catch (err) {
    // Handle unexpected errors
    res
      .status(500)
      .json({ error: "An unexpected error occurred.", details: err.message })
  }
})

// Route to fetch a discount
router.post("/api/cart/fetch-discounts", async (req, res) => {
  const limit = req.body.limit || 1 // Default limit to 1
  try {
    // Query Supabase
    const { data, error } = await supabase
      .from("discounts") // Access the 'discounts' table
      .select("*")
      .limit(limit) // Assuming you are fetching one discount for simplicity

    // Handle Supabase errors
    if (error) {
      return res.status(500).json({
        error: "Failed to fetch discount.",
        details: error.message,
      })
    }

    // Return the result
    res.status(200).json({ data })
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    })
  }
})

/**
 * SendGrid API Route Definitions
 */

// Route for CSRF token (when needed)
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// Route for API newsletter signup
router.post("/api/journal-signup", async (req, res) => {
  const { email } = req.body
  const msg = {
    to: email,
    from: "mmontoya@masters.edu", // Replace with your verified SendGrid sender email
    subject: "Thanks for subscribing!",
    text: "Thank you for signing up for our newsletter!",
    html: "<strong>Thank you for signing up for our newsletter!</strong>",
  }
  try {
    await sgMail.send(msg)
    res.send({ message: "Subscription successful!" })
  } catch (error) {
    console.error(error)
    res.send({
      message: "Error subscribing. Please try again. " + error,
    })
  }
})

/**
 * Express-Handlebars Route Definitions
 */

// Home route
router.get("/", async (req, res) => {
  try {
    const subscribers = await database.getSubscribers()
    res.render("home", { subscribers })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})

// Subscribe route
router.get("/subscribe", csrfProtection, async (req, res) => {
  const csrfToken = req.csrfToken()
  try {
    const subscribers = await database.getSubscribers()
    res.render("subscribe", { csrfToken, subscribers })
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})

// Create subscriber route
router.post(
  "/subscribers/create",
  upload.single("avatar"),
  csrfProtection,
  async (req, res) => {
    console.log(req.body)
    const subscriberData = {
      ...req.body,
      file: req.file ? req.file.filename : null,
    }
    try {
      await database.addSubscriber(subscriberData)
      res.redirect("/")
    } catch (error) {
      console.error(error)
      res.status(500).send("Internal Server Error")
    }
  }
)

// Delete subscriber route
router.post("/subscribers/delete/:id", async (req, res) => {
  try {
    await database.removeSubscriber(req.params.id)
    res.redirect("/")
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})
// Favorite subscriber route
router.post("/subscribers/favorite/:id", async (req, res) => {
  try {
    await database.favoriteSubscriber(req.params.id)
    res.redirect("/")
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
})

// Newsletter signup form route
router.get("/newsletter", csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken()
  res.render("newsletter", { csrfToken })
})

// Newsletter signup API
router.post("/api/newsletter-signup", csrfProtection, async (req, res) => {
  const { email } = req.body
  const msg = {
    to: email,
    from: "mmontoya@masters.edu", // Replace with your verified SendGrid sender email
    subject: "Thanks for subscribing!",
    text: "Thank you for signing up for our newsletter!",
    html: "<strong>Thank you for signing up for our newsletter!</strong>",
  }
  try {
    await sgMail.send(msg)
    res.render("newsletter", { message: "Subscription successful!" })
  } catch (error) {
    console.error(error)
    res.render("newsletter", {
      message: "Error subscribing. Please try again.",
    })
  }
})

export default router
