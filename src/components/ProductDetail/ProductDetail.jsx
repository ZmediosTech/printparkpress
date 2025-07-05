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
      <div className="min-h-screen p-8 pt-24 mt-12 bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
          </div>
        ) : (
          product.map((item) => (
            <Row
              gutter={[40, 40]}
              key={item._id}
              className="p-8"
              data-aos="fade-up"
            >
              {/* Image */}
              <Col xs={24} md={12} className="flex justify-center" data-aos="fade-right">
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.imageUrl}`}
                  alt={item.title}
                  className="rounded-xl w-full max-w-[500px] h-auto object-contain shadow-lg"
                />
              </Col>

              {/* Product Info */}
              <Col xs={24} md={12} data-aos="fade-left">
                <div className="space-y-4">
                  <Title level={1} className="!text-4xl">{item.title}</Title>
                  <Title level={3} className="text-gray-700 !text-xl">
                    {item.subtitle}
                  </Title>
                  <Text className="text-2xl text-black font-semibold block">
                    AED {item.price}
                  </Text>

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
                    className="bg-black text-white text-lg px-8 py-3 rounded-full mt-6 hover:bg-gray-800 transition flex items-center gap-2"
                  >
                    <FaShoppingCart />
                    <span>Add to bag</span>
                  </button>

                  {/* Description */}
                  <Paragraph className="mt-6 text-gray-700 text-lg leading-relaxed">
                    {item.description}
                  </Paragraph>
                </div>
              </Col>
            </Row>
          ))
        )}

        {/* Related Products */}
        <div className="mt-20 mx-6 md:mx-28" data-aos="fade-up">
          <Title level={1}>You may also like</Title>

          {relatedProducts.length === 0 ? (
            <Empty description="No related products found" />
          ) : (
            <>
              <Row gutter={[24, 24]} className="mt-4">
                {paginatedProducts.map((product) => (
                  <Col key={product._id} xs={24} sm={12} md={6}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/product/${product._id}`)}
                      cover={
                        <img
                          alt={product.title}
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}${product.imageUrl}`}
                          className="h-56 object-cover rounded-t-md transition-transform hover:scale-105"
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
                            <Text strong>AED {product.price}</Text>
                          </>
                        }
                      />
                    </Card>
                  </Col>
                ))}
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
      <div className="mt-12" data-aos="fade-up">
        <CategoryHero BgImage={BgImage} content={false} />
      </div>
    </>
  );
};

export default ProductDetail;
