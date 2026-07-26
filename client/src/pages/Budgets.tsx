import React, { useEffect, useState } from "react";
import { budgetService } from "../services/budgetService";
import { categoryService } from "../services/categoryService";
import { Budget, Category } from "../types";
import { BudgetModal } from "../components/BudgetModal";
import { Plus, PieChart, AlertCircle, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await budgetService.getBudgets();
      setBudgets(res.data);
    } catch (err) {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
  }, []);

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await budgetService.deleteBudget(id);
      toast.success("Budget deleted!");
      fetchBudgets();
    } catch (err) {
      toast.error("Failed to delete budget");
    }
  };

  const handleSubmit = async (data: any) => {
    setActionLoading(true);
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, data);
        toast.success("Budget updated!");
      } else {
        await budgetService.createBudget(data);
        toast.success("Budget created!");
      }
      setModalOpen(false);
      fetchBudgets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Monthly Budgets</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set category-based spending targets and avoid overspending.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading budgets...</div>
      ) : budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((b) => {
            const isOver = b.spent > b.amountLimit;
            const isWarning = b.percentage >= 80 && !isOver;

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{b.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {b.category ? `Category: ${b.category.name}` : "Overall Spending Target"}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="mt-4 flex items-baseline justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">
                      Spent: <strong className="text-slate-900 dark:text-slate-100">${b.spent.toFixed(2)}</strong>
                    </span>
                    <span className="text-slate-500">
                      Limit: ${b.amountLimit.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOver
                          ? "bg-rose-500"
                          : isWarning
                          ? "bg-amber-500"
                          : "bg-purple-600"
                      }`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">{b.percentage}% Used</span>

                  {isOver ? (
                    <span className="flex items-center space-x-1 text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Exceeded by ${(b.spent - b.amountLimit).toFixed(2)}</span>
                    </span>
                  ) : isWarning ? (
                    <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Near Limit (${b.remaining.toFixed(2)} left)</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>${b.remaining.toFixed(2)} remaining</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <PieChart className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">No active budgets found.</p>
          <p className="text-xs text-slate-400 mt-1">Create a monthly spending limit to manage your finances better.</p>
        </div>
      )}

      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingBudget}
        loading={actionLoading}
      />
    </div>
  );
};
