import React from "react";

const CategoryHero = ({ BgImage, content }) => {
  return (
    <section className="relative w-full h-auto mt-20">
      {/* Background Image */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px]">
        <img
          src={BgImage}
          alt="Category Hero"
          className="w-full h-full object-center object-cover"
        />

        {/* Overlay content */}
        {content && (
          <div className="absolute inset-0 flex items-center justify-center md:justify-end px-4 md:px-10">
            <div className="bg-white/80  backdrop-blur-md p-4 md:p-6 rounded-xl w-full sm:w-5/6 md:w-2/3 lg:w-1/2 text-center md:text-right">
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3">
                STATIONERY AT YOUR DOOR
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                Printpark Press is Dubai’s best online stationery shop near you that brings the most recognised stationery from around the world together in one place. We strive to bring originality to the Indian stationery market.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryHero;
