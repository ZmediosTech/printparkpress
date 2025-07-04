import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Pagination, Modal, Rate, Tooltip, Card, Badge } from "antd";
import { toast } from "react-hot-toast";
import { FaShoppingCart, FaHeart, FaCheckCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import CategoryHero from "../CategoryHero.JSX";
// import BgImage from "../assets/hero/doorstep.webp";
import BgImage from "../../assets/hero/doorstep.webp";


const { Meta } = Card;

const Products = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useCart();
  let email = localStorage.getItem("email");

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleAddToCart = (product) => {
    const productToAdd = {
      ...product,
      id: product._id || product.id,
      quantity: 1,
    };
    addToCart(productToAdd);
    setAddedItem(productToAdd);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);
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
        `${import.meta.env.VITE_API_BASE_URL}/products?page=${page}&limit=12`
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
    <>
      <div className="px-4 sm:px-8 md:px-16 my-6">
        <h1
          className="text-center text-4xl font-bold mb-8 text-gray-800"
          data-aos="fade-down"
        >
          Our Products
        </h1>

        {showPopup && addedItem && (
          <div
            className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
            data-aos="zoom-in"
          >
            <FaCheckCircle className="text-xl" />
            <span>{addedItem.title} added to cart!</span>
          </div>
        )}

        <div className="grid grid-cols-1 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={product._id} data-aos="fade-up" data-aos-delay={index * 100}>
              <Badge.Ribbon
                text={product.category}
                color="pink"
                className="hover:scale-105 transition-transform duration-300"
              >
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.title}
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL}${product.imageUrl}`}
                      className="h-64 object-cover"
                      onClick={() => handleProductClick(product)}
                    />
                  }
                  className="rounded-xl shadow-md"
                  // actions={[
                  //   <Tooltip title="Add to Cart" key="cart">
                  //     <FaShoppingCart
                  //       onClick={(e) => {
                  //         e.stopPropagation();
                  //         handleAddToCart(product);
                  //       }}
                  //       className="text-blue-600 hover:text-blue-800 text-lg"
                  //     />
                  //   </Tooltip>,
                  //   <Tooltip title="Add to Wishlist" key="heart">
                  //     <FaHeart
                  //       onClick={(e) => {
                  //         e.stopPropagation();
                  //         handleWishlist(product);
                  //       }}
                  //       className={`text-lg ${
                  //         wishlistItems.has(product._id)
                  //           ? "text-red-500"
                  //           : "text-gray-400 hover:text-red-500"
                  //       }`}
                  //     />
                  //   </Tooltip>,
                  // ]}
                >
                  <Meta
                    title={
                      <span className="text-lg font-semibold text-gray-800">
                        {product.title}
                      </span>
                    }
                    description={
                      <>
                        <Rate
                          disabled
                          allowHalf
                          defaultValue={product.rating || 0}
                          className="text-yellow-400 mb-2"
                        />
                        <div className="text-lg font-bold text-gray-700">
                          AED {product.price}
                        </div>
                      </>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Pagination
            current={page}
            pageSize={12}
            total={totalPages * 12}
            onChange={(value) => setPage(value)}
            showSizeChanger={false}
          />
        </div>
      </div>

      <div className="" data-aos="fade-up">
        <CategoryHero BgImage ={BgImage} content ={true}/>
      </div>
    </>
  );
};

export default Products;
