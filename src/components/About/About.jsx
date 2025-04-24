import React from "react";
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
    <div className="mt-14 mb-12 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-lg font-medium text-orange-500 mb-4">
            Learn More About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-900 bg-clip-text text-transparent mb-6">
            About Us
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Discover who we are, what drives us, and how we’re making a difference through our natural approach to hair care.
          </p>
        </div>

        {/* All Cards in a Single Row */}
        <div className="flex justify-between items-stretch flex-wrap md:flex-nowrap gap-6 md:gap-6">
          {aboutCards.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5  shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl border border-orange-100  flex flex-col"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4 group">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full  object-cover rounded-xl transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
