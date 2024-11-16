import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { CiStar } from "react-icons/ci";
import "./Home.scss";
import { ListAllMangaNew, ListRecommendedComics } from "../../services/api";
import imageError from "../../assets/image_error.png";
import { IoCloudDownload } from "react-icons/io5";

const Home = () => {
  const [listDataNew, setListDataNew] = useState([]);
  const [listDataRecommend, setListDataRecommend] = useState([]);
  // random page
  let randomPage = Math.floor(Math.random() * 10) + 1;
  setInterval(() => {
    randomPage = Math.floor(Math.random() * 10) + 1;
  }, 3000000);
  console.log(randomPage);

  useEffect(() => {
    const fetchGetListMangaNew = async () => {
      const req = await ListAllMangaNew(randomPage);
      setListDataNew(req.data);
      console.log(req.data);
    };
    const fetchListRecommended = async () => {
      const req = await ListRecommendedComics(randomPage);
      setListDataRecommend(req.data);
      console.log(req.data);
    };
    fetchGetListMangaNew();
    fetchListRecommended();
  }, []);

  return (
    <Container>
      {/* Manga New */}
      <div className="main_content">
        <div className="new_manga">
          <h2>
            <span className="text_List_hot">
              <i className="icon_new">
                <CiStar />
              </i>
              Truyện Mới
            </span>
          </h2>
          <div className="manga_suggest">
            <ul className="grid-container">
              {listDataNew &&
                listDataNew.map((e, index) => {
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
                      <li className="grid-item">
                        <div className="book_avatar">
                          <a href={e.url_manga} title={e.url_manga}>
                            <img
                              src={e.image_poster_link_goc}
                              alt={e.title_manga}
                            />
                          </a>
                        </div>
                        <div className="top-notice">
                          <span className="time-ago">{timeAgo}</span>
                          <span className="type-label hot">New</span>
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
      {/* Recommended Comics */}
      <div className="main_content">
        <div className="recommended_comics">
          <h2>
            <span className="text_List_recommended">
              <i className="icon_recommende">
                <CiStar />
              </i>
              Truyện tranh mới phát hành
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
                      <li className="grid-item">
                        <div className="book_avatar">
                          <a href={e.url_manga} title={e.url_manga}>
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
      <div className="btnshowAll">
        <a href="/truyen-moi-cap-nhat/trang-2.html">Xem thêm truyện khác</a>
      </div>
    </Container>
  );
};

export default Home;
