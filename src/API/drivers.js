import api from "./axios";

export const fetchDrivers = () => api.get("/drivers");

export const createDriver = (data) => api.post("/drivers", data);

export const deleteDriver = (id) => api.delete(`/drivers/${id}`);
