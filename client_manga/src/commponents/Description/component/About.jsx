import React from "react";
import AboutBackground from "../../../assets/image/about-background.png";
import AboutBackgroundImage from "../../../assets/image/about-background-image.png";

const About = () => {
  return (
    <section id="about">
      <div className="about-section-container">
        <div className="about-background-image-container">
          <img src={AboutBackground} alt="" />
        </div>
        <div className="about-section-image-container">
          <img src={AboutBackgroundImage} alt="" />
        </div>
        <div className="about-section-text-container">
          <p className="primary-subheading">Giới thiệu</p>
          <h1 className="primary-heading">Sự ra đời của MangaToon</h1>
          <p className="primary-text">
            Với lối sống hối hả của công nghiệp hiện đại, việc cung cấp một nền
            tảng giải trí linh hoạt và thuận tiện giúp đáp ứng nhu cầu giải trí
            của người đọc mọi nơi và mọi lúc.
          </p>
          <p className="primary-text">
            Bằng cách này, việc biến SmartPhone thành một công cụ giải trí đa
            phương tiện, đặc biệt là cho việc đọc truyện, không chỉ là xu hướng
            mà còn là một giải pháp thú vị và tích cực đối với người sử dụng
            công nghệ.
          </p>
          <div className="about-buttons-container">
            <button className="secondary-button">Tìm hiểu thêm</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
