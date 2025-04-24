import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState([]);

  const fetchSingleProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      if (response.ok) {
        setProduct(Array.isArray(data.data) ? data.data : [data.data]);
      } else {
        console.error('Error fetching product:', data.error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    fetchSingleProduct(id);
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.floor(rating * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex gap-1 mb-4">{stars}</div>;
  };

  if (!product.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {product.map((item) => (
        <div key={item.id} className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/2 flex justify-center">
            <img
              src={`http://localhost:5000${item.imageUrl}`}
              alt={item.title}
              className="rounded-lg w-[400px] h-[400px] object-cover shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
            <p className="text-gray-600 mb-6">{item.description}</p>
            <p className="text-2xl font-semibold text-gray-800 mb-2">Rs {item.price}</p>
            {renderStars(item.rating)}

            <button
              onClick={() => addToCart(item)}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <FaShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductDetail;
