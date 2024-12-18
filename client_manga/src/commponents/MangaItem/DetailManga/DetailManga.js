import React, { useEffect, useState } from "react";
import "./index.scss";
import { Container } from "react-bootstrap";
import { Breadcrumb, message } from "antd";
import { useDebounce } from "../../../utils/useDebounce";
import { useOutletContext, useParams } from "react-router-dom";
import { changeidManga } from "../../../utils/extend";
import {
  CreateComment,
  FetchDetailManga,
  GetAllComments,
} from "../../../services/api";
import Loading from "../../Loading/Loading";
import avatar from "../../../assets/avatar_error.jpg";
import MangaInfo from "./MangaInfo/MangaInfo";

const DetailManga = () => {
  const { namePath } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isManga, setIsManga] = useState([]);
  const [comment, setComment] = useState("");
  const [listComments, setListComments] = useState([]);
  const [isShow, setIsShow] = useState(false);

  const [loading, setLoading] = useState(true);
  const debouncedComment = useDebounce(comment, 500);
  const { isLight } = useOutletContext();
  const lightOrDarkClass =
    isLight !== undefined ? (isLight ? "" : "dark") : "dark";
  const maxLength = 1000;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const handleCommentChange = (e) => {
    const value = e.target.value;

    if (value.length <= maxLength) {
      setComment(value);
    }
  };
  // api
  useEffect(() => {
    const mangaId = changeidManga(namePath);
    fetchDetailManga(mangaId);
    fetchComments(mangaId);
  }, []);

  const fetchDetailManga = async (mangaId) => {
    setLoading(true);
    try {
      const response = await FetchDetailManga(mangaId);
      if (response.status === 200) {
        setIsManga(response.manga_info);
        setLoading(false);
      } else {
        console.error(response.errMsg || "Error fetching manga details");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const fetchComments = async (mangaId) => {
    try {
      const response = await GetAllComments(mangaId);
      if (response.status === 200) {
        setListComments(response.data);
      } else {
        console.error(response.errMsg || "Error fetching comments");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCommentSubmit = async () => {
    const mangaId = changeidManga(namePath);

    if (!debouncedComment.trim()) return;
    try {
      const response = await CreateComment(mangaId, debouncedComment);
      console.log("res", response);

      if (response.status === 200) {
        setListComments((prevComments) => [response.data, ...prevComments]);
        message.success(response.message);
        setComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleShowModal = (id) => {
    setIsShow(isShow === id ? null : id);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          {/* detail truyen */}
          <div className={`books_detail ${lightOrDarkClass}`}>
            <div className={`breadcrumb ${lightOrDarkClass}`}>
              <Breadcrumb
                items={[
                  {
                    title: "Home",
                  },
                  {
                    title: <a href="">{isManga.title}</a>,
                  },
                ]}
              />
            </div>
            <div className={`content_book ${lightOrDarkClass}`}>
              <MangaInfo
                isManga={isManga}
                handleShowModal={handleShowModal}
                listComments={listComments}
                toggleDescription={toggleDescription}
                maxLength={maxLength}
                isExpanded={isExpanded}
                comment={comment}
                avatar={avatar}
                isShow={isShow}
                handleCommentChange={handleCommentChange}
                handleKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default DetailManga;
