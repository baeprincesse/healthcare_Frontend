import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("mc_user");

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    const activeMode = localStorage.getItem("activeMode");
    if (activeMode) config.headers["X-Active-Mode"] = activeMode;

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthRoute = error.config?.url?.includes("/users/login") || error.config?.url?.includes("/users/register");

    if (status === 401 && !isAuthRoute) {
      clearAuthSession();

      const isLoginPage = window.location.pathname.endsWith("/login") || window.location.pathname.endsWith("login");
      if (!isLoginPage) {
        window.location.replace("/fronted/healthcare-appointment-platform/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;