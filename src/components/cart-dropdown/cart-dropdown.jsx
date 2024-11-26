import "./cart-dropdown.css";
import thumbnail from "../../../public/image-product-1-thumbnail.jpg"
import deleteIcon from "../../../public/icon-delete.svg"

function CartDropdown({title, price, amountItems}) {
  const finalPrice = price * 3;

  return (
    <div className="cart-dropdown-container">
      <h3 className="cart-title">Cart</h3>
      <div className='horizontal-line'></div>
      <div className="info-container">
        <img src={thumbnail} className="thumbnail"></img>
        <div className="title-price">
          <h4 className="dropdown-title">
            {title}
          </h4>
          <div className="price-info">
            <p>${price} x {amountItems}</p>
            <p className="final-price">${finalPrice}</p>
          </div>
        </div>
        <img src={deleteIcon} className="trash-icon"></img>
      </div>
      <button className="checkout-btn">Checkout</button>
    </div>
  )
}

export default CartDropdown