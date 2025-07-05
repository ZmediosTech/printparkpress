import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Pagination, Rate, Card, Badge } from "antd";
import { toast } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import CategoryHero from "../CategoryHero.JSX";
import BgImage from "../../assets/hero/doorstep.webp";

const { Meta } = Card;

const Products = ({show}) => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("default");

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
        `${
          import.meta.env.VITE_API_BASE_URL
        }/products?page=${page}&limit=12&sort=${sort}`
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
  }, [page, sort]);

  return (
    <>
      <div className="px-4 sm:px-8 md:px-44 my-6">
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
        <div className="flex justify-end mb-6 ">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`border border-gray-300 px-4 py-2 rounded shadow-sm ${show ? 'mt-8' : 'mt-0'}`}

          >
            <option value="default">Default</option>
            <option value="price_asc">Price (low to high)</option>
            <option value="price_desc">Price (high to low)</option>
            <option value="recent">Most recent</option>
          </select>
        </div>

        <div className="grid grid-cols-1 mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const original = product.originalPrice || product.price;
            const current = product.price;
            const discountPercentage =
              original && current && original > current
                ? Math.round(((original - current) / original) * 100)
                : 0;

            return (
              <div
                key={product._id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Badge.Ribbon
                  text={
                    // discountPercentage > 0
                    //   ? `${discountPercentage}% OFF`
                    //   :
                    product.category
                  }
                  color={discountPercentage > 0 ? "red" : "blue"}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.title}
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}${
                          product.imageUrl
                        }`}
                        className="h-64 object-cover cursor-pointer rounded-t-xl"
                        onClick={() => handleProductClick(product)}
                      />
                    }
                    className="rounded-xl shadow-md"
                  >
                    <Meta
                      title={
                        <span className="text-base font-semibold text-gray-800">
                          {product.title}
                        </span>
                      }
                      description={
                        <>
                          <Rate
                            disabled
                            allowHalf
                            defaultValue={product.rating || 0}
                            className="text-yellow-400 mb-2 text-sm"
                          />
                          {discountPercentage > 0 ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="line-through text-gray-400 text-sm">
                                  AED {original}
                                </span>
                                <span className="text-green-600 font-bold text-lg">
                                  AED {current}
                                </span>
                              </div>
                              <div className="text-xs text-red-500 font-medium mt-1">
                                Save {discountPercentage}%
                              </div>
                            </>
                          ) : (
                            <div className="text-lg font-bold text-gray-700">
                              AED {current}
                            </div>
                          )}
                        </>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </div>
            );
          })}
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
        <CategoryHero BgImage={BgImage} content={true} />
      </div>
    </>
  );
};

export default Products;
