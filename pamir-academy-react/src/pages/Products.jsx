import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import ApplyModal from '../components/ApplyModal';

const ChevronLeft = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

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

      <div className="max-w-[1100px] mx-auto px-5">
        {/* Page Title */}
        <div className="mt-16 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand text-center bg-gray-100 rounded-xl py-4">Products</h1>
        </div>

        {/* Product Cards */}
        <div className="flex flex-col gap-8">
          {products.map((product, productIndex) => (
            <div key={productIndex} className="bg-white rounded-2xl shadow-card overflow-hidden">
              {/* Product Header with Name & Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => handleImageNavigation(productIndex, 'left')}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 bg-gray-900 text-white px-5 py-1.5 rounded">{product.name}</h3>
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => handleImageNavigation(productIndex, 'right')}
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Product Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
                {/* Left: Cart & References */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-brand text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>Delivery: Tajikistan</span>
                  </div>
                  <button
                    className="relative bg-brand text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-brand-dark transition-colors"
                    onClick={() => handleAddToCart(productIndex)}
                  >
                    {productCounts[productIndex] > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                        {productCounts[productIndex]}
                      </span>
                    )}
                    Add to cart
                  </button>
                  <button className="flex items-center gap-2 bg-brand text-white px-4 py-1.5 rounded-full text-sm hover:bg-brand-dark transition-colors">
                    <span className="bg-black w-5 h-5 rounded-full text-xs flex items-center justify-center">{product.references}</span>
                    Students Referances
                  </button>
                </div>

                {/* Center: Product Image */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full max-w-[280px] aspect-square">
                    <img
                      className="w-full h-full object-contain border border-brand rounded-xl"
                      src={product.images[currentImageIndex[productIndex] || 0]}
                      alt={product.name}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {product.images.map((_, imgIndex) => (
                      <div
                        key={imgIndex}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${(currentImageIndex[productIndex] || 0) === imgIndex ? 'bg-white border-2 border-brand scale-125' : 'bg-brand'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Price & Cart */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <span className="text-3xl font-bold text-brand bg-white border border-gray-200 px-4 py-2 rounded-lg">{product.price}</span>
                  <div className="relative">
                    {cartTotal > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center z-10">
                        {cartTotal}
                      </span>
                    )}
                    <img className="w-16 h-14 object-contain" src="/products-img/products-icons/cart.png" alt="Cart" />
                  </div>
                  <button className="bg-gray-900 text-white px-8 py-2.5 rounded-full text-lg font-medium hover:bg-black transition-colors">
                    Buy
                  </button>
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
