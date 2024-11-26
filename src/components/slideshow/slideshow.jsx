import imageProduct1 from '../../../public/image-product-1.jpg'
import './slideshow.css'

function Slideshow() {
  return (
    <>
        <img src={imageProduct1} alt="Product" className='productImg'/>
    </>
  )
}

export default Slideshow