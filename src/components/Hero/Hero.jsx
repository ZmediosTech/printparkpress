import React from "react";
import Image1 from "../../assets/hero/Bhringraj.png";
import Image2 from "../../assets/hero/Rosemary.png";
import Image3 from "../../assets/hero/TeaTree.png";
import Image4 from "../../assets/hero/RosemaryWater.png";
import Slider from "react-slick";
import { Element } from "react-scroll";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Bhringraj Hair Oil",
    price: "200",
    description:
      "Bhringraj oil promotes hair growth, prevents dandruff, and strengthens the roots. Regular use improves scalp health and reduces hair loss naturally. This Ayurvedic agent nourishes deeply, reinforcing shine and volume.",
  },
  {
    id: 2,
    img: Image2,
    title: "Rosemary Hair Oil",
    price: "1200",
    description:
      "Rosemary oil improves circulation and stimulates hair growth. Its antioxidant and antimicrobial properties fight dandruff and strengthen hair, ensuring long-lasting strength and shine.",
  },
  {
    id: 3,
    img: Image3,
    title: "Tea Tree Shampoo",
    price: "900",
    description:
      "Tea tree shampoo soothes dandruff and itchy scalp while removing buildup. With antifungal properties, it promotes freshness and balances scalp health for clean, strong hair.",
  },
  {
    id: 4,
    img: Image4,
    title: "Rosemary Water",
    price: "800",
    description:
      "Rosemary water boosts hair growth and reduces dandruff. It strengthens roots, restores shine, and keeps hair smooth and healthy with regular use.",
  },
];

const Hero = ({ handleOrderPopup }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    appendDots: (dots) => (
      <div className="w-full flex justify-center mt-8">
        <ul className="flex space-x-3 justify-center">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-4 h-4 rounded-full bg-gray-400 hover:bg-orange-500 transition-all duration-300 hover:scale-125"></div>
    ),
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gradient-to-br from-orange-50 to-orange-100 flex items-center dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:text-white duration-200">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-300/20 dark:bg-orange-800/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-white/5 to-white/10 dark:via-black/5 dark:to-black/10"></div>
      </div>

      {/* Hero Content */}
      <Element name="home" className="w-full">
        <div className="container mx-auto px-4 sm:px-8 relative z-10 max-w-7xl">
          <Slider {...settings}>
            {ImageList.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16 items-center">
                  {/* Text Section */}
                  <div className="flex flex-col justify-center gap-6 text-center sm:text-left order-2 sm:order-1 max-w-xl mx-auto sm:mx-0">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-900 dark:from-orange-400 dark:to-orange-600 leading-tight">
                      {data.title}
                    </h1>
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                      {data.description}
                    </p>
                  </div>

                  {/* Image Section */}
                  <div className="order-1 sm:order-2">
                    <div className="flex justify-center sm:justify-end relative p-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-orange-100/30 dark:from-orange-900/20 dark:to-orange-800/20 rounded-3xl blur-2xl transform scale-95 -z-10"></div>
                      <img
                        src={data.img}
                        alt={data.title}
                        className="max-w-xs sm:max-w-sm lg:max-w-md w-full h-auto object-contain rounded-3xl hover:scale-105 transition-all duration-300 backdrop-blur-sm dark:bg-black/30 p-4 shadow-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </Element>

      {/* Dot styling */}
      <style>{`
        .slick-dots li.slick-active div {
          background-color: #ea580c;
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
};

export default Hero;
