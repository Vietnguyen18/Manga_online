import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListAllMangaFilterCategory } from "../../../services/api";
import { Container } from "react-bootstrap";
import { CiStar } from "react-icons/ci";
import "./FilterCate.scss";
import { FaFlag } from "react-icons/fa";
import { Pagination } from "antd";
import { formatRating, formatViews, makeLink } from "../../../utils/extend";

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

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  const handleNavigate = (name_path) => {
    navigate(`/truyen-tranh/${name_path}`);
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
              {category} Comics
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
                    <li
                      className="grid-item"
                      key={item.id_manga}
                      onClick={() => handleNavigate(item.name_path)}
                    >
                      <div className="book_avatar">
                        <a
                          href={makeLink("truyen-tranh", item.name_path)}
                          title={item.title}
                        >
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
                            <a
                              href={makeLink("truyen-tranh", item.name_path)}
                              title={item.title}
                            >
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
