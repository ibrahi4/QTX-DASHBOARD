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

// تسجيل دخول الأدمن
export const loginAdmin = async (email, password) => {
  const res = await api.post("/auth/admin/login", { email, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

// جلب كل السائقين
export const getAllDrivers = async () => {
  const res = await api.get("/admin/drivers");
  return res.data; // { success: true, data: [...] }
};

// جلب تفاصيل سائق واحد بالـ ID
export const getDriverById = async (id) => {
  const res = await api.get(`/admin/drivers/${id}`);
  return res.data;
};

// إضافة سائق جديد من الأدمن
export const createDriver = async (driverData) => {
  const res = await api.post("/admin/drivers/create", driverData);
  return res.data;
};

// قبول السائق
export const approveDriver = async (id) => {
  const res = await api.put(`/admin/approve/${id}`);
  return res.data;
};
// Add this function to your adminService.js
export const getAllRides = async () => {
  const res = await api.get("/admin/rides");
  return res.data; // Expected: { success: true, data: [rides array] }
};
// رفض السائق (مع إمكانية إرسال سبب الرفض اختياريًا)
export const rejectDriver = async (id, reason = "") => {
  const payload = reason ? { reason } : {};
  const res = await api.put(`/admin/reject/${id}`, payload);
  return res.data;
};

// تسجيل الخروج
export const logoutAdmin = () => {
  localStorage.removeItem("token");
};

export const getAllPassengers = async () => {
  const res = await api.get("/admin/users?role=user"); // أو أي endpoint للركاب
  return res.data;
};

export const createPassenger = async (passengerData) => {
  const res = await api.post("/admin/users/create", passengerData); // حسب الـ endpoint
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

// إضافة رحلة جديدة (حسب الـ endpoint الفعلي)
export const createRide = async (rideData) => {
  const res = await api.post("/admin/rides", rideData); // أو /admin/journeys حسب الباك
  return res.data;
};

// جلب تفاصيل راكب واحد
export const getPassengerById = async (id) => {
  const res = await api.get(`/admin/users/${id}`); // أو /admin/passengers/${id} حسب الـ endpoint
  return res.data;
};

// تحديث بيانات الراكب
export const updatePassenger = async (id, passengerData) => {
  const res = await api.put(`/admin/users/${id}`, passengerData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// جلب المحافظ حسب الدور
export const getWallets = async (role) => {
  const res = await api.get(`/admin/wallets?role=${role}`);
  return res.data;
};

// شحن رصيد
export const topUpWallet = async (userId, data) => {
  const res = await api.post(`/admin/wallet/topup/${userId}`, data);
  return res.data;
};

// خصم من الرصيد
export const deductFromWallet = async (userId, data) => {
  const res = await api.post(`/admin/wallet/deduct/${userId}`, data);
  return res.data;
};

// إرسال إشعار لمستخدم
export const sendNotificationToUser = async (userId, data) => {
  const res = await api.post(`/admin/notifications/user/${userId}`, data);
  return res.data;
};

// (top drivers)
export const getTopDrivers = async () => {
  const res = await api.get("/admin/drivers/top"); // حسب الـ endpoint الفعلي

  return res.data;
};

export const getAllComplaints = async (filters = {}) => {
  const res = await api.get("/admin/complaints", { params: filters });
  return res.data; // { data: [...], total: ..., ... }
};

// جلب رسائل شكوى معينة
export const getComplaintMessages = async (complaintId) => {
  const res = await api.get(`/admin/complaints/${complaintId}/messages`);
  return res.data;
};

// إرسال رسالة في شكوى
export const sendMessageToComplaint = async (complaintId, { message }) => {
  const res = await api.post(`/admin/complaints/${complaintId}/reply`, {
    message,
  });
  return res.data;
};

// جلب كل المدن
export const getAllCities = async () => {
  const res = await api.get(
    "/admin/cities?isActive=true&isActive=false&page&limit"
  );
  return res.data;
};

// إضافة مدينة
export const createCity = async (cityData) => {
  const res = await api.post("/admin/cities", cityData);
  return res.data;
};

// تحديث حالة المدينة (تفعيل/تعطيل)
export const updateCityStatus = async (id, isActive) => {
  const res = await api.patch(`/admin/cities/${id}/status`, { isActive });
  return res.data;
};

// جلب عدد الرحلات حسب المدينة
export const getTripsByCity = async () => {
  const res = await api.get("/admin/stats/trips-by-city"); // أو /admin/cities/trips-count
  return res.data;
};
// جلب المدن مع المناطق والميزات
export const getAllCitiesWithRegions = async () => {
  const res = await api.get("/admin/cities/with-regions");
  return res.data;
};

// تحديث ميزات المدينة
export const updateCityFeatures = async (cityId, features) => {
  const res = await api.patch(`/admin/cities/${cityId}/features`, features);
  return res.data;
};

// حذف مدينة
export const deleteCity = async (cityId) => {
  const res = await api.delete(`/admin/cities/${cityId}`);
  return res.data;
};

// جلب إحصائيات الرحلات
export const getRidesStats = async () => {
  const res = await api.get("/admin/stats/rides");
  return res.data;
};

// جلب أحدث الرحلات
export const getLatestJourneys = async () => {
  const res = await api.get("/admin/journeys/latest"); // أو /admin/rides/latest
  return res.data;
};

// جلب إحصائيات الداشبورد الرئيسية
export const getDashboardStats = async () => {
  const res = await api.get("/admin/stats/dashboard"); // أو /admin/stats
  return res.data;
};

// جلب إحصائيات الرحلات للـ Bar Chart (أيام أو تواريخ)
export const getJourneyStatsChart = async () => {
  const res = await api.get("/admin/stats/rides?startDate&endDate"); // أو /admin/journeys/stats/chart
  return res.data;
};

export const getRevenueAnalysis = async () => {
  const res = await api.get("/admin/stats/charts/rides");
  return res.data;
};

// جلب نسبة الإلغاء ومتوسط الانتظار
export const getCancelAndWaitStats = async () => {
  const res = await api.get("/admin/stats/cancel-wait"); // أو أي endpoint مناسب مثل /admin/stats/rides/summary
  return res.data;
};

export const getAllDiscountCodes = async () => {
  const res = await api.get("/admin/vouchers");
  return res.data; // يرجع array مباشرة داخل data
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

export const getJourneyById = async (id) => {
  const res = await api.get(`/admin/rides/${id}`); // أو /admin/journeys/${id}
  return res.data;
};

export const getAvailableDrivers = async () => {
  const res = await api.get("/admin/drivers/available");
  return res.data;
};

export const assignDriverToJourney = async (journeyId, driverId) => {
  const res = await api.patch(`/admin/rides/${journeyId}/assign`, { driverId });
  return res.data;
};

// جلب إحصائيات التقارير (الكروت الأربعة)
export const getReportStats = async () => {
  const res = await api.get("/admin/stats/report"); // أو /admin/dashboard/report-stats
  return res.data;
};
export default api;
