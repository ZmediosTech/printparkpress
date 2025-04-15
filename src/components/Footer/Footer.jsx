import React from "react";
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
  {
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
  {
    title: "Blog",
    link: "/#blog",
  },
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
          <div className="md:col-span-2 grid sm:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <h1 className="text-xl font-bold mb-3">Important Links</h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((link) => (
                  <li
                    key={link.title}
                    className="cursor-pointer hover:text-primary hover:translate-x-1 transition text-gray-200"
                  >
                    {link.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h1 className="text-xl font-bold mb-3">Links</h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((link) => (
                  <li
                    key={`${link.title}-2`}
                    className="cursor-pointer hover:text-primary hover:translate-x-1 transition text-gray-200"
                  >
                    {link.title}
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
                <a href="#"><FaInstagram className="text-2xl hover:text-primary transition" /></a>
                <a href="#"><FaFacebook className="text-2xl hover:text-primary transition" /></a>
                <a href="#"><FaLinkedin className="text-2xl hover:text-primary transition" /></a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Footer;
