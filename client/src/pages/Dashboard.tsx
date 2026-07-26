import React, { useEffect, useState } from "react";
import { StatCard } from "../components/StatCard";
import { ExpenseModal } from "../components/ExpenseModal";
import { IncomeModal } from "../components/IncomeModal";
import { analyticsService } from "../services/analyticsService";
import { expenseService } from "../services/expenseService";
import { incomeService } from "../services/incomeService";
import { categoryService } from "../services/categoryService";
import { aiService } from "../services/aiService";
import { AnalyticsSummary, Category, Expense, MonthlyTrend, CategoryBreakdown, AIInsightResponse } from "../types";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Plus,
  Bot,
  ArrowRight,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [categoriesBreakdown, setCategoriesBreakdown] = useState<CategoryBreakdown[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsightResponse | null>(null);

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [sumRes, trendRes, catBreakRes, expRes, catRes, aiRes] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getMonthlyTrends(6),
        analyticsService.getCategoryBreakdown(),
        expenseService.getExpenses({ limit: 5 }),
        categoryService.getCategories(),
        aiService.getInsights(),
      ]);

      setSummary(sumRes.data);
      setTrends(trendRes.data);
      setCategoriesBreakdown(catBreakRes.data);
      setRecentExpenses(expRes.data.expenses);
      setAllCategories(catRes.data);
      setAiInsight(aiRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateExpense = async (formData: FormData) => {
    setActionLoading(true);
    try {
      await expenseService.createExpense(formData);
      toast.success("Expense recorded successfully!");
      setExpenseModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record expense");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateIncome = async (data: any) => {
    setActionLoading(true);
    try {
      await incomeService.createIncome(data);
      toast.success("Income recorded successfully!");
      setIncomeModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record income");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Financial Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics and AI financial overview for this month.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIncomeModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Income</span>
          </button>
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Net Balance"
          amount={summary?.allTime.totalBalance ?? 0}
          icon={Wallet}
          subtext="All-time accumulated net"
          gradient="from-indigo-500 to-blue-600"
          iconBg="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Monthly Income"
          amount={summary?.currentMonth.income ?? 0}
          icon={ArrowUpRight}
          change={summary?.comparison.incomeChangePercent}
          gradient="from-emerald-500 to-teal-600"
          iconBg="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Monthly Expenses"
          amount={summary?.currentMonth.expenses ?? 0}
          icon={ArrowDownRight}
          change={summary?.comparison.expenseChangePercent}
          gradient="from-rose-500 to-pink-600"
          iconBg="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Savings Rate"
          amount={`${summary?.currentMonth.savingsRate ?? 0}%`}
          icon={PiggyBank}
          subtext={`Net: $${(summary?.currentMonth.netSavings ?? 0).toFixed(2)}`}
          gradient="from-purple-500 to-violet-600"
          iconBg="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* AI Financial Advisor Insight Widget */}
      {aiInsight && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-purple-900/90 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-bold text-base text-indigo-200">Google GenAI Financial Insight</h3>
                <p className="text-xs text-slate-300 mt-0.5">{aiInsight.summary}</p>
              </div>
            </div>
            <Link
              to="/ai-advisor"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <span>View Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/10">
            {aiInsight.suggestions.map((tip, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                <span className="font-bold text-indigo-400 mr-1.5">Tip {idx + 1}:</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Income vs Expenses Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Income vs Expense Trends</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Past 6 months financial trajectory</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Income</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                <span className="text-slate-600 dark:text-slate-400">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expenses" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Category Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Current month expense breakdown</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {categoriesBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoriesBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {categoriesBreakdown.map((entry, index) => (
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
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 italic">No expenses recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Recent Transactions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latest expense entries recorded</p>
          </div>
          <Link
            to="/expenses"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentExpenses.length > 0 ? (
            recentExpenses.map((exp) => (
              <div key={exp.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-3 rounded-2xl transition-colors">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm"
                    style={{ backgroundColor: exp.category.color }}
                  >
                    {exp.category.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{exp.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{exp.category.name} • {new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  -${exp.amount.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="py-6 text-center text-xs text-slate-400">No recent transactions found.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSubmit={handleCreateExpense}
        categories={allCategories}
        loading={actionLoading}
      />
      <IncomeModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onSubmit={handleCreateIncome}
        categories={allCategories}
        loading={actionLoading}
      />
    </div>
  );
};
