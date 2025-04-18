import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaHeart, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Img1 from "../../assets/women/BhringrajP.jpg";
import Img2 from "../../assets/women/RosemaryP.jpg";
import Img3 from "../../assets/women/TeaTreeP.jpg";
import Img4 from "../../assets/women/RosemaryWaterP.jpg";

export const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Bhringraj Hair Oil",
    price: "Rs.900",
    rating: 4,
    aosDelay: "0",
    description:
      "Bhringraj oil promotes hair growth, prevents dandruff and strengthens the roots. Regular use improves scalp health and reduces hair loss naturally. This Ayurvedic agent nourishes deeply, reinforcing shine and volume.",
  },
  {
    id: 2,
    img: Img2,
    title: "Rosemary Hair Oil",
    price: "Rs.800",
    aosDelay: "200",
    description:
      "Rosemary oil stimulates circulation and promotes hair growth. Its antioxidant and antimicrobial properties reduce dandruff and strengthen hair strands for long-lasting shine.",
  },
  {
    id: 3,
    img: Img3,
    title: "Tea Tree Shampoo",
    price: "Rs.700",
    aosDelay: "400",
    description:
      "Tea tree shampoo helps control dandruff, soothes the scalp, and removes buildup. Its antifungal properties balance scalp health and refresh oily hair.",
  },
  {
    id: 4,
    img: Img4,
    title: "Rosemary Water",
    price: "Rs.600",
    aosDelay: "600",
    description:
      "Rosemary water supports hair growth, reduces dandruff, and strengthens hair roots. It improves scalp circulation and restores smoothness and shine.",
  },
];

const Products = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedItem(product);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    const exists = wishlist.find((item) => item.id === product.id);
    setWishlist(exists ? wishlist.filter((item) => item.id !== product.id) : [...wishlist, product]);
  };

  const handleProductClick = (e, data) => {
    e.stopPropagation();
    setSelectedProduct(data);
    setShowModal(true);
    navigate(`/product/${data.id}`);
  };

  return (
    <div className="mt-14 mb-12 relative px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-orange-50 to-white">
      {/* Success Popup */}
      {showPopup && addedItem && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in-down flex items-center gap-3 transform hover:scale-105 transition-all duration-300">
          <FaCheckCircle className="text-2xl" />
          <span className="font-medium">{addedItem.title} added to cart!</span>
        </div>
      )}

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full relative transform transition-all duration-300 hover:scale-[1.02]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.title}
                className="w-full md:w-1/2 h-[400px] object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.title}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">{selectedProduct.price}</p>
                <p className="text-gray-600 leading-relaxed text-lg">{selectedProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p data-aos="fade-up" className="text-lg font-medium text-orange-500 mb-4">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-900 bg-clip-text text-transparent mb-6">
            Products
          </h1>
          <p data-aos="fade-up" className="text-gray-600 text-lg">
            Choose from our bestsellers loved by customers and powered by nature.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              className="bg-white cursor-pointer rounded-3xl p-6 w-full max-w-xs shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl relative group backdrop-blur-sm border border-orange-100"
              onClick={(e) => handleProductClick(e, data)}
            >
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src={data.img} 
                  alt={data.title} 
                  className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-4 text-center">
                {data.price}
              </p>
              
              <div className="text-center">
                <h3 className="font-bold text-gray-800 text-xl mb-3">{data.title}</h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {data.description}
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={(e) => handleAddToCart(e, data)}
                    className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-2.5 px-6 rounded-full hover:from-orange-500 hover:to-orange-700 flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-300/50"
                  >
                    <FaShoppingCart className="text-lg" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={(e) => handleWishlist(e, data)}
                    className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                      wishlist.find((item) => item.id === data.id)
                        ? "bg-red-500 text-white shadow-red-300/50"
                        : "bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white hover:shadow-red-300/50"
                    }`}
                  >
                    <FaHeart className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
);
};

export default Products;
