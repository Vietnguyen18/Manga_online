import React from "react";
import "./HistoryRead.scss";
import { useSelector } from "react-redux";
const HistoryRead = () => {
  const user = useSelector((state) => state.account.Users);

  return <div>HistoryRead</div>;
};

export default HistoryRead;
