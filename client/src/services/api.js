import axios from "axios";

// =====================================
// Axios Instance
// =====================================

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "/api",

  withCredentials: false,

  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================
// Request Interceptor
// =====================================

api.interceptors.request.use(
  (config) => {
    // If service/page already supplied a token,
    // do not overwrite it.
    if (config.headers?.Authorization) {
      return config;
    }

    // Default token is Student token.
    // Current student authentication stores
    // its JWT using "token".
    const studentToken =
      localStorage.getItem("token") ||
      localStorage.getItem("studentToken");

    if (studentToken) {
      config.headers.Authorization =
        `Bearer ${studentToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =====================================
// Response Interceptor
// =====================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Keep backend error available to pages:
    // error.response.data.message

    return Promise.reject(error);
  }
);

export default api;