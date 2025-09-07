import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((cfg) => {
  const csrftoken = getCookie("csrftoken") || getCookie("CSRF-TOKEN");
  if (csrftoken) cfg.headers["X-CSRFToken"] = csrftoken;
  console.debug("API REQ:", cfg.method, cfg.url, cfg);
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const payload = {
      message: err?.response?.data?.message || err?.message || "Network error",
      status: err?.response?.status || null,
      data: err?.response?.data || null,
      request: err?.request || null,
    };
    console.error("API ERROR:", payload);
    return Promise.reject(payload);
  }
);

export default api;
