import CartCounter from "../cart-counter/cart-counter";
import "./description.css";
import { useState } from 'react';

function ProductDescription({ company, title, description, price, discount, prevPrice}) {

    return (
        <>
            <div className='container'>
                <div className='headings'> 
                    <h2 className='company'>{company}</h2>
                    <h1 className='title'>{title}</h1>
                </div>
                <div className='description'>
                    <p>{description}</p>
                </div>
                <div className="price-container">
                    <div className="price-discount">
                        <p className="price">${price}</p>
                        <p className="discount">{discount}%</p>
                    </div>
                    <p className="previous-price">${prevPrice}</p>
                </div>
                <div className="buttons">
                    <CartCounter />
                </div>
            </div>
        </>
    );
}

export default ProductDescription;
