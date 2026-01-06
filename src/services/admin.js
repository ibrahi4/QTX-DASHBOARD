// src/services/admin.js
import api from "./api";

/* ========== AUTH ========== */
export const adminLogin = (data) => api.post("/auth/admin/login", data);

/* ========== DRIVERS ========== */
export const getDrivers = () => api.get("/admin/drivers");

export const getDriverById = (id) => api.get(`/admin/drivers/${id}`);

export const approveDriver = (id) => api.put(`/admin/approve/${id}`);

export const rejectDriver = (id) => api.put(`/admin/reject/${id}`);

export const createDriver = (data) => api.post("/admin/drivers/create", data);

/* ========== USERS ========== */
export const getUsers = (role) => api.get(`/admin/users?role=${role}`);

export const deleteUser = (id) => api.delete(`/admin/delete-user/${id}`);

/* ========== RIDES ========== */
export const getRides = () => api.get("/admin/rides");

export const getRideDetails = (id) => api.get(`/admin/rides/${id}`);

export const getRideStats = () => api.get("/admin/rides/stats");

export const deleteRide = (id) => api.delete(`/admin/rides/${id}`);
