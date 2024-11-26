import Slideshow from '../slideshow/slideshow';
import ProductDescription from '../description/description';
import './product.css';
import { useEffect, useState } from 'react';

function ProductPage({ updateCartCount }) {
  const [product, setProduct] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(null);

  useEffect(() => {
      const fetchProduct = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/products'); 
          const data = await response.json();
          console.log('Fetched products:', data);
          setProduct(data[0]); 
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }, []);

    useEffect(() => {
      const fetchDiscounts = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/discounts');
          const data = await response.json();
          // Process discounts as needed
          setDiscountAmount(data[0]);;
        } catch (error) {
          console.error('Error fetching discounts:', error);
        }
      };
    
      fetchDiscounts();
    }, []);

    if (!product) {
      return <div>Loading...</div>;
    }

    const { name, description, price, discount } = product;
    const company = "SNEAKER COMPANY"
    console.log('Price:', price, 'Discount:', discount);

    const { discountId, discountDesc, type, amount } = discountAmount;

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
