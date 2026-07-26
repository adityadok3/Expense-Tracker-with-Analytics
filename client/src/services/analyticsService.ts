import api from "./api";

export const analyticsService = {
  getSummary: async () => {
    const res = await api.get("/analytics/summary");
    return res.data;
  },
  getCategoryBreakdown: async () => {
    const res = await api.get("/analytics/category-breakdown");
    return res.data;
  },
  getMonthlyTrends: async (months: number = 6) => {
    const res = await api.get("/analytics/monthly-trends", { params: { months } });
    return res.data;
  },
};
