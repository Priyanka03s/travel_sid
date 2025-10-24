// src/config.js
const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  CASHFREE_ENV: import.meta.env.VITE_CASHFREE_ENV || "sandbox",
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || "http://localhost:6000",
};

export default config;