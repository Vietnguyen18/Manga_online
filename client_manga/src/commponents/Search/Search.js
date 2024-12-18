import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { FaFlag, FaRegCircle } from "react-icons/fa";
import { PiCheckFatFill } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import { ListAllCategory } from "../../services/api";
import "./Search.scss";
import { number_chapter, sort, status_manga } from "../../constants/extend";

const Search = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [arrangeFilter, setArrangeFilter] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await ListAllCategory();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (index, isChecked) => {
    setSelectedCategories((prev) =>
      isChecked
        ? [...prev, categories[index].category_name]
        : prev.filter((cat) => cat !== categories[index].category_name)
    );
  };

  // Handle search action
  const handleSearch = () => {
    const searchParams = {
      categories: selectedCategories,
      status: statusFilter,
      arrange: arrangeFilter,
    };
    console.log("Search Params:", searchParams);

    // Call API with searchParams
    // Example: await fetchSearchResults(searchParams);
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
                    <div className="label_search">Status</div>
                    <div className="value_search">
                      <select
                        className="box_value"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">Select</option>
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
                        <option value="">Select</option>
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
          <div className="content_manga">content</div>
        </div>
      </Container>
    </>
  );
};

export default Search;
