import axios from "axios";
// Create Axios instance
const instance = axios.create({
  baseURL: "http://127.0.0.1:7979",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

// Handle token refresh
const handleRefreshToken = async (userId) => {
  try {
    const res = await instance.post(`/refresh_token/${userId}`);
    // console.log('res data refresh token',res);
    if (res && res.data) {
      const access_token = res.data.access_token;
      localStorage.setItem("refresh_token", access_token);
      return access_token;
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed", error);
    return null;
  }
};

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    // Log config before request is sent
    // console.log("config", config);
    return config;
  },
  function (error) {
    // Handle request error
    return Promise.reject(error);
  }
);

const NO_RETRY_HEADER = "x-no-retry";

// Response interceptor
instance.interceptors.response.use(
  function (response) {
    // Return response if successful
    return response;
  },
  async function (error) {
    const originalConfig = error.config;
    const userId = localStorage.getItem("id_user");

    // Handle 401 errors (Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken(userId);
      if (access_token) {
        originalConfig.headers[NO_RETRY_HEADER] = "true";
        originalConfig.headers["Authorization"] = `Bearer ${access_token}`;
        return instance.request(originalConfig);
      }
    }

    // Redirect to login on 400 error during refresh
    if (
      error.response &&
      error.response.status === 400 &&
      originalConfig.url === `/refresh_token/${userId}`
    ) {
      window.location.href = "./login";
    }

    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default instance;
