import api from "./api";

export const incomeService = {
  getIncomes: async (params?: any) => {
    const res = await api.get("/income", { params });
    return res.data;
  },
  getIncomeById: async (id: string) => {
    const res = await api.get(`/income/${id}`);
    return res.data;
  },
  createIncome: async (data: any) => {
    const res = await api.post("/income", data);
    return res.data;
  },
  updateIncome: async (id: string, data: any) => {
    const res = await api.put(`/income/${id}`, data);
    return res.data;
  },
  deleteIncome: async (id: string) => {
    const res = await api.delete(`/income/${id}`);
    return res.data;
  },
};
