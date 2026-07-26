import api from "./api";

export const reportService = {
  downloadMonthlyPDF: async () => {
    const res = await api.get("/reports/monthly-pdf", {
      responseType: "blob",
    });
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Financial-Report-${new Date().toISOString().slice(0, 7)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
