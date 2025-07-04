import React from "react";

const CategoryHero = ({BgImage,content}) => {
  return (
    <section className="w-full h-[650px] mt-20 p-0 relative overflow-hidden">
      <img
        src={BgImage}
        alt="Category Hero"
        className="w-full h-full object-cover"
      />

      {/* Text on right side */}
      {content == true &&
      <div className="absolute inset-0 flex items-center justify-end  ">
        <div className=" p-6 rounded-xl w-1/2 ">
          <h1 className="text-4xl font-bold mb-4 w-full">STATIONERY AT YOUR DOOR</h1>
          <p className="text-lg text-gray-700 leading-loose">
            Printpark Press is Dubai best online stationery shop near you that brings the most recognised stationery from around the world together in one place. We strive to bring originality to the Indian stationery market.
          </p>
        </div>
      </div>}
    </section>
  );
};

export default CategoryHero;
