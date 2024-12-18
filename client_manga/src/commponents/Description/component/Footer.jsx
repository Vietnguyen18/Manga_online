import React from "react";
import Logo from "../../../assets/image/logo_3.png";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-logo-container" onClick={handleNavigate}>
          <img src={Logo} alt="" />
        </div>
        <div className="footer-icons">
          <BsTwitter />
          <SiLinkedin />
          <BsYoutube />
          <FaFacebookF />
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>Hotline</span>
          <span>Email</span>
          <span>Hỗ trợ</span>
          <span>Website</span>
        </div>
        <div className="footer-section-columns">
          <span>0383917124</span>
          <span>mangatoon@work.com</span>
          <span>mangatoon@work.com</span>
          <span>manga.toon</span>
        </div>
        <div className="footer-section-columns">
          <span>Terms & Conditions</span>
          <span>Copyright © 2024 manga.toon</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
