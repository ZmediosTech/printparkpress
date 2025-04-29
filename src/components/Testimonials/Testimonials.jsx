import React from "react";
import Slider from "react-slick";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import Img1 from "../../assets/shirt/BhringrajA.jpg";
import Img2 from "../../assets/shirt/RosemaryA.jpg";
import Img3 from "../../assets/shirt/TeaTreeA.jpg";
const TestimonialData = [
  {
    id: 1,
    name: "Manish Tiwari",
    role: "Regular Customer",
    text: "Reduces hair fall, strengthens hair, and nourishes the scalp without being greasy.",
    img: Img1,
    rating: 5,
  },
  {
    id: 2,
    name: "Karan Sapra",
    role: "Verified Buyer",
    text: "Refreshing scent, reduces hair fall, and makes hair thicker and shinier.",
    img: Img2,
    rating: 5,
  },
  {
    id: 3,
    name: "Priyanshi Jain",
    role: "Premium Customer",
    text: "Cleanses the scalp, reduces dandruff, and leaves hair feeling fresh and soft.",
    img: Img3,
    rating: 5,
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
    <div className="py-16 mb-10 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-lg font-medium text-orange-500 mb-4">
            What our customers are saying
          </p>
          <h1 data-aos="fade-up" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-900 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent mb-6">
            Testimonials
          </h1>
          <p data-aos="fade-up" className="text-gray-600 dark:text-gray-400 text-lg">
            Discover why our customers love our products
          </p>
        </div>

        {/* Carousel */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div key={data.id} className="px-4 py-2">
                <div className="flex flex-col items-center gap-6 p-8 rounded-3xl relative group transition-all duration-300 hover:scale-105
                  bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl dark:shadow-orange-900/20
                  before:absolute before:inset-0 before:border-2 before:border-orange-200 dark:before:border-orange-700 before:rounded-3xl before:scale-105 before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300">
                  
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-400 dark:ring-orange-600 p-1 bg-white">
                      <img
                        src={data.img}
                        alt={data.name}
                        className="rounded-full w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full">
                      <FaQuoteRight className="text-sm" />
                    </div>
                  </div>

                  <div className="flex gap-1 text-orange-400">
                    {[...Array(data.rating)].map((_, index) => (
                      <FaStar key={index} />
                    ))}
                  </div>

                  <div className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {data.text}
                    </p>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        {data.name}
                      </h3>
                      <p className="text-sm text-orange-500 font-medium">{data.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;