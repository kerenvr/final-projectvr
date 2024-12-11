import express from "express";
import { engine } from "express-handlebars";
import router from "./route-handlers.js"; // Assuming the router file is in the same directory

const PORT = process.env.PORT || 10000;
const app = express();

// Handlebars setup
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "views");

// Mount the router with the /api prefix
app.use("/api", router); // This ensures your routes will start with /api

// Example root route for testing (this is optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
