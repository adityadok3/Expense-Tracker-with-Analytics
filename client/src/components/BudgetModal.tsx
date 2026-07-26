import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Budget, Category } from "../types";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: Category[];
  initialData?: Budget | null;
  loading?: boolean;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
  loading = false,
}) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amountLimit, setAmountLimit] = useState("");
  const [period, setPeriod] = useState<"MONTHLY" | "YEARLY" | "WEEKLY">("MONTHLY");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategoryId(initialData.categoryId || "");
      setAmountLimit(initialData.amountLimit.toString());
      setPeriod(initialData.period);
    } else {
      setName("");
      setCategoryId("");
      setAmountLimit("");
      setPeriod("MONTHLY");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      categoryId: categoryId || null,
      amountLimit: parseFloat(amountLimit),
      period,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Budget Limit" : "Create New Budget"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Budget Name</label>
          <input
            type="text"
            placeholder="e.g. Monthly Dining Out Limit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Category (Optional - Leave empty for Overall Budget)
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="">All Expense Categories (Overall Budget)</option>
            {categories
              .filter((c) => c.type === "EXPENSE")
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Spending Limit ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="500.00"
            value={amountLimit}
            onChange={(e) => setAmountLimit(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Frequency Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : initialData ? "Update Budget" : "Create Budget"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
