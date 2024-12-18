import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { FaFlag, FaRegCircle } from "react-icons/fa";
import { PiCheckFatFill } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import { FilterMangaAdvanced, ListAllCategory } from "../../services/api";
import "./Search.scss";
import { number_chapter, sort, status_manga } from "../../constants/extend";
import { useNavigate } from "react-router-dom";
import {
  formatTimeDifference,
  formatViews,
  makeLink,
} from "../../utils/extend";
import { Pagination } from "antd";

const Search = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTotalPage, setIsTotalPage] = useState(null);
  const [arrangeFilter, setArrangeFilter] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [listManga, setListManga] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await ListAllCategory();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  const handleCategoryChange = (index, isChecked) => {
    setSelectedCategories((prev) =>
      isChecked
        ? [...prev, categories[index].category_name]
        : prev.filter((cat) => cat !== categories[index].category_name)
    );
  };

  const handleSearch = async () => {
    const formData = new FormData();

    if (selectedCategories.length > 0) {
      formData.append("categories", selectedCategories);
    }
    if (statusFilter) {
      formData.append("status_filter", statusFilter);
    }
    if (arrangeFilter) {
      formData.append("arrange_filter", arrangeFilter);
    }
    if (chapterFilter) {
      formData.append("chapter_filter", chapterFilter);
    }

    try {
      const response = await FilterMangaAdvanced(formData, currentPage);
      if (response.status === 200) {
        setListManga(response.data);
        setIsTotalPage(response.totalPage);
      }
    } catch (er) {
      console.log("error", er);
    }
  };

  const handleNavigate = (name_path) => {
    navigate(`/truyen-tranh/${name_path}`);
  };

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Container>
        <div className="main_content">
          <div className="home_page">
            <h2>
              <span className="text_heading">
                <i className="icon_flag">
                  <FaFlag />
                </i>
                Advanced search
              </span>
            </h2>
          </div>
          <div className="box_search">
            <div className="hidden_action">
              <button
                className="btn"
                onClick={() => setShowSearch(!showSearch)}
              >
                {showSearch ? "Hidden" : "Show"}
              </button>
            </div>
            {showSearch && (
              <div className="advsearch_form">
                <div className="instruct">
                  <p>
                    <i className="icon">
                      <PiCheckFatFill />
                    </i>
                    Search in these categories
                  </p>
                  <p>
                    <i className="icon">
                      <FaTimes />
                    </i>
                    Exclude these categories
                  </p>
                  <p>
                    <i className="icon" style={{ color: "#fff" }}>
                      <FaRegCircle />
                    </i>
                    Stories may or may not belong to this genre
                  </p>
                </div>
                <div className="action_reset">
                  <button
                    className="btn"
                    onClick={() => {
                      setSelectedCategories([]);
                      setChapterFilter("");
                      setStatusFilter("");
                      setArrangeFilter("");
                    }}
                  >
                    Reset
                  </button>
                </div>
                <div className="list_categories">
                  <h5>Comic Genres</h5>
                  <div className="categories_items">
                    {categories.map((category, index) => (
                      <div key={index} className="categories_item">
                        <input
                          type="checkbox"
                          id={`category-${index}`}
                          className="check_box"
                          onChange={(e) =>
                            handleCategoryChange(index, e.target.checked)
                          }
                        />
                        <label
                          className="name_category"
                          htmlFor={`category-${index}`}
                        >
                          {category.category_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sort_manga">
                  <div className="filter_manga">
                    <div className="label_search">Chapter number</div>
                    <div className="value_search">
                      <select
                        className="box_value"
                        value={chapterFilter}
                        onChange={(e) => setChapterFilter(e.target.value)}
                      >
                        <option value="">Select</option>
                        {number_chapter.map((chapter) => (
                          <option key={chapter.id} value={chapter.value}>
                            {`>= ${chapter.value}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="filter_manga">
                    <div className="label_search">Status</div>
                    <div className="value_search">
                      <select
                        className="box_value"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        {status_manga.map((status) => (
                          <option key={status.id} value={status.value}>
                            {status.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="filter_manga">
                    <div className="label_search">Arrange</div>
                    <div className="value_search">
                      <select
                        className="box_value"
                        value={arrangeFilter}
                        onChange={(e) => setArrangeFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        {sort.map((item) => (
                          <option key={item.id} value={item.value}>
                            {item.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="action_submit">
                  <button className="btn" onClick={handleSearch}>
                    Search
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="content_manga">
            <div className="manga_suggest">
              <ul className="grid-container">
                {listManga && listManga.length > 0 ? (
                  listManga.map((e, index) => {
                    return (
                      <>
                        <li
                          className="grid-item"
                          key={index}
                          onClick={() => handleNavigate(e.namePath)}
                        >
                          <div className="book_avatar">
                            <a
                              href={makeLink("truyen-tranh", e.namePath)}
                              title={e.title}
                            >
                              <img src={e.poster} alt={e.title} />
                            </a>
                          </div>
                          <div className="top-notice">
                            <span className="time-ago">
                              {formatTimeDifference(e.time_release)}
                            </span>
                          </div>
                          <div className="book_info">
                            <div className="book_name">
                              <h3 itemProp="name">
                                <a
                                  href={makeLink("truyen-tranh", e.namePath)}
                                  title={e.title}
                                >
                                  {e.title.length > 30
                                    ? `${e.title.substring(0, 30)}...`
                                    : e.title}
                                </a>
                              </h3>
                              <div className="infor_manga">
                                <p className="number_views">
                                  {formatViews(e.views_original)}
                                </p>
                                <p className="status">{e.status}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    );
                  })
                ) : (
                  <p className="notifi_data">
                    No results found for your search. Please try again with
                    different filters.
                  </p>
                )}
              </ul>
            </div>
            {/* Button */}
            {listManga.length > 0 && (
              <div className="pagination">
                <Pagination
                  defaultCurrent={1}
                  currentPage={currentPage}
                  total={isTotalPage * 10}
                  showSizeChanger={false}
                  onChange={handlePaginationChange}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Search;
