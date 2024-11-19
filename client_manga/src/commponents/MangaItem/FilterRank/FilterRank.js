import "./FilterRank.scss";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { FaFlag } from "react-icons/fa";
import { Pagination } from "antd";
import {
  ListCommingSoon,
  ListRankMonth,
  ListRankWeek,
  ListRankYear,
} from "../../../services/api";

const FilterRank = () => {
  const { rank, page } = useParams();
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(page) || 1);
  const [isTotalPage, setIsTotalPage] = useState(null);
  const [isHot, setIsHot] = useState(false);
  const navigate = useNavigate();

  console.log(dataList);
  //   format views
  useEffect(() => {
    const fetchListData = async () => {
      try {
        let response;

        if (rank === "Top Tuần") {
          response = await ListRankWeek(currentPage);
        } else if (rank === "Top Tháng") {
          response = await ListRankMonth(currentPage);
        } else if (rank === "Top Năm") {
          response = await ListRankYear(currentPage);
        } else {
          response = await ListCommingSoon(currentPage);
        }

        setDataList(response.data);
        setIsTotalPage(response.total_page);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchListData();
  }, [rank, currentPage]);

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
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Container>
        <div className="main_content">
          <div className="filter_rank">
            <h2>
              <span className="line_text_rank">
                <i className="icon_flag">
                  <FaFlag />
                </i>
                Truyện {rank}
              </span>
            </h2>
            <div className="manga_suggest">
              <ul className="grid-container">
                {dataList.length >= 0 &&
                  dataList.map((item, index) => (
                    <>
                      <li className="grid-item">
                        <div className="book_avatar">
                          <a href={item.title_manga} title={item.title_manga}>
                            <img
                              src={item.image_poster_link_goc}
                              alt={item.title_manga}
                            />
                          </a>
                        </div>
                        <div className="book_info">
                          <div className="book_name">
                            <h3 itemProp="name">
                              <a
                                href={item.title_manga}
                                title={item.title_manga}
                              >
                                {item.title_manga.length > 30
                                  ? `${item.title_manga.substring(0, 30)}...`
                                  : item.title_manga}
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
                            <p className="views">
                              {formatViews(item.views)} views
                            </p>
                          </div>
                        </div>
                      </li>
                    </>
                  ))}
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
    </>
  );
};

export default FilterRank;
