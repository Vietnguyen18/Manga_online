import React from "react";
import BannerBackground from "../../../assets/image/home-banner-background.png";
import BannerImage from "../../../assets/image/home-banner-image.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <section id="home">
      <div className="home-container">
        <Navbar />
        <div className="home-banner-container">
          <div className="home-bannerImage-container">
            <img src={BannerBackground} alt="" />
          </div>
          <div className="home-text-section">
            <h1 className="primary-heading">MangaToon</h1>
            <p className="primary-text">
              Khám phá những câu chuyện hấp dẫn, những nhân vật kỳ quặc và những
              cuộc phiêu lưu không giới hạn trong thế giới manga.
            </p>
            <button className="secondary-button" onClick={handleNavigate}>
              Khám phá ngay <FiArrowRight />{" "}
            </button>
          </div>
          <div className="home-image-section">
            <img src={BannerImage} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
