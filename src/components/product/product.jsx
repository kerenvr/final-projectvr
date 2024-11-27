import Slideshow from '../slideshow/slideshow';
import ProductDescription from '../description/description';
import './product.css';
import { useEffect, useState } from 'react';
import supabase from '../../../supabaseClient'; // import your Supabase client

function ProductPage({ updateCartCount }) {
  const [product, setProduct] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(null);

  // Fetch product data from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Access the 'products' table
          .select('*')
          .limit(1); // Assuming you are fetching one product for this page
        
        if (error) {
          throw new Error(error.message);
        }

        console.log('Fetched product:', data);
        setProduct(data[0]);  // Store the first product from the array
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, []);

  // Fetch discount data from Supabase
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const { data, error } = await supabase
          .from('discounts') // Access the 'discounts' table
          .select('*')
          .limit(1); // Assuming you are fetching one discount for simplicity

        if (error) {
          throw new Error(error.message);
        }

        console.log('Fetched discounts:', data);
        setDiscountAmount(data[0]);  // Store the first discount from the array
      } catch (error) {
        console.error('Error fetching discounts:', error);
      }
    };

    fetchDiscounts();
  }, []);

  // If product or discount data isn't fetched yet, show a loading message
  if (!product || !discountAmount) {
    return <div>Loading...</div>;
  }

  // Destructure product and discount details
  const { name, description, price, discount_id } = product;
  const company = 'SNEAKER COMPANY';

  const { discountId, description: discountDesc, type, amount } = discountAmount;

  const oldprice = (price / (1 - amount / 100)).toFixed(2); // Calculate old price based on discount

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
  );
}

export default ProductPage;
