import React, { useEffect, useState } from "react";
import "./Modalcate.scss";
import { Container } from "react-bootstrap";
import { ListAllCategory } from "../../../services/api";
import { list_rank } from "../../../constants/extend";
import { useNavigate } from "react-router-dom";
import { makeTitle } from "../../../utils/extend";

const ModalCategory = (props) => {
  const navigate = useNavigate();
  const { onMouseEnter, onMouseLeave, type } = props;
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    if (type === "category") {
      const fetchDataList = async () => {
        const reponsive = await ListAllCategory();
        setDataList(reponsive);
      };
      fetchDataList();
    } else if (type === "rank") {
      setDataList(list_rank);
    }
  }, [type]);
  console.log(dataList);

  const handleCategorySelect = (category) => {
    navigate(`/the-loai/${category}`);
  };
  const handleRankSelect = (rank) => {
    navigate(`/xep-hang/${rank}`);
  };
  return (
    <div
      className="box"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Container>
        {/* category */}
        <div className="book_tags_content">
          {dataList &&
            dataList.map((e, index) => (
              <p>
                <a
                  href="#"
                  title={e.decription}
                  key={index}
                  onClick={() =>
                    type === "category"
                      ? handleCategorySelect(makeTitle(e.category_name))
                      : handleRankSelect(makeTitle(e.category_name))
                  }
                >
                  {e.category_name}
                </a>
              </p>
            ))}
        </div>
      </Container>
    </div>
  );
};

export default ModalCategory;
