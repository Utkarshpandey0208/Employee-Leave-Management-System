import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://employee-leave-management-system-rtew.onrender.com/api",
  timeout: 8000
});

export const authApi = {
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data)
};

export const employeeApi = {
  getAll: () => api.get("/employees").then((res) => res.data)
};

export const leaveApi = {
  getAll: (params = {}) => api.get("/leaves", { params }).then((res) => res.data),
  create: (payload) => api.post("/leaves", payload).then((res) => res.data),
  updateStatus: (id, status) => api.patch(`/leaves/${id}/status`, { status }).then((res) => res.data)
};

export default api;
