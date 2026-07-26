import api from "./api";

export const aiService = {
  getInsights: async () => {
    const res = await api.get("/ai/insights");
    return res.data;
  },
};
