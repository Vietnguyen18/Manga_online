import instance from "../utils/axios";
const token = localStorage.getItem("access_token");
console.log("token", token);

// api token
export const callRefeshToken = () => {
  return instance.post("/refresh_token");
};

export const fetchAccount = async () => {
  const req = await instance.get("/user/list_all_user");
  return req.data;
};

export const fetchUser = async (idUser) => {
  const response = await instance.get(`/user/${idUser}`);
  return response;
};

// api login
export const callLogin = async (email, password) => {
  const response = await instance.post(`/login`, {
    email: email,
    password: password,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

// api register
export const callRegister = async (username, email, password) => {
  const response = await instance.post(`/register`, {
    username: username,
    email: email,
    password: password,
  });
  return response.data;
};

// api logout
export const callLogout = () => {
  return instance.post(`/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// api list category
export const ListAllCategory = async () => {
  const req = await instance.get("/manga/get_all_category");
  return req.data;
};

// api get all manga new
export const ListAllMangaNew = async (page) => {
  const response = await instance.get(
    `/news/new_release_comics/1/manga?page=${page}`
  );
  return response.data;
};
// api get Recommended Comics
export const ListRecommendedComics = async (page) => {
  const response = await instance.get(
    `/recommended_comics/1/manga?page=${page}`
  );
  return response.data;
};

// api get list filter category
export const ListAllMangaFilterCategory = async (category, page) => {
  const response = await instance.get(
    `/manga/list_manga_by_category/1?name_category=${category}&page=${page}`
  );
  return response.data;
};

// api get list rank
// Comming Soon Comics
export const ListCommingSoon = async (page) => {
  const response = await instance.get(
    `/cooming_soon_comics/1/manga?page=${page}`
  );
  return response.data;
};
// week
export const ListRankWeek = async (page) => {
  const response = await instance.get(`/rank_manga_week/1/manga?page=${page}`);
  return response.data;
};
// month
export const ListRankMonth = async (page) => {
  const response = await instance.get(`/rank_manga_month/1/manga?page=${page}`);
  return response.data;
};
// year
export const ListRankYear = async (page) => {
  const response = await instance.get(`/rank_manga_year/1/manga?page=${page}`);
  return response.data;
};

// history read
export const ListHistoryRead = async (idUser) => {
  const response = await instance.get(`/user/activity_history/${idUser}`);
  return response;
};
// api user new register
export const ListUsersNew = async () => {
  const response = await instance.get("/user/count_user_regitser");
  return response;
};
// api views manga
export const ViewsManga = async () => {
  const response = await instance.get("/manga/total_views");
  return response;
};

// api filter manga
export const FilterManga = async (search, page) => {
  const response = await instance.get(
    `http://127.0.0.1:7979/manga/filter_manga/1?search=${search}&page=${page}`
  );
  return response.data;
};

// api card stats
export const CardStats = async () => {
  const response = await instance.get("/card_stats");
  return response;
};
