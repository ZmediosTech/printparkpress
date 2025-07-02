import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Pagination, Modal, Rate, Tooltip } from "antd";
import { toast } from "react-hot-toast";
import { FaShoppingCart, FaHeart, FaCheckCircle } from "react-icons/fa";

const Products = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  let email = localStorage.getItem("email");
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      id: product._id || product.id,
      quantity: 1,
    };
    addToCart(productToAdd);
    setAddedItem(productToAdd);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 5000);
  };

  const handleWishlist = async (product) => {
    if (!email) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    try {
      const productId = product._id || product.id;
      const data = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/wishlist/user/${email}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }
      );

      if (data.ok) {
        setWishlistItems((prev) => new Set(prev).add(productId));
        toast.success("Item added to wishlist");
      } else {
        toast.error("Item is already in wishlist");
      }
    } catch (error) {
      toast.error("Error adding to wishlist");
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products?page=${page}&limit=8`
      );
      const data = await response.json();
      if (response.ok) {
        setProducts(data.data);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Error fetching products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <div className="mt-20 px-4 sm:px-8 md:px-16">
      <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">
       Our Products
      </h1>

      {showPopup && addedItem && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3">
          <FaCheckCircle className="text-2xl" />
          <span>{addedItem.title} added to cart!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 mx-10">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 relative group cursor-pointer overflow-hidden border"
          >
            <img
              alt={product.title}
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}${product.imageUrl}`}
              className="h-68 w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {product.title}
              </h3>
              <Rate
                disabled
                allowHalf
                defaultValue={product.rating || 0}
                className="text-yellow-400 mb-2"
              />
              <p className=" text-lg font-semibold">
                AED {product.price}
              </p>
            </div>

            {/* Icons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Tooltip title="Add to Cart">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="bg-white p-2 rounded-full shadow hover:bg-blue-100"
                >
                  <FaShoppingCart className="text-blue-600" />
                </button>
              </Tooltip>
              {/* <Tooltip title="Add to Wishlist">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlist(product);
                  }}
                  className={`bg-white p-2 rounded-full shadow ${
                    wishlistItems.has(product._id)
                      ? "text-red-500 hover:bg-red-100"
                      : "text-gray-500 hover:text-red-500 hover:bg-red-100"
                  }`}
                >
                  <FaHeart />
                </button>
              </Tooltip> */}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 items-center justify-center flex">
        <Pagination
          current={page}
          pageSize={8}
          total={totalPages * 8}
          onChange={(value) => setPage(value)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Products;