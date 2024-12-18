import React, { useEffect, useState } from "react";
import "./HistoryRead.scss";
import { Container } from "react-bootstrap";
import { FaFlag } from "react-icons/fa";
import { message } from "antd";
import { DeleteHistoryRead, ListHistoryRead } from "../../services/api";
import {
  changeidManga,
  formatTimeDifference,
  makeLink,
  makeLinkChapter,
} from "../../utils/extend";

const HistoryRead = () => {
  const [dataList, setDataList] = useState([]);

  const id_user = localStorage.getItem("id_user");

  useEffect(() => {
    const fetchHistoryRead = async () => {
      try {
        const response = await ListHistoryRead(id_user);
        setDataList(response.list_all_history);
      } catch (er) {
        message.error("Failed to fetch history. Please try again later.");
      }
    };
    if (id_user) {
      fetchHistoryRead();
    }
  }, [id_user]);

  const handleRemoveItem = async (id) => {
    try {
      const itemToRemove = dataList.find((item) => item.id_manga === id);
      console.log(itemToRemove);

      if (!itemToRemove) {
        console.error("Item not found");
        message.error("Item not found.");
        return;
      }

      const formData = new FormData();
      formData.append("id_manga", itemToRemove.id_manga);
      formData.append("id_chapter", itemToRemove.chapter);

      if (id_user) {
        const response = await DeleteHistoryRead(id_user, formData);
        console.log(response);

        if (response.status === 200) {
          const updatedList = dataList.filter((item) => item.id_manga !== id);
          setDataList(updatedList);
          message.success(response.message);
        } else {
          console.error("Failed to delete history:", response.message);
          message.error("Failed to delete history.");
        }
      }
    } catch (er) {
      console.error("Error: ", er);
      message.error("Failed to delete history.");
    }
  };

  return (
    <Container>
      <div className="main_content">
        <div className="history_suggest">
          <h2>
            <span className="line_history">
              <i className="icon_flag">
                <FaFlag />
              </i>
              History
            </span>
          </h2>
          <div className="manga_suggest">
            {id_user ? (
              dataList && dataList.length > 0 ? (
                <ul className="grid-container">
                  {dataList.map((item) => (
                    <li className="grid-item" key={item.id_manga}>
                      <div className="book_avatar">
                        <a
                          href={makeLinkChapter(
                            "truyen-tranh",
                            item.namePath,
                            item.chapter
                          )}
                          title={item.title_manga}
                        >
                          <img src={item.poster} alt={item.title_manga} />
                        </a>
                        <span
                          className="remove-icon"
                          onClick={() => handleRemoveItem(item.id_manga)}
                        >
                          &times;
                        </span>
                        <span className="read-time">
                          {formatTimeDifference(item.readAt)}
                        </span>
                      </div>
                      <div className="book_info">
                        <div className="book_name">
                          <h3 itemProp="name">
                            <a
                              href={makeLinkChapter(
                                "truyen-tranh",
                                item.namePath,
                                item.chapter
                              )}
                              title={item.title_manga}
                            >
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="notifi_data">There is no data to display</p>
              )
            ) : (
              <div className="notification">
                You need to log in to view this item
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HistoryRead;
