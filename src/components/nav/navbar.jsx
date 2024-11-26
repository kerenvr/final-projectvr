import './navbar.css'
import logo from '../../../public/logo.svg'
import menu from '../../../public/icon-menu.svg'
import cart from '../../../public/icon-cart.svg'
import avatar from '../../../public/image-avatar.png'
import CartDropdown from '../cart-dropdown/cart-dropdown'
import { useState } from 'react'


function Navbar({ cartItemCount }) {

const title = "Fall Limited Edition Sneakers";
const price = 125.00;
const amountItems = 3;
const [isCartOpen, setIsCartOpen] = useState(false);

const toggleCartDropDown = () => {
  setIsCartOpen(prevState => ! prevState)
}

  return (
    <>
        <nav className="navbar">
            <div className="navbar__container">
              <div className="hamburger-logo">
                <a href="/">
                  <img src={menu} alt="Hamburger" className='hamburger'/>
                </a>
                <a href="/">
                  <img src={logo} alt="Logo" className="logo"/>
                </a>

                <ul className="navbar__menu">
                    <li className="navbar__item">
                    <a href="/collections" className="navbar__link">Collections</a>
                    </li>
                    <li className="navbar__item">
                    <a href="/men" className="navbar__link">Men</a>
                    </li>
                    <li className="navbar__item">
                    <a href="/women" className="navbar__link">Women</a>
                    </li>
                    <li className="navbar__item">
                    <a href="/about" className="navbar__link">About</a>
                    </li>
                    <li className="navbar__item">
                    <a href="/contact" className="navbar__link">Contact</a>
                    </li>
                </ul>
              </div>


            <div className="cart-avatar">
              <a>
                <img src={cart} alt="Cart" className='cart' onClick={(toggleCartDropDown)}/>
                {cartItemCount > 0 && (
                        <span className="cart-count">{cartItemCount}</span>
                    )}
              </a>
              {
                isCartOpen && (
                  <CartDropdown 
                    title = {title}
                    price = {price} 
                    amountItems = {amountItems}
                  />
                )
              }

              <a href="/">
                <img src={avatar} alt="Avatar" className="avatar-image"/>
              </a>
            </div>
            </div>
        </nav>
        <div className='horizontal-line'></div>
    
    </>
  )
}

export default Navbar