import React, { useState } from "react";
import { reportService } from "../services/reportService";
import { FileSpreadsheet, Download, FileText, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export const Reports: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await reportService.downloadMonthlyPDF();
      toast.success("PDF Financial Report downloaded!");
    } catch (err) {
      toast.error("Failed to download PDF report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Exportable Reports & Statements
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate official PDF financial statements suitable for portfolio presentation or tax preparation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PDF Monthly Statement Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 inline-block">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Monthly PDF Financial Statement</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Includes category breakdown tables, total monthly cashflow, savings rates, and itemized transaction activity.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Formatted PDF document compiled on backend with PDFKit</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Complete account metrics and recent activity breakdown</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Branded layout designed for Computer Science portfolio demonstration</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Generating PDF..." : "Download Monthly PDF Statement"}</span>
          </button>
        </div>

        {/* OpenAPI / Swagger Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 inline-block">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Interactive Swagger OpenAPI Specs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore complete REST API endpoints, schemas, parameters, and authentication definitions.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Swagger UI interface hosted at <code>http://localhost:5000/api-docs</code></span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>OpenAPI 3.0.0 specification standard</span>
              </li>
            </ul>
          </div>

          <a
            href="http://localhost:5000/api-docs"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all text-center"
          >
            <span>Open Swagger API Documentation</span>
          </a>
        </div>
      </div>
    </div>
  );
};
