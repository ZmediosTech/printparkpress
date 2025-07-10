import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Row,
  Col,
  Card,
  Typography,
  Pagination,
  Empty,
  Spin,
  Button,
} from "antd";
import { FaShoppingCart } from "react-icons/fa";
import CategoryHero from "../CategoryHero.JSX";
import BgImage from "../../assets/hero/smiley.webp";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Paragraph, Text } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchSingleProduct(id);
    fetchRelatedProducts();
  }, [id]);

  const fetchSingleProduct = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
      );
      const data = await response.json();
      if (response.ok) {
        setProduct(Array.isArray(data.data) ? data.data : [data.data]);
      } else {
        console.error("Error fetching product:", data.error);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products`
      );
      const data = await response.json();
      if (response.ok && data.data) {
        setRelatedProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedProducts = relatedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (!product.length && !loading) {
    return (
      <div className="text-center py-20">
        <Title level={2}>Product not found</Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen px-4 sm:px-6 lg:px-20 pt-24 ">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
          </div>
        ) : (
          product.map((item) => {
            const original = item.originalPrice || item.price;
            const current = item.price;
            const discountPercentage =
              original && current && original > current
                ? Math.round(((original - current) / original) * 100)
                : 0;

            return (
              <Row
                gutter={[24, 48]}
                key={item._id}
                className="p-0 sm:p-4 mt-8"
                data-aos="fade-up"
              >
                {/* Image */}
                <Col xs={24} md={12} className="flex justify-center " data-aos="fade-right">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.imageUrl}`}
                    alt={item.title}
                    className="rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain "
                  />
                </Col>

                {/* Product Info */}
                <Col xs={24} md={12} data-aos="fade-left">
                  <div className="space-y-4 px-2 sm:px-4">
                    <Title level={2} className="!text-2xl sm:!text-3xl md:!text-4xl">
                      {item.title}
                    </Title>
                    <Title level={4} className="text-gray-700 !text-base sm:!text-lg md:!text-xl">
                      {item.subtitle}
                    </Title>

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

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mt-4" data-aos="zoom-in">
                      <button
                        className="border px-4 py-1 text-xl font-semibold rounded hover:bg-gray-100"
                        onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                      >
                        -
                      </button>
                      <div className="border px-6 py-1 text-lg rounded bg-gray-100">
                        {qty}
                      </div>
                      <button
                        className="border px-4 py-1 text-xl font-semibold rounded hover:bg-gray-100"
                        onClick={() => setQty(qty + 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Bag Button */}
                    <button
                      onClick={() => addToCart({ ...item, quantity: qty })}
                      className="bg-black text-white text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-full mt-4 sm:mt-6 hover:bg-gray-800 transition flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <FaShoppingCart />
                      <span>Add to bag</span>
                    </button>

                    {/* Description */}
                    <Paragraph className="mt-6 text-gray-700 text-base sm:text-lg leading-relaxed">
                      {item.description}
                    </Paragraph>
                  </div>
                </Col>
              </Row>
            );
          })
        )}

        {/* Related Products */}
        <div className="mt-16 sm:mt-20 px-4 sm:px-8 lg:px-28" data-aos="fade-up">
          <Title level={2}>You may also like</Title>

          {relatedProducts.length === 0 ? (
            <Empty description="No related products found" />
          ) : (
            <>
              <Row gutter={[16, 24]} className="mt-4">
                {paginatedProducts.map((product) => {
                  const original = product.originalPrice || product.price;
                  const current = product.price;
                  const discountPercentage =
                    original && current && original > current
                      ? Math.round(((original - current) / original) * 100)
                      : 0;

                  return (
                    <Col key={product._id} xs={24} sm={12} md={6}>
                      <Card
                        hoverable
                        onClick={() => navigate(`/product/${product._id}`)}
                        cover={
                          <img
                            alt={product.title}
                            src={`${import.meta.env.VITE_IMAGE_BASE_URL}${product.imageUrl}`}
                            className="h-48 sm:h-56 object-cover rounded-t-md transition-transform hover:scale-105 w-full"
                          />
                        }
                        className="shadow-md hover:shadow-xl transition duration-300 rounded-lg"
                        data-aos="zoom-in"
                      >
                        <Card.Meta
                          title={
                            <span className="font-semibold text-base">
                              {product.title}
                            </span>
                          }
                          description={
                            <>
                              <Paragraph ellipsis={{ rows: 2 }}>
                                {product.description}
                              </Paragraph>
                              {discountPercentage > 0 ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <Text delete className="text-sm text-gray-400">
                                    AED {original}
                                  </Text>
                                  <Text strong className="text-green-600">
                                    AED {current}
                                  </Text>
                                  <Text type="danger" className="text-xs">
                                    Save {discountPercentage}%
                                  </Text>
                                </div>
                              ) : (
                                <Text strong>AED {current}</Text>
                              )}
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  total={relatedProducts.length}
                  pageSize={productsPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Section */}
      <div className="" data-aos="fade-up">
        <CategoryHero BgImage={BgImage} content={false} />
      </div>
    </>
  );
};

export default ProductDetail;
