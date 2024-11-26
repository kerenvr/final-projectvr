import express from 'express';
import cors from 'cors'; // Import the cors package
import productRoutes from './routes/productRoutes.js';
import discountRoutes from './routes/discountRoutes.js';
import cartRoutes from './routes/cartRoutes.js'

const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors());
app.use(express.json());  // Middleware to parse incoming JSON request bodies


// Use the product routes
app.use('/api/products', productRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/carts', cartRoutes);  // All cart routes will be under /api/cart


app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
