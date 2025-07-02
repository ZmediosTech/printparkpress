import React from "react";
import { Element } from "react-scroll";
import Img1 from "../../assets/shirt/BhringrajA.jpg";
import Img2 from "../../assets/shirt/RosemaryA.jpg";
import Img3 from "../../assets/shirt/TeaTreeA.jpg";
import Img4 from "../../assets/shirt/RosemaryWaterA.jpg";

const About = () => {
  const aboutCards = [
    {
      id: 1,
      img: Img1,
      title: "Bhringraj Hair Oil",
      description:
        "To lead in holistic hair care solutions by blending the richness of Ayurvedic wisdom with modern science, promoting natural beauty worldwide.",
    },
    {
      id: 2,
      img: Img2,
      title: "Rosemary Hair Oil",
      description:
        "To offer premium, nature-powered products that empower individuals to nurture their hair health, while ensuring sustainability and transparency.",
    },
    {
      id: 3,
      img: Img3,
      title: "TeaTree Shampoo",
      description:
        "We are a passionate team of herbalists, cosmetologists, and innovators committed to crafting safe and effective hair care you can trust.",
    },
    {
      id: 4,
      img: Img4,
      title: "Rosemary Water",
      description:
        "We are a passionate team of herbalists, cosmetologists, and innovators committed to crafting safe and effective hair care you can trust.",
    },
  ];

  return (
    <Element name="about">
      <div className="relative overflow-hidden min-h-[550px] py-20 px-4 sm:px-6 lg:px-10  dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:text-white transition-colors duration-300">
        {/* Decorative Gradient Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-1/2 -right-1/3 w-[600px] h-[600px]  dark:bg-orange-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px]  dark:bg-orange-800/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-lg font-medium text-orange-500 mb-4">Learn More About Us</p>
            <h1 className="text-4xl md:text-5xl font-extrabold  bg-clip-text text-transparent mb-6">
              About Us
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Discover who we are, what drives us, and how we’re making a difference through our natural approach to hair care.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="flex flex-wrap justify-between items-stretch gap-2">
            {aboutCards.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-500 hover:scale-105 border border-orange-100 dark:border-gray-700 flex flex-col w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 group">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full object-cover rounded-xl transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Element>
  );
};

export default About;
