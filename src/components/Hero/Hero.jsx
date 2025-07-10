import React from "react";
import { useNavigate } from "react-router-dom";
// import BgImage from "../assets/hero/famms-1.png"; // <- imported background
import BgImage from "../../assets/hero/home.webp"; // <- imported background

const CategoryHero = () => {
  const navigate = useNavigate();

  return (
<section className="w-full h-[650px] mt-20  overflow-hidden">
  <img
    src={BgImage}
    alt="Category Hero"
    className="w-full h-full object-cover"
  />
</section>

  );
};
export default CategoryHero