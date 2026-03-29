import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';
import '../styles/general.css';
import '../styles/products.css';
import '../styles/main-page-responsive-css/responsive-general.css';
import '../styles/main-page-responsive-css/responsive-products.css';
import '../styles/footer/footer.css';
import '../styles/footer/footer-responsive-css/responsive-footer.css';

const Products = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [productCounts, setProductCounts] = useState({});

  const products = [
    { name: 'Mug', price: '$5.99', images: ['/products-img/mug.png', '/products-img/thermal-mug.png', '/products-img/mug.png'], references: 1 },
    { name: 'Thermal Mug', price: '$9.99', images: ['/products-img/thermal-mug.png', '/products-img/mug.png', '/products-img/thermal-mug.png'], references: 2 },
    { name: 'T-shirt', price: '$19.99', images: ['/products-img/mug.png', '/products-img/thermal-mug.png', '/products-img/mug.png'], references: 3 },
    { name: 'Hoodi', price: '$29.99', images: ['/products-img/thermal-mug.png', '/products-img/mug.png', '/products-img/thermal-mug.png'], references: 4 },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    const initialIndexes = {};
    products.forEach((_, index) => {
      initialIndexes[index] = 0;
    });
    setCurrentImageIndex(initialIndexes);
  }, []);

  const handleAddToCart = (productIndex) => {
    setProductCounts(prev => ({
      ...prev,
      [productIndex]: (prev[productIndex] || 0) + 1
    }));
    setCartTotal(prev => prev + 1);
  };

  const handleImageNavigation = (productIndex, direction) => {
    setCurrentImageIndex(prev => {
      const current = prev[productIndex] || 0;
      const maxIndex = products[productIndex].images.length - 1;
      if (direction === 'left' && current > 0) {
        return { ...prev, [productIndex]: current - 1 };
      } else if (direction === 'right' && current < maxIndex) {
        return { ...prev, [productIndex]: current + 1 };
      }
      return prev;
    });
  };

  return (
    <div>
      <Header 
        onLoginClick={() => setShowLoginModal(true)} 
        onApplyClick={() => setShowApplyModal(true)} 
      />
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSwitchToApply={() => { setShowLoginModal(false); setShowApplyModal(true); }}
        />
      )}
      
      {showApplyModal && (
        <ApplyModal 
          onClose={() => setShowApplyModal(false)} 
          onSwitchToLogin={() => { setShowApplyModal(false); setShowLoginModal(true); }}
        />
      )}

      <div className="main-body-without-logo-apply-css">
        <div className="inside-main-body-without-logo-apply-css">
          {/* Products */}
          <div className="title-products-css">
            <div className="products-white-banner-css">
              <p className="products-text-css">Products</p>
            </div>
          </div>

          {products.map((product, productIndex) => (
            <div key={productIndex} className="product-main-container-css">
              <div className="product-name-moving-buttons-container-css">
                <img 
                  className="moving-left-css product-moving-left-js" 
                  src="/icons/subjects-icons/moving-buttons/moving-left.png" 
                  alt="Previous"
                  onClick={() => handleImageNavigation(productIndex, 'left')}
                  style={{ cursor: 'pointer' }}
                />
                <p className="product-name-css product-name-js">{product.name}</p>
                <img 
                  className="moving-right-css product-moving-right-js" 
                  src="/icons/subjects-icons/moving-buttons/moving-right.png" 
                  alt="Next"
                  onClick={() => handleImageNavigation(productIndex, 'right')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="product-elements-container-css">
                <div className="cart-referance-container-css">
                  <div className="product-location-container-css">
                    <img className="location-icon-css" src="/products-img/products-icons/location.png" alt="Location" />
                    <p className="location-country-css">Delivery: Tajikistan</p>
                  </div>
                  <div>
                    <button 
                      className="add-to-cart-css add-to-cart-js"
                      onClick={() => handleAddToCart(productIndex)}
                    >
                      <div className="add-to-cart-content">
                        {productCounts[productIndex] > 0 && (
                          <p className="add-to-cart-count-css add-to-cart-count-js">{productCounts[productIndex]}</p>
                        )}
                        <span>Add to cart</span>
                      </div>
                    </button>
                  </div>
                  <button className="students-referances-css students-referances-js">
                    <p className="student-referance-count-css">{product.references}</p>
                    <span>Students Referances</span>
                  </button>
                </div>
                <div className="product-container-css">
                  <div className="product-img-container-css">
                    <img 
                      className="product-img-css product-img-js" 
                      src={product.images[currentImageIndex[productIndex] || 0]} 
                      alt={product.name}
                    />
                  </div>
                  <div className="product-point-container-css">
                    {product.images.map((_, imgIndex) => (
                      <div 
                        key={imgIndex}
                        className={`product-point-css ${(currentImageIndex[productIndex] || 0) === imgIndex ? 'active' : ''}`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="cart-conatiner-css">
                  <p className="product-price-css">{product.price}</p>
                  <div className="cart-img-container-css">
                    {cartTotal > 0 && (
                      <p className="total-cart-count-css total-cart-count-js">{cartTotal}</p>
                    )}
                    <img className="cart-img-css" src="/products-img/products-icons/cart.png" alt="Cart" />
                  </div>
                  <button className="product-pay-css">Buy</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;

