import express from "express";
import { engine } from "express-handlebars";
import multer from "multer";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import cors from "cors";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import supabase from "../supabaseClient.js"; // Assuming this is correct and imported correctly

const PORT = process.env.PORT || 10000;
const app = express();

// Handlebars setup
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "views");

// Middleware Setup
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
app.use(
  cors({
    origin: true, // Allows any origin
    credentials: true, // Allows credentials
  })
);

// Configure for multi-part, form-based file uploads
const upload = multer({ dest: "uploads/" });

// Load environment variables and configure SendGrid
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create a router
const router = express.Router();

/**
 * Shopping Cart Route Definitions
 */

// Route to fetch all products
router.post("/cart/fetch-products", async (req, res) => {
  try {
    const limit = req.body.limit || 10; // Default limit to 10 products

    // Query Supabase
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

// Other routes for cart operations (fetch-all-items, fetch-single-item, etc.) would follow similarly

// Route for CSRF token (when needed)
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Mount the router with the /api prefix
app.use("/api", router); // All routes in router now begin with `/api`

// Example root route for testing (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
