import React, { useState, useEffect, useCallback } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import "./ReadManga.scss";
import { Breadcrumb, message } from "antd";
import { FaComment, FaInfoCircle, FaThumbsUp } from "react-icons/fa";
import {
  CreateCommentChapter,
  GetAllChapters,
  GetAllComments,
  GetCommentsChapter,
  GetContentChapter,
  SaveHistoryRead,
} from "../../../../services/api";
import { changeidManga, formatTimeDifference } from "../../../../utils/extend";
import Loading from "../../../Loading/Loading";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { useDebounce } from "../../../../utils/useDebounce";
import avatar from "../../../../assets/avatar_error.jpg";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import CommentItem from "../CommentItem/CommentItem";
import { useSelector } from "react-redux";

const ReadManga = () => {
  const { namePath, chapterId } = useParams();
  const navigate = useNavigate();
  const datauser = useSelector((state) => state.account.dataUser);
  const { isLight } = useOutletContext();
  const lightOrDarkClass =
    isLight !== undefined ? (isLight ? "" : "dark") : "dark";

  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null);
  const [chapterContent, setChapterContent] = useState({
    image_chapter: [],
  });

  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const [comment, setComment] = useState("");
  const debouncedComment = useDebounce(comment, 500);
  const [listComments, setListComments] = useState([]);

  const [isShow, setIsShow] = useState(false);
  const [isShowRely, setIsShowReply] = useState(false);

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

  // api list chapter
  useEffect(() => {
    const id_manga = changeidManga(namePath);
    fetchChapters(id_manga);
    fetchComments(id_manga);
  }, [namePath]);

  const fetchChapters = async (id_manga) => {
    try {
      const data = await GetAllChapters(id_manga);
      setChapters(data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };
  // api list comment chapter
  const fetchComments = async (id_manga) => {
    try {
      const response = await GetCommentsChapter(id_manga, chapterId);
      if (response.status === 200) {
        setListComments(response.data);
      } else {
        console.error(response.errMsg || "Error fetching comments");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // api content chapter

  useEffect(() => {
    const id_manga = changeidManga(namePath);
    if (chapters.length > 0) {
      const fetchChapterContent = async () => {
        setLoading(true);
        try {
          const currentChapter = chapters[currentChapterIndex];
          const response = await GetContentChapter(
            id_manga,
            currentChapter.id_chapter
          );
          setChapterContent(response.data);
          setLoading(false);
          navigate(`/truyen-tranh/${namePath}/${currentChapter.id_chapter}`);
        } catch (error) {
          console.error("Error fetching chapter content:", error);
          setLoading(false);
        }
      };
      fetchChapterContent();
    }
  }, [currentChapterIndex, chapters, namePath]);

  const updateChapterIndex = useCallback(() => {
    if (chapterId && chapters.length > 0) {
      const chapter = chapters.find(
        (chapter) => chapter.id_chapter === chapterId
      );
      if (chapter) {
        const index = chapters.indexOf(chapter);
        setCurrentChapterIndex(index); // Cập nhật chỉ khi chapterId khớp
      }
    }
  }, [chapterId, chapters]);

  useEffect(() => {
    updateChapterIndex(); // Gọi hàm khi chapterId hoặc chapters thay đổi
  }, [updateChapterIndex]);

  // chapter transfer
  const nextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else {
      alert("This is the last chapter.");
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    } else {
      alert("This is the first chapter.");
    }
  };

  // comment
  const handleCommentSubmit = async () => {
    if (!debouncedComment.trim()) return;
    const id_manga = changeidManga(namePath);
    try {
      const response = await CreateCommentChapter(
        id_manga,
        chapterId,
        debouncedComment
      );
      if (response.status === 200) {
        setListComments((prevComments) => [response.data, ...prevComments]);
        message.success(response.message);
        setComment("");
      } else {
        message.error(response.errMsg);
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
    setIsShow(!isShow);
  };
  const showRepliedComment = () => {
    setIsShowReply(!isShowRely);
  };
  // api save history read manga
  useEffect(() => {
    const id_manga = changeidManga(namePath);

    const fetchSaveHistoryRead = async () => {
      try {
        if (datauser?.id_user) {
          const id_user = datauser?.id_user;
          const formData = new FormData();
          formData.append("id_manga", id_manga);
          formData.append("id_chapter", chapterId);
          const response = await SaveHistoryRead(id_user, formData);

          if (response.status === 200) {
            console.log("History saved:", response.message);
          } else {
            console.error("Failed to save history:", response.message);
            message.error("Failed to save history.");
          }
        }
      } catch (er) {
        console.error("Error: ", er);
        message.error("Failed to save history.");
      }
    };

    if (datauser?.id_user && namePath) {
      const timer = setTimeout(() => {
        fetchSaveHistoryRead();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [datauser, namePath, chapterId]);

  return (
    <>
      <Container>
        {/* top */}
        <div className={`box_top ${lightOrDarkClass}`}>
          <div className={`breadcrumb_read ${lightOrDarkClass}`}>
            <Breadcrumb
              items={[
                { title: "Home" },
                {
                  title: (
                    <a href={`/truyen-tranh/${namePath}`}>
                      {chapterContent.title}
                    </a>
                  ),
                },
                {
                  title: (
                    <a
                      href={`/truyen-tranh/${namePath}/${chapterContent.chapter_name}`}
                    >
                      {chapterContent.chapter_name}
                    </a>
                  ),
                },
              ]}
            />
          </div>
          <div className={`content_read_book ${lightOrDarkClass}`}>
            <div className="detail-title">
              <h5>
                <a href="#" title="">
                  {chapterContent.title}-{chapterContent.chapter_name}
                </a>
              </h5>
              <span className="time_update">(Last updated: Time here)</span>
            </div>
            <div className="alert_info">
              <i>
                <FaInfoCircle />
              </i>
              <span>
                Use the left (←) or right (→) arrow to change chapters
              </span>
            </div>
            <div className="btn_change_chapter">
              <button
                onClick={prevChapter}
                disabled={currentChapterIndex === 0}
              >
                <i>
                  <FaAnglesLeft />
                </i>{" "}
                Previous Chapter
              </button>
              <button
                onClick={nextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
              >
                Next Chapter{" "}
                <i>
                  <FaAnglesRight />
                </i>
              </button>
            </div>
          </div>
        </div>
        {/* center */}
        <div className="chapter_content">
          {loading ? (
            <Loading />
          ) : chapterContent.image_chapter.length > 0 ? (
            chapterContent.image_chapter.map((url, index) => (
              <div className="chapter_item" key={index}>
                <img
                  src={url}
                  alt={`${chapterContent.title}-${chapterContent.chapter_name}`}
                />
              </div>
            ))
          ) : (
            <p>No images available for this chapter.</p>
          )}
        </div>
        {/* bottom */}
        <div className={`box_bottom ${lightOrDarkClass}`}>
          <div className={`breadcrumb_read ${lightOrDarkClass}`}>
            <Breadcrumb
              items={[
                { title: "Home" },
                {
                  title: (
                    <a href={`/truyen-tranh/${namePath}`}>
                      {chapterContent.title}
                    </a>
                  ),
                },
                {
                  title: (
                    <a
                      href={`/truyen-tranh/${namePath}/${chapterContent.chapter_name}`}
                    >
                      {chapterContent.chapter_name}
                    </a>
                  ),
                },
              ]}
            />
          </div>
          <div className={`content_read_book ${lightOrDarkClass}`}>
            <div className="btn_change_chapter">
              <button
                onClick={prevChapter}
                disabled={currentChapterIndex === 0}
              >
                <i>
                  <FaAnglesLeft />
                </i>
                Previous Chapter
              </button>
              <button
                onClick={nextChapter}
                disabled={currentChapterIndex === chapters.length - 1}
              >
                Next Chapter
                <i>
                  <FaAnglesRight />
                </i>
              </button>
            </div>
          </div>
        </div>
        {/* comment */}
        <div className={`box_comment ${lightOrDarkClass}`}>
          <div className="comment_container">
            <span className="title_heading">Comments</span>
            <div className="notifi_page">
              Visit{" "}
              <a href="" title="">
                the page
              </a>{" "}
              to like and follow
            </div>
            <div className="comment_content">
              <textarea
                className="form_comment"
                rows="4"
                cols="50"
                placeholder="Or leave your comments"
                value={comment}
                onChange={handleCommentChange}
                onKeyDown={handleKeyDown}
              ></textarea>
              <div id="charCount">
                {maxLength - comment.length} characters remaining
              </div>
              <div className="list_comment">
                {listComments.map((item) => (
                  <CommentItem
                    key={item.id_comment}
                    comment={item}
                    avatar={avatar}
                    isShowReply={isShowRely}
                    setIsShowReply={setIsShowReply}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ReadManga;
