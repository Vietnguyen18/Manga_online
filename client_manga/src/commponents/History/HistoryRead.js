import React, { useEffect, useState } from "react";
import "./HistoryRead.scss";
import { Container } from "react-bootstrap";
import { FaFlag } from "react-icons/fa";
import { message } from "antd";
import { ListHistoryRead } from "../../services/api";

const HistoryRead = () => {
  const [dataList, setDataList] = useState([]);

  const id_user = localStorage.getItem("id_user");

  useEffect(() => {
    const fetchHistoryRead = async () => {
      try {
        const response = await ListHistoryRead(id_user);
        setDataList(response.data);
      } catch (er) {
        message.error("Failed to fetch history. Please try again later.");
      }
    };
    if (id_user) {
      fetchHistoryRead();
    }
  }, [id_user]);

  return (
    <Container>
      <div className="main_content">
        <div className="history_suggest">
          <h2>
            <span className="line_history">
              <i className="icon_flag">
                <FaFlag />
              </i>
              Lịch Sử
            </span>
          </h2>
          <div className="manga_suggest">
            {id_user ? (
              dataList && dataList.length > 0 ? (
                <ul className="grid-container">
                  {dataList.map((item) => (
                    <li className="grid-item" key={item.id_manga}>
                      <div className="book_avatar">
                        <a href={item.link_manga} title={item.title_manga}>
                          <img src={item.poster} alt={item.title_manga} />
                        </a>
                      </div>
                      <div className="book_info">
                        <div className="book_name">
                          <h3 itemProp="name">
                            <a href={item.link_manga} title={item.title_manga}>
                              {item.title_manga
                                ? `${item.title_manga.substring(0, 30)}${
                                    item.title_manga.length > 30 ? "..." : ""
                                  }`
                                : item.title_manga}
                            </a>
                          </h3>
                        </div>
                        <div className="infor_manga">
                          <p className="chapter">{item.chapter}</p>
                          <p className="type">{item.type}</p>
                          <p className="time">{item.readAt}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có dữ liệu để hiển thị</p>
              )
            ) : (
              <div className="notification">
                Bạn cần đăng nhập để xem được mục này
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HistoryRead;
