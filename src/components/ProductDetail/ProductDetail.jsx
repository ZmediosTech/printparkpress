import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductsData } from '../Products/Products';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = ProductsData.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex justify-center">
          <img src={product.img}
           alt={product.title} 
           className="rounded-lg w-[400px] h-[400px] object-cover shadow-lg" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl text-primary mb-4">{product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <button
            onClick={() => addToCart(product)}
            className="bg-gradient-to-r from-primary to-secondary text-white  bg-orange-400 px-6 py-3 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg flex items-center gap-2"
          >
           <FaShoppingCart />
           <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;