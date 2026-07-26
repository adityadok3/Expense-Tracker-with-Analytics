import React, { useEffect, useState } from "react";
import { analyticsService } from "../services/analyticsService";
import { MonthlyTrend, CategoryBreakdown, AnalyticsSummary } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, TrendingUp, DollarSign, Activity } from "lucide-react";

export const Analytics: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sumRes, trendRes, catRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getMonthlyTrends(12),
          analyticsService.getCategoryBreakdown(),
        ]);
        setSummary(sumRes.data);
        setTrends(trendRes.data);
        setCategoryBreakdown(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Financial Analytics & Reporting
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep interactive charts, monthly comparisons, and expense allocation metrics.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading analytical models...</div>
      ) : (
        <>
          {/* Monthly Comparison Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Monthly Income vs Expense Breakdown</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Comparing revenue against outflows over time</p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#1E293B",
                      borderRadius: "1rem",
                      color: "#FFF",
                      fontSize: "12px",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="income" name="Income ($)" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses ($)" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Expenses Distribution Pie */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">Expense Breakdown by Category</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Percentage allocation across budget categories</p>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      innerRadius={45}
                      dataKey="amount"
                      paddingAngle={3}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderColor: "#1E293B",
                        borderRadius: "1rem",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px" }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Savings Trajectory Line Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">Net Savings Trajectory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Net cashflow retention per month</p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderColor: "#1E293B",
                        borderRadius: "1rem",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="savings" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
