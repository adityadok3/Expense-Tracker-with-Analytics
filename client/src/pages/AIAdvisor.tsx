import React, { useEffect, useState } from "react";
import { aiService } from "../services/aiService";
import { AIInsightResponse } from "../types";
import { Sparkles, RefreshCw, CheckCircle2, ShieldAlert, FileText, Lightbulb } from "lucide-react";
import toast from "react-hot-toast";

export const AIAdvisor: React.FC = () => {
  const [insights, setInsights] = useState<AIInsightResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await aiService.getInsights();
      setInsights(res.data);
      toast.success("AI insights updated!");
    } catch (err) {
      toast.error("Failed to generate AI insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              AI Financial Advisor
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse">
              Google GenAI
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Autonomous spending analysis, budget recommendations, and saving strategy advice.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Regenerate Insights</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Evaluating financial parameters with Google GenAI SDK...
          </p>
        </div>
      ) : insights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Executive Overview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Spending Summary</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{insights.summary}</p>
          </div>

          {/* Budget Optimization Advice */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-purple-600 dark:text-purple-400">
              <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Budget Advice</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{insights.budgetAdvice}</p>
          </div>

          {/* Actionable Suggestions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3 text-amber-500">
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Personalized Savings Suggestions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {insights.suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start space-x-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comprehensive Monthly Report */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl md:col-span-2 space-y-4 border border-indigo-500/20">
            <div className="flex items-center space-x-3 text-indigo-400">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Monthly Health Check Report</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{insights.monthlyReport}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
