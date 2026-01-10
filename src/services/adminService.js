// src/services/adminService.js
import axios from "axios";

const BASE_URL = "http://213.210.20.206:9000/api/v1";

// إنشاء instance لـ axios
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor لإضافة التوكن تلقائيًا في كل طلب
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ==================== Auth ==================== */
export const loginAdmin = async (email, password) => {
  const res = await api.post("/auth/admin/login", { email, password });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("token");
};

/* ==================== Drivers Management ==================== */
export const getAllDrivers = async (params = {}) => {
  const res = await api.get("/admin/drivers", { params });
  return res.data;
};

export const getTopDrivers = async (params = {}) => {
  const res = await api.get("/admin/drivers/top", { params });
  return res.data;
};

export const getDriverById = async (id) => {
  const res = await api.get(`/admin/drivers/${id}`);
  return res.data;
};

export const createDriver = async (data) => {
  try {
    // غير المسار ده من:
    // const res = await api.post("/api/v1/api/v1/admin/drivers/create", data);
    // إلى:
    const res = await api.post("/api/v1/admin/drivers/create", data);

    return res.data;
  } catch (err) {
    console.error("Create driver error:", err.response?.data);
    console.log("Full error response:", err.response?.data);
    throw err;
  }
};
export const approveDriver = async (id) => {
  const res = await api.put(`/admin/approve/${id}`);
  return res.data;
};

export const rejectDriver = async (id, reason = "") => {
  const payload = reason ? { reason } : {};
  const res = await api.put(`/admin/reject/${id}`, payload);
  return res.data;
};

/* ==================== Passengers / Users Management ==================== */
export const getAllPassengers = async (params = {}) => {
  const res = await api.get("/admin/users", {
    params: { role: "user", ...params },
  });
  return res.data;
};

export const getPassengerById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const createPassenger = async (passengerData) => {
  const res = await api.post("/admin/users/create", passengerData);
  return res.data;
};

export const updatePassenger = async (id, passengerData) => {
  const res = await api.put(`/admin/users/${id}`, passengerData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const togglePassengerActivation = async (id, isActive) => {
  const res = await api.put(`/admin/users/${id}/toggle-status`, { isActive });
  return res.data;
};

export const deletePassenger = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

/* ==================== Rides / Journeys ==================== */
export const getAllRides = async (params = {}) => {
  const res = await api.get("/admin/rides", { params });
  return res.data;
};

export const getLatestJourneys = async (params = {}) => {
  const res = await api.get("/admin/rides?latest=true", { params }); // أو /admin/rides مع فلاتر
  return res.data;
};

export const getJourneyById = async (id) => {
  const res = await api.get(`/admin/rides/${id}`);
  return res.data;
};

export const createRide = async (rideData) => {
  const res = await api.post("/admin/rides", rideData);
  return res.data;
};

export const getAvailableDrivers = async (params = {}) => {
  const res = await api.get("/admin/drivers/available", { params });
  return res.data;
};

export const assignDriverToJourney = async (journeyId, driverId) => {
  const res = await api.patch(`/admin/rides/${journeyId}/assign`, { driverId });
  return res.data;
};

/* ==================== Complaints / Support ==================== */
export const getAllComplaints = async (params = {}) => {
  const res = await api.get("/admin/complaints", { params });
  return res.data;
};

export const getComplaintMessages = async (complaintId) => {
  const res = await api.get(`/admin/complaints/${complaintId}/messages`);
  return res.data;
};

export const sendMessageToComplaint = async (complaintId, { message }) => {
  const res = await api.post(`/admin/complaints/${complaintId}/reply`, {
    message,
  });
  return res.data;
};

/* ==================== Discount Codes / Vouchers ==================== */
export const getAllDiscountCodes = async (params = {}) => {
  const res = await api.get("/admin/vouchers", { params });
  return res.data;
};

export const createDiscountCode = async (payload) => {
  const res = await api.post("/admin/vouchers", payload);
  return res.data;
};

export const toggleDiscountCodeActivation = async (id, isActive) => {
  const res = await api.patch(`/admin/vouchers/${id}/toggle`, { isActive });
  return res.data;
};

export const deleteDiscountCode = async (id) => {
  const res = await api.delete(`/admin/vouchers/${id}`);
  return res.data;
};

/* ==================== Cities Management ==================== */
export const getAllCities = async (params = {}) => {
  const res = await api.get("/admin/cities", { params });
  return res.data;
};

export const getAllCitiesWithRegions = async () => {
  const res = await api.get("/admin/cities/with-regions");
  return res.data;
};

export const createCity = async (cityData) => {
  const res = await api.post("/admin/cities", cityData);
  return res.data;
};

export const updateCityStatus = async (id, isActive) => {
  const res = await api.patch(`/admin/cities/${id}/status`, { isActive });
  return res.data;
};

export const updateCityFeatures = async (cityId, features) => {
  const res = await api.patch(`/admin/cities/${cityId}/features`, features);
  return res.data;
};

export const deleteCity = async (cityId) => {
  const res = await api.delete(`/admin/cities/${cityId}`);
  return res.data;
};

/* ==================== Wallets ==================== */
export const getWallets = async (role, params = {}) => {
  const res = await api.get("/admin/wallets", { params: { role, ...params } });
  return res.data;
};

export const topUpWallet = async (userId, data) => {
  const res = await api.post(`/admin/wallet/topup/${userId}`, data);
  return res.data;
};

export const deductFromWallet = async (userId, data) => {
  const res = await api.post(`/admin/wallet/deduct/${userId}`, data);
  return res.data;
};

/* ==================== Notifications ==================== */
export const sendNotificationToUser = async (userId, data) => {
  const res = await api.post(`/admin/notifications/user/${userId}`, data);
  return res.data;
};

/* ==================== Statistics & Dashboard ==================== */
export const getDashboardStats = async () => {
  const res = await api.get("/admin/stats/dashboard");
  return res.data;
};

export const getRidesStats = async (params = {}) => {
  const res = await api.get("/admin/stats/rides", { params });
  return res.data;
};

export const getJourneyStatsChart = async (params = {}) => {
  const res = await api.get("/admin/stats/charts/rides", { params });
  return res.data;
};

export const getRevenueAnalysis = async (params = {}) => {
  const res = await api.get("/admin/stats/revenue", { params });
  return res.data;
};

export const getTripsByCity = async (params = {}) => {
  const res = await api.get("/admin/stats/trips-by-city", { params });
  return res.data;
};

export const getCancellationStats = async (params = {}) => {
  const res = await api.get("/admin/stats/cancellations", { params });
  return res.data;
};

export const getReportStats = async () => {
  const res = await api.get("/admin/stats/dashboard");
  return res.data;
};

export const getTripTypesStats = async (params = {}) => {
  const res = await api.get("/admin/stats/trip-types", { params });
  return res.data;
};

// في adminService.js
export const acceptJourney = async (journeyId) => {
  const res = await api.put(`/admin/approve/${journeyId}`); // ← غيرنا patch → put ومسار accept → approve
  return res.data;
};

export const rejectJourney = async (journeyId) => {
  const res = await api.put(`/admin/reject/${journeyId}`); // نفس التغيير
  return res.data;
};

export default api;
