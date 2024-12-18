import React, { useState } from "react";
import {
  formatRating,
  formatTimeDifference,
  formatViews,
  getMangaIdgetShortenedUrl,
  makeLinkChapter,
} from "../../../../utils/extend";
import {
  FaComment,
  FaDatabase,
  FaEye,
  FaHeart,
  FaInfoCircle,
  FaPlus,
  FaRssSquare,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import "./MangaInfo.scss";
import { useNavigate } from "react-router-dom";
import CommentItem from "../CommentItem/CommentItem";

const MangaInfo = ({
  isManga,
  listComments,
  toggleDescription,
  maxLength,
  isExpanded,
  comment,
  avatar,
  handleCommentChange,
  handleKeyDown,
}) => {
  const navigate = useNavigate();
  const [isShowRely, setIsShowReply] = useState(false);

  const handleReadsBook = () => {
    const namePath = isManga.name_path;
    const firstChapter = isManga.chapters[0].id_chapter;
    navigate(`/truyen-tranh/${namePath}/${firstChapter}`);
  };
  const handleGoToChapter = (chapterId) => {
    const namePath = isManga.name_path;
    navigate(`/truyen-tranh/${namePath}/${chapterId}`);
  };
  return (
    <>
      <div className="book_info">
        <div className="book_avatar">
          <img src={isManga.poster} alt={isManga.title} />
        </div>
        <div className="book_other">
          <h1>{isManga.title || "Updating..."}</h1>
          <div className="text_info">
            <ul className="list_info">
              <li className="other_name">
                <p className="name_book">
                  <i>
                    <FaPlus />
                  </i>
                  Alternative Name
                </p>
                <p className="text-name">{isManga.title || "Updating..."}</p>
              </li>
              <li className="other_name">
                <p className="name_book">
                  <i>
                    <FaUser />
                  </i>
                  Author
                </p>
                <p className="text-name">
                  {isManga.author || "Author not available"}
                </p>
              </li>
              <li className="other_name">
                <p className="name_book">
                  <i>
                    <FaRssSquare />
                  </i>
                  Status
                </p>
                <p className="text-name">
                  {isManga.status || "Status unknown"}
                </p>
              </li>
              <li className="other_name">
                <p className="name_book">
                  <i>
                    <FaHeart />
                  </i>
                  Genre
                </p>
                <p className="text-name">
                  {isManga.genres || "Genre not specified"}
                </p>
              </li>
              <li className="other_name">
                <p className="name_book">
                  <i>
                    <FaStar />
                  </i>
                  Rating
                </p>
                <p className="text-name">
                  {formatRating(isManga.rate) || "No ratings available"}
                </p>
              </li>
              <li className="other_name">
                <p className="name_book">
                  <i>
                    <FaEye />
                  </i>
                  Views
                </p>
                <p className="text-name">{formatViews(isManga.views) || "0"}</p>
              </li>
            </ul>
          </div>
          <div className="list_category">
            <p className="cate-item">{isManga.categories}</p>
          </div>
          <div className="story_detail_menu">
            <ul className="menu_story">
              <li>
                <a
                  href=""
                  title=""
                  className="button_active read_all"
                  onClick={() => handleReadsBook()}
                >
                  Read From The Beginning
                </a>
              </li>
              <li>
                <a href="" title="" className="button_active follow">
                  Follow
                </a>
              </li>
              <li>
                <a href="" title="" className="button_active like">
                  Like
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* gioi thieu */}
      <h3 className="text_introduce">
        <i>
          <FaInfoCircle />
        </i>
        Description
      </h3>
      <div className="detail_content">
        <p className={isExpanded ? "" : "shortened"}>
          {isManga.description || "No description available for this manga."}
        </p>
        <button onClick={toggleDescription} className="toggle-button">
          {isExpanded ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
      {/* danh sach chuong */}
      <h3 className="text_introduce">
        <i>
          <FaDatabase />
        </i>
        List Chapter Manga
      </h3>
      <div className="list_chapter">
        {isManga.chapters && isManga.chapters.length > 0 ? (
          isManga.chapters.map((chapter, index) => (
            <div key={index} className="works_chapter_item">
              <div className="name_chapter">
                <a
                  href={makeLinkChapter(
                    "truyen-tranh",
                    isManga.name_path,
                    chapter.id_chapter
                  )}
                  title={chapter.id_chapter || "Chapter data unavailable"}
                  onClick={() => handleGoToChapter(chapter.id_chapter)}
                >
                  {chapter.id_chapter || "No data available"}
                </a>
              </div>
              <span className="publication_date">
                {isManga.time_release || "Release date unknown"}
              </span>
            </div>
          ))
        ) : (
          <div>No chapters available.</div>
        )}
      </div>
      {/* comment */}
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
    </>
  );
};

export default MangaInfo;
