import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListAllMangaFilterCategory } from "../../../services/api";
import { Container } from "react-bootstrap";
import { CiStar } from "react-icons/ci";
import "./FilterCate.scss";
import { FaFlag } from "react-icons/fa";
import { Pagination } from "antd";

const FilterCategory = () => {
  const { category, page } = useParams();
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page) || 1);
  const [isTotalPage, setIsTotalPage] = useState(null);
  const [isHot, setIsHot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataList = async () => {
      try {
        const response = await ListAllMangaFilterCategory(
          category,
          currentPage
        );
        setDataList(response.data);
        setIsTotalPage(response.total_page);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataList();
  }, [category, currentPage]);

  //   format views
  const formatViews = (views) => {
    if (views < 1000) {
      return views;
    } else if (views < 1000000) {
      return (views / 1000).toFixed(1) + "K";
    } else if (views < 1000000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else {
      return (views / 1000000000).toFixed(1) + "B";
    }
  };
  // format rate
  const formatRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const stars = Array(fullStars).fill("★");
    if (hasHalfStar) {
      stars.push("☆");
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push("☆");
    }
    return stars.join(" ");
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <div className="main_content">
        <div className="filter_category">
          <h2>
            <span className="line_text_category">
              <i className="icon_flag">
                <FaFlag />
              </i>
              Truyện {category}
            </span>
          </h2>
          <div className="manga_suggest">
            <ul className="grid-container">
              {dataList.map((item) => {
                //   format date
                const timeNews = new Date(item.time);
                const currentTime = new Date();
                const timeDifference = currentTime - timeNews;
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                let timeAgo = "";
                if (hours <= 12) {
                  setIsHot(true);
                  if (hours > 0) {
                    timeAgo += `${hours} hours `;
                  }

                  if (timeAgo === "") {
                    timeAgo = "Just now"; // Nếu không có giá trị nào (nghĩa là thời gian rất gần)
                  }
                }

                return (
                  <>
                    <li className="grid-item" key={item.id_manga}>
                      <div className="book_avatar">
                        <a href={item.id_manga} title={item.title}>
                          <img src={item.poster} alt={item.title} />
                        </a>
                      </div>
                      {isHot && (
                        <div className="top-notice">
                          <span className="time-ago">{timeAgo}</span>
                          <span className="type-label hot">Hot</span>
                        </div>
                      )}
                      <div className="book_info">
                        <div className="book_name">
                          <h3 itemProp="name">
                            <a href={item.id_manga} title={item.title}>
                              {item.title.length > 30
                                ? `${item.title.substring(0, 30)}...`
                                : item.title}
                            </a>
                          </h3>
                        </div>
                        <div className="infor-manga">
                          <p className="category">
                            {item.categories.length > 30
                              ? `${item.categories.substring(0, 30)}...`
                              : item.categories}
                          </p>
                          <p className="author">
                            Tác giả: {item.author ? `${item.author}` : "Null"}
                          </p>
                          <p className="rate">{formatRating(item.rate)}</p>
                          <p className="views">
                            {formatViews(item.views)} views
                          </p>
                        </div>
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {/* Button */}
      <div className="pagination">
        <Pagination
          defaultCurrent={1}
          currentPage={currentPage}
          total={isTotalPage * 10}
          showSizeChanger={false}
          onChange={handlePaginationChange}
        />
      </div>
    </Container>
  );
};

export default FilterCategory;
