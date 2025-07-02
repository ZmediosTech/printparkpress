import React from "react";
import { useNavigate } from "react-router-dom";
// import BgImage from "../assets/hero/famms-1.png"; // <- imported background
import BgImage from "../../assets/hero/famms-2.png"; // <- imported background

const CategoryHero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="w-full max-w-full bg-gray-400  h-96 mx-auto px-4 sm:px-8 mt-16 bg-cover bg-center rounded-3xl"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}
    >
     
    </section>
  );
};
export default CategoryHero