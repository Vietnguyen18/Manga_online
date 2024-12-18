import { message } from "antd";
import React, { useState } from "react";
import { useDebounce } from "../../../../../utils/useDebounce";
import { changeidManga } from "../../../../../utils/extend";
import { useParams } from "react-router-dom";
import { FetchRepliesComment } from "../../../../../services/api";

const RepliesComment = ({ itemComment, setShowBox }) => {
  const [repliesComment, setRepliesComment] = useState("");
  const debouncedComment = useDebounce(repliesComment, 500);

  const maxLength = 1000;

  const handleCommentChange = (e) => {
    const value = e.target.value;

    if (value.length <= maxLength) {
      setRepliesComment(value);
    }
  };

  const handleCommentSubmit = async () => {
    if (!debouncedComment.trim()) return;
    try {
      const response = await FetchRepliesComment(
        itemComment.id_comment,
        debouncedComment
      );
      console.log("res", response);

      if (response.status === 200) {
        message.success(response.message);
        setRepliesComment("");
        setShowBox(false);
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
  return (
    <>
      <div className="comment_content">
        <textarea
          className="form_comment"
          rows="4"
          cols="50"
          placeholder="Or leave your comments"
          value={repliesComment}
          onChange={handleCommentChange}
          onKeyDown={handleKeyDown}
        ></textarea>
      </div>
      <div id="charCount">
        {maxLength - repliesComment.length} characters remaining
      </div>
    </>
  );
};

export default RepliesComment;
