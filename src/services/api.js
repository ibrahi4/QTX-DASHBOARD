// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://213.210.20.206:9000/api/v1",
});

// قبل أي request، حط التوكن تلقائي
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("JWT");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
