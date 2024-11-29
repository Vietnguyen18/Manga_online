import React, { useEffect, useState } from "react";
import { BiBook, BiStreetView, BiUser } from "react-icons/bi";
import { FaEye, FaRegCommentDots } from "react-icons/fa";
import "../dashboard.scss";
import { CardStats } from "../../../../../../services/api";
const Information = () => {
  const [cardStats, setCardStats] = useState("");
  console.log("card", cardStats);

  useEffect(() => {
    fetchCardStats();
  }, []);

  const fetchCardStats = async () => {
    const response = await CardStats();
    setCardStats(response.data);
  };

  return (
    <div className="content-dashboard">
      <div className="information">
        <div className="box-info">
          <div className="line-info">
            <h5>New Users</h5>
            <span>{cardStats.total_users}</span>
          </div>
          <i className="icon-user">
            <BiUser />
          </i>
        </div>
      </div>
      <div className="information">
        <div className="box-info">
          <div className="line-info">
            <h5>Books</h5>
            <span>{cardStats.total_listmanga}</span>
          </div>
          <i className="icon-user">
            <BiBook />
          </i>
        </div>
      </div>
      <div className="information">
        <div className="box-info">
          <div className="line-info">
            <h5>Views Manga</h5>
            <span>{cardStats.total_views}</span>
          </div>
          <i className="icon-user">
            <FaEye />
          </i>
        </div>
      </div>
      <div className="information">
        <div className="box-info">
          <div className="line-info">
            <h5>Comments</h5>
            <span>{cardStats.total_comments}</span>
          </div>
          <i className="icon-user">
            <FaRegCommentDots />
          </i>
        </div>
      </div>
    </div>
  );
};

export default Information;
