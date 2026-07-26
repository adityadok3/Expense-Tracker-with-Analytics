import React, { useEffect, useState } from "react";
import { savingsService } from "../services/savingsService";
import { SavingsGoal } from "../types";
import { SavingsModal } from "../components/SavingsModal";
import { Plus, PiggyBank, Edit3, Trash2, Calendar, Target, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export const Savings: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await savingsService.getSavingsGoals();
      setGoals(res.data);
    } catch (err) {
      toast.error("Failed to load savings goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) return;
    try {
      await savingsService.deleteSavingsGoal(id);
      toast.success("Goal deleted!");
      fetchGoals();
    } catch (err) {
      toast.error("Failed to delete goal");
    }
  };

  const handleSubmit = async (data: any) => {
    setActionLoading(true);
    try {
      if (editingGoal) {
        await savingsService.updateSavingsGoal(editingGoal.id, data);
        toast.success("Goal updated!");
      } else {
        await savingsService.createSavingsGoal(data);
        toast.success("Goal created!");
      }
      setModalOpen(false);
      fetchGoals();
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Savings Goals</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track progress for emergency funds, tech upgrades, or vacation plans.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading savings goals...</div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => {
            const percentage = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            const isCompleted = g.currentAmount >= g.targetAmount;

            return (
              <div
                key={g.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: g.color || "#10B981" }}
                ></div>

                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-3 rounded-2xl text-white shadow-sm"
                        style={{ backgroundColor: g.color || "#10B981" }}
                      >
                        <PiggyBank className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{g.name}</h3>
                        {g.targetDate && (
                          <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Target: {new Date(g.targetDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        ${g.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">saved</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      Goal: ${g.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: g.color || "#10B981",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-600 dark:text-slate-400">{percentage}% Reached</span>

                  {isCompleted ? (
                    <span className="flex items-center space-x-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Goal Achieved!</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      ${(g.targetAmount - g.currentAmount).toLocaleString()} remaining
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <Target className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">No savings goals setup yet.</p>
          <p className="text-xs text-slate-400 mt-1">Start saving towards your major financial milestones!</p>
        </div>
      )}

      <SavingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingGoal}
        loading={actionLoading}
      />
    </div>
  );
};
