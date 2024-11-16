import React, { useEffect, useState } from "react";
import "./Modalcate.scss";
import { Container } from "react-bootstrap";
import { ListAllCategory } from "../../../services/api";
import { list_rank } from "../../../constants/extend";
const ModalCategory = (props) => {
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
  }, []);
  console.log(dataList);

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
                <a href="#" title={e.decription} key={index}>
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
