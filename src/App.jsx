import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change Switch to Routes
import Navbar from './components/nav/navbar';
import ProductPage from './components/product/product';
import HomePage from './pages/homepage/homepage';
import { useState } from 'react';

function App() {
    const [cartItemCount, setCartItemCount] = useState(0);

    const updateCartCount = (newCount) => {
        setCartItemCount(prevCount => prevCount + newCount);
    };

    return (
        <>
          <Navbar cartItemCount={cartItemCount} />

            <Router>
              <Routes> 
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage updateCartCount={updateCartCount} />} />
              </Routes>
            </Router>
        </>
    );
}

export default App;
