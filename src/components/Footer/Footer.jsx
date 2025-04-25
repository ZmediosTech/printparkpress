import React from "react";
import { Link as ScrollLink } from "react-scroll";
import footerLogo from "../../assets/logo.jpeg";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  width: "100%",
};

const FooterLinks = [
  { title: "Home", link: "home" },
  { title: "About", link: "about" },
  { title: "Contact", link: "contact" },
  { title: "Blog", link: "blog" },
];

const Footer = () => {
  return (
    <div style={BannerImg} className="text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-aos="zoom-in" className="grid md:grid-cols-3 gap-8 pt-10 pb-32">
          {/* Company Details */}
          <div>
            <h1 className="sm:text-3xl text-xl font-bold mb-3 flex items-center gap-3">
              <img src={footerLogo} alt="Glowriti Logo" className="max-w-[50px]" />
              Glowriti
            </h1>
            <p className="text-gray-300 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
              beatae ea recusandae blanditiis veritatis.
            </p>
          </div>

          {/* Footer Links */}
          <div className="md:col-span-1">
            <h1 className="text-xl font-bold mb-3">Important Links</h1>
            <ul className="flex flex-col gap-3">
              {FooterLinks.map((item) => (
                <li key={item.title}>
                  <ScrollLink
                    to={item.link}
                    smooth={true}
                    duration={800}
                    offset={-70}
                    className="cursor-pointer hover:text-orange-500 transition-all duration-200 text-gray-200"
                  >
                    {item.title}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h1 className="text-xl font-bold mb-3">Contact Us</h1>
            <div className="flex items-center gap-3 mb-3">
              <FaLocationArrow />
              <p>Noida, Uttar Pradesh</p>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <FaMobileAlt />
              <p>+91 123456789</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#"><FaInstagram className="text-2xl hover:text-orange-500 transition" /></a>
              <a href="#"><FaFacebook className="text-2xl hover:text-orange-500 transition" /></a>
              <a href="#"><FaLinkedin className="text-2xl hover:text-orange-500 transition" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
