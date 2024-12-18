import React from "react";
import PickMeals from "../../../assets/image/pick-meals-image.png";
import ChooseMeals from "../../../assets/image/choose-image.png";
import DeliveryMeals from "../../../assets/image/delivery-image.png";

const OutstandingFeatures = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Đọc trực tuyến",
      text: "Đọc truyện ở bất cứ đâu không cần tải về.",
    },
    {
      image: ChooseMeals,
      title: "Cộng đồng",
      text: "Chia sẻ cảm xúc thảo luận sôi nổi",
    },
    {
      image: DeliveryMeals,
      title: "Cập nhật liên tục",
      text: "Tập mới mỗi tuần nhanh chóng mỗi tuần",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Giới thiệu</p>
        <h1 className="primary-heading">Tính năng</h1>
        <p className="primary-text">
          Website đọc truyện tranh online MangaToon có các chức năng chính sau:
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutstandingFeatures;
