import express from "express";
import { engine } from "express-handlebars";
import router from "./route-handlers.js"; // Ensure this file exports a router
import path from "path"; // For serving static files
import dotenv from "dotenv"; // To load environment variables

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Handlebars setup
app.engine("hbs", engine({
  extname: ".hbs", // Set the file extension for Handlebars templates
  defaultLayout: "main", // Optional: specify a default layout file
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // Ensure views folder path is correct

// Middleware to serve static files (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Middleware for route handlers (use your imported router here)
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
