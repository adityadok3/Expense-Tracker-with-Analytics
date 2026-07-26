import api from "./api";

export const savingsService = {
  getSavingsGoals: async () => {
    const res = await api.get("/savings-goals");
    return res.data;
  },
  createSavingsGoal: async (data: any) => {
    const res = await api.post("/savings-goals", data);
    return res.data;
  },
  updateSavingsGoal: async (id: string, data: any) => {
    const res = await api.put(`/savings-goals/${id}`, data);
    return res.data;
  },
  deleteSavingsGoal: async (id: string) => {
    const res = await api.delete(`/savings-goals/${id}`);
    return res.data;
  },
};
