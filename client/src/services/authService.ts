import api from "./api";

export const authService = {
  login: async (credentials: any) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
