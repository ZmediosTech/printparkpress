import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { ProductsData } from '../Products/Products';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (product) => {
    if (product) {
      navigate(`/product/${product.id}`);
      setShowSuggestions(false);
      setSearchTerm('');
    }
  };
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = ProductsData.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-[300px]" ref={searchRef}>
      <div className={`relative transition-all duration-300 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setShowSuggestions(true);
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full px-6 py-3 border-2 border-orange-300 rounded-full 
            focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200
            dark:bg-gray-800 dark:border-orange-600 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-300"
        />
        <button 
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 
            bg-gradient-to-r from-orange-400 to-orange-500 
            hover:from-orange-500 hover:to-orange-600
            rounded-full transition-all duration-300 group
            ${isFocused ? 'scale-110' : ''}`}
        >
          <FaSearch className="text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {showSuggestions && searchTerm && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 
          border border-orange-200 dark:border-orange-700 rounded-2xl 
          shadow-lg shadow-orange-100 dark:shadow-orange-900/30 z-50 
          overflow-hidden backdrop-blur-sm">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="px-6 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 
                  cursor-pointer flex items-center gap-3 transition-colors duration-200"
                onClick={() => handleSearch(product)}
              >
                <div className="p-1.5 bg-orange-100 dark:bg-orange-800 rounded-full">
                  <FaSearch className="text-orange-500 dark:text-orange-300 text-sm" />
                </div>
                <span className="text-gray-700 dark:text-gray-200">{product.title}</span>
              </div>
            ))
          ) : (
            <div className="px-6 py-3 text-gray-500 dark:text-gray-400 flex items-center gap-3">
              <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;