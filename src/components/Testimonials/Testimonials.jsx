import React from "react";
import Slider from "react-slick";
import { Card, Avatar, Typography, Rate } from "antd";
import { FaQuoteRight } from "react-icons/fa";
import Img1 from "../../assets/shirt/image1.avif";
import Img2 from "../../assets/shirt/image2.avif";
import Img3 from "../../assets/shirt/image3.avif";

const { Title, Text, Paragraph } = Typography;

const TestimonialData = [
  {
    id: 1,
    name: "Manish Tiwari",
    role: "Verified Buyer",
    text: "The product quality exceeded my expectations. The packaging was secure and delivery was on time.",
    img: Img1,
    rating: 5,
    address: "Dubai",
  },
  {
    id: 2,
    name: "Karan Sapra",
    role: "Regular Customer",
    text: "Very satisfied with the product. It’s exactly as described and works perfectly for my needs.",
    img: Img2,
    rating: 5,
    address: "India",
  },
  {
    id: 3,
    name: "Priyanshi Jain",
    role: "Premium Member",
    text: "Top-notch build quality and finish. I’ve ordered multiple times and always had a great experience.",
    img: Img3,
    rating: 5,
    address: "Europe",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },  
      },
    ],
  };

  return (
    <div className="py-30 my-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Title level={2} className="!text-3xl md:!text-5xl font-semibold dark:!text-white">
            Customer Reviews
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">
            See what our satisfied customers are saying about us!
          </Text>
        </div>

        {/* Carousel */}
        <Slider {...settings}>
          {TestimonialData.map((data) => (
            <div key={data.id} className="px-4">
              <Card
                className="rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:border-none"
                bordered={false}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Avatar
                      size={96}
                      src={data.img}
                      className="border-2 border-white shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                      <FaQuoteRight className="text-sm" />
                    </div>
                  </div>

                  <Rate disabled defaultValue={data.rating} className="!text-orange-400" />

                  <Paragraph className="text-center text-gray-600 dark:text-gray-300 !mb-4">
                    "{data.text}"
                  </Paragraph>

                  <div className="text-center">
                    <Title level={4} className="!mb-1 dark:!text-white">
                      {data.name}
                    </Title>
                    <Text type="secondary" className="text-orange-500 text-sm">
                      {data.address}
                    </Text>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
