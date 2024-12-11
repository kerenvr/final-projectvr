import express from "express";
import { engine } from "express-handlebars";
import multer from "multer";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import cors from "cors";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import supabase from "./supabaseClient.js"; // Adjust this path if needed

const PORT = process.env.PORT || 10000;
const app = express();

// Handlebars setup
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "views");

// Middleware setup
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Configure for multi-part, form-based file uploads
const upload = multer({ dest: "uploads/" });

// Routes

// Route to fetch all products
app.post("/api/cart/fetch-products", async (req, res) => {
  try {
    const limit = req.body.limit || 10;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(limit);

    if (error) {
      return res.status(500).json({
        error: "Failed to fetch products.",
        details: error.message,
      });
    }
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    });
  }
});

// Route to fetch all items in the cart
app.post("/api/cart/fetch-all-items", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const { data, error } = await supabase
      .from("carts")
      .select("product_id, quantity, products(name, price)")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({
        error: "Failed to fetch items from cart.",
        details: error.message,
      });
    }
    res.status(200).json({ existingCartItems: data });
  } catch (err) {
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    });
  }
});

// Route to fetch a single item in the cart
app.post("/api/cart/fetch-single-item", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing userId or productId" });
    }

    const { data, error } = await supabase
      .from("carts")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .limit(1)
      .single();

    if (error) {
      return res.status(500).json({
        error: "Failed to fetch item from cart.",
        details: error.message,
      });
    }
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    });
  }
});

// Route to update the quantity for a cart item
app.patch("/api/cart/update-item-qty", async (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    if (!cartId || !quantity) {
      return res.status(400).json({ error: "Missing cartId or quantity" });
    }

    const { data, error } = await supabase
      .from("carts")
      .update({ quantity })
      .eq("id", cartId);

    if (error) {
      return res.status(500).json({
        error: "Failed to update item in cart.",
        details: error.message,
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    });
  }
});

// Route to add an item to the cart
app.put("/api/cart/add-item", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        error: "Missing userId, productId, or quantity.",
      });
    }

    const { data: existingCartItems, error: fetchError } = await supabase
      .from("carts")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .limit(1);

    if (fetchError) {
      return res.status(500).json({
        error: "Failed to fetch item from cart.",
        details: fetchError.message,
      });
    }

    if (existingCartItems.length > 1) {
      return res.status(500).json({
        error:
          "Unexpected multiple rows returned for the same user and product.",
      });
    }

    if (existingCartItems.length === 1) {
      const existingCartItem = existingCartItems[0];
      const updatedQuantity = existingCartItem.quantity + quantity;

      const { data, error } = await supabase
        .from("carts")
        .update({ quantity: updatedQuantity })
        .eq("id", existingCartItem.id);

      if (error) {
        return res.status(500).json({
          error: "Failed to update item in cart.",
          details: error.message,
        });
      }

      res.status(200).json(data);
    } else {
      const { data, error } = await supabase
        .from("carts")
        .insert([{ user_id: userId, product_id: productId, quantity }]);

      if (error) {
        return res.status(500).json({
          error: "Failed to add item to cart.",
          details: error.message,
        });
      }

      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    });
  }
});

// Route to fetch a discount
app.post("/api/cart/fetch-discounts", async (req, res) => {
  try {
    const limit = req.body.limit || 1;
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .limit(limit);

    if (error) {
      return res.status(500).json({
        error: "Failed to fetch discount.",
        details: error.message,
      });
    }

    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({
      error: "An unexpected error occurred.",
      details: err.message,
    });
  }
});

// CSRF Token Route
app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Root route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
