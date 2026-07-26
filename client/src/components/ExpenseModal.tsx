import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Category, Expense } from "../types";
import { Upload, Paperclip } from "lucide-react";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  categories: Category[];
  initialData?: Expense | null;
  loading?: boolean;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
  loading = false,
}) => {
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.categoryId);
      setAmount(initialData.amount.toString());
      setDescription(initialData.description);
      setDate(new Date(initialData.date).toISOString().slice(0, 10));
      setIsRecurring(initialData.isRecurring);
    } else {
      setCategoryId(categories[0]?.id || "");
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      setIsRecurring(false);
      setReceiptFile(null);
    }
  }, [initialData, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("amount", amount);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("isRecurring", String(isRecurring));
    if (receiptFile) {
      formData.append("receipt", receiptFile);
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Expense Entry" : "Record New Expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <input
            type="text"
            placeholder="e.g. Grocery shopping at Trader Joe's"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="recurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 dark:border-slate-700"
          />
          <label htmlFor="recurring" className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Mark as Recurring Monthly Expense
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Receipt Attachment (Image or PDF)
          </label>
          <div className="flex items-center space-x-3">
            <label className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors w-full">
              <Upload className="w-4 h-4 mr-2" />
              <span>{receiptFile ? receiptFile.name : "Upload Receipt"}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
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
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : initialData ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
