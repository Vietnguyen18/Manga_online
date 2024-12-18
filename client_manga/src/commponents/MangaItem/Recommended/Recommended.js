import React, { useEffect, useState } from "react";
import "./Recommended.scss";
import { Container } from "react-bootstrap";
import { ListRecommendedComics } from "../../../services/api";
import { Pagination } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdCloudDownload } from "react-icons/io";
import { makeLink } from "../../../utils/extend";

const Recommended = () => {
  const [listDataRecommend, setListDataRecommend] = useState([]);
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState(parseInt(page) || 2);
  const [isTotalPage, setIsTotalPage] = useState(null);
  const navigate = useNavigate();
  console.log(currentPage);

  useEffect(() => {
    const fetchListRecommended = async () => {
      const req = await ListRecommendedComics(currentPage);
      setListDataRecommend(req.data);
      setIsTotalPage(req.total_page);
      console.log(req.data);
    };
    fetchListRecommended();
  }, [currentPage]);
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    navigate(`/truyen-moi-cap-nhat/trang-${page}`);
  };

  const handleNavigate = (name_path) => {
    navigate(`/truyen-tranh/${name_path}`);
  };
  return (
    <Container>
      {/* Recommended Comics */}
      <div className="main_content">
        <div className="recommended_comics">
          <h2>
            <span className="text_List_Recommended">
              <i className="icon_recommended">
                <IoMdCloudDownload />
              </i>
              Newly released comic
            </span>
          </h2>
          <div className="manga_suggest">
            <ul className="grid-container">
              {listDataRecommend &&
                listDataRecommend.map((e, index) => {
                  // Chuyển chuỗi thành đối tượng Date
                  const timeNews = new Date(e.time_release);

                  // Lấy thời gian hiện tại
                  const currentTime = new Date();

                  // Tính khoảng cách thời gian (milisecond)
                  const timeDifference = currentTime - timeNews;

                  // Chuyển đổi sang các đơn vị
                  const hours = Math.floor(timeDifference / (1000 * 60 * 60));

                  let timeAgo = "";
                  if (hours > 0) {
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
                        onClick={() => handleNavigate(e.name_path)}
                      >
                        <div className="book_avatar">
                          <a
                            href={makeLink("truyen-tranh", e.name_path)}
                            title={e.title_manga}
                          >
                            <img
                              src={e.image_poster_link_goc}
                              alt={e.title_manga}
                            />
                          </a>
                        </div>
                        <div className="top-notice">
                          <span className="time-ago">{timeAgo}</span>
                          <span className="type-label hot">Hot</span>
                        </div>
                        <div className="book_info">
                          <div className="book_name">
                            <h3 itemProp="name">
                              <a href={e.url_manga} title={e.title_manga}>
                                {e.title_manga.length > 30
                                  ? `${e.title_manga.substring(0, 30)}...`
                                  : e.title_manga}
                              </a>
                            </h3>
                          </div>
                          <div className="chapter">
                            <a href={e.url_manga} title={e.chapter_new}>
                              {e.chapter_new}
                            </a>
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
          defaultCurrent={2}
          currentPage={currentPage}
          total={isTotalPage * 10}
          showSizeChanger={false}
          onChange={handlePaginationChange}
        />
      </div>
    </Container>
  );
};

export default Recommended;
