import api from "./api";

export const expenseService = {
  getExpenses: async (params?: any) => {
    const res = await api.get("/expenses", { params });
    return res.data;
  },
  getExpenseById: async (id: string) => {
    const res = await api.get(`/expenses/${id}`);
    return res.data;
  },
  createExpense: async (formData: FormData) => {
    const res = await api.post("/expenses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  updateExpense: async (id: string, formData: FormData) => {
    const res = await api.put(`/expenses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  deleteExpense: async (id: string) => {
    const res = await api.delete(`/expenses/${id}`);
    return res.data;
  },
};
