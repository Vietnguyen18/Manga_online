import React, { useEffect, useRef, useState } from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { formatTimeDifference } from "../../../../utils/extend";
import {
  ListComment,
  EditComment,
  DeleteComment,
} from "../../../../services/api";
import { message } from "antd";
import Swal from "sweetalert2";
import RepliesComment from "./RepliesComment/RepliesComment";

const CommentItem = ({ comment, avatar, isShowReply, setIsShowReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showBox, setShowBox] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const modalRef = useRef(null);
  const id_user = localStorage.getItem("id_user");

  const toggleReplies = () => setShowReplies(!showReplies);

  const showRepliedComment = (id) => {
    setIsShowReply(isShowReply === id ? null : id);
  };

  const handleLike = async (id) => {
    const response = await ListComment(id_user, id);

    if (response) {
      const newLikeStatus = !likeStatus;
      setLikeStatus(newLikeStatus);
      setLikeCount(newLikeStatus ? likeCount + 1 : likeCount - 1);
      localStorage.setItem(
        `likeStatus_${comment.id_comment}`,
        JSON.stringify(newLikeStatus)
      );
      message.success(response.message);
    } else {
      message.error(response.errMsg);
    }
  };

  const handleEditStart = () => {
    setEditMode(true);
    setEditContent(comment.content);
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    try {
      const response = await EditComment(comment.id_comment, editContent);
      if (response.status === 200) {
        comment.content = editContent;
        setEditMode(false);
        setEditContent("");
        message.success(response.message);
      } else {
        message.error(response.errMsg);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      message.error("Failed to update comment.");
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover comment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (rs) => {
      if (rs.isConfirmed) {
        try {
          const response = await DeleteComment(comment.id_comment);
          if (response.status === 200) {
            message.success(response.message);
          } else {
            message.error(response.errMsg);
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
          message.error("Failed to delete comment.");
        }
      }
    });
  };

  useEffect(() => {
    const savedLikeStatus = localStorage.getItem(
      `likeStatus_${comment.id_comment}`
    );

    if (savedLikeStatus) {
      const parsedLikeStatus = JSON.parse(savedLikeStatus);
      setLikeStatus(parsedLikeStatus);

      if (parsedLikeStatus) {
        setLikeCount(comment.likes + 1);
      } else {
        setLikeCount(comment.likes);
      }
    }
  }, [comment.id_comment, comment.likes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsShowReply(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsShowReply]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && editMode) {
      e.preventDefault();
      handleEditSubmit();
    }
  };

  const handleShowBoxComment = (id_comment) => {
    setShowBox(showBox === id_comment ? null : id_comment);
  };
  return (
    <div className="comment_item_wrapper">
      <div className="comment_item">
        <div className="avatar_user_comment">
          <img src={comment.avatar_user || avatar} alt="avatar user" />
        </div>
        <div className="box_comment">
          <h6 className="name_user">{comment.name_user || "Anonymous"}</h6>

          {editMode ? (
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleEditSubmit}
              className="box_text"
              autoFocus
              onKeyDown={handleKeyDown}
            />
          ) : (
            <p className="content_comment">
              {comment.content || "No content available"}
            </p>
          )}

          <i
            className="icon-btn"
            onClick={() => showRepliedComment(comment.id_comment)}
          >
            <HiDotsCircleHorizontal />
          </i>
          {isShowReply === comment.id_comment &&
          String(comment.id_user) === String(id_user) ? (
            <div ref={modalRef} className="modal-comment">
              <p onClick={handleEditStart}>Edit</p>
              <p onClick={handleDelete}>Delete</p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="action-comment">
        <span
          className={`action-like ${likeStatus ? "like" : ""}`}
          onClick={() => handleLike(comment.id_comment)}
        >
          <i>
            <FaThumbsUp />
          </i>
          <span className="number_like">{likeCount}</span>
        </span>
        <span
          className="action-reply-comment"
          onClick={() => handleShowBoxComment(comment.id_comment)}
        >
          <i>
            <FaComment />
          </i>
          <span className="number_replycomment">{comment.reply}</span>
        </span>

        <span className="time_comment">
          {formatTimeDifference(comment.time_comment)}
        </span>
        {comment.reply ? (
          <div className="rely_comment">
            <p onClick={toggleReplies}>{comment.reply} replies</p>
          </div>
        ) : null}
        {showBox === comment.id_comment && (
          <RepliesComment itemComment={comment} setShowBox={setShowBox} />
        )}
      </div>
      {showReplies && comment.replies_content?.length > 0 && (
        <div className="list_rely_comment">
          {comment.replies_content.map((reply) => (
            <CommentItem
              key={reply.id_comment}
              comment={reply}
              avatar={avatar}
              isShowReply={isShowReply}
              setIsShowReply={setIsShowReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
