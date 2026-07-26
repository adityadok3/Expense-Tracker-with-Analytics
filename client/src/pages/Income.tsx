import React, { useEffect, useState } from "react";
import { incomeService } from "../services/incomeService";
import { categoryService } from "../services/categoryService";
import { Income, Category } from "../types";
import { IncomeModal } from "../components/IncomeModal";
import { Plus, Search, Trash2, Edit3, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export const IncomePage: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const res = await incomeService.getIncomes({
        search,
        categoryId: selectedCategory,
        page,
        limit: 8,
      });
      setIncomes(res.data.incomes);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error("Failed to load income entries");
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
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [search, selectedCategory, page]);

  const handleOpenAdd = () => {
    setEditingIncome(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (income: Income) => {
    setEditingIncome(income);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this income entry?")) return;
    try {
      await incomeService.deleteIncome(id);
      toast.success("Income record deleted!");
      fetchIncomes();
    } catch (err) {
      toast.error("Failed to delete income entry");
    }
  };

  const handleSubmit = async (data: any) => {
    setActionLoading(true);
    try {
      if (editingIncome) {
        await incomeService.updateIncome(editingIncome.id, data);
        toast.success("Income entry updated!");
      } else {
        await incomeService.createIncome(data);
        toast.success("Income entry added!");
      }
      setModalOpen(false);
      fetchIncomes();
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Income Tracker</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor earnings, salaries, investments, and freelance revenue streams.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Income</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search source or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories
              .filter((c) => c.type === "INCOME")
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Income Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Date Received</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading income records...
                  </td>
                </tr>
              ) : incomes.length > 0 ? (
                incomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100">
                      {inc.description}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
                        style={{ backgroundColor: inc.category.color }}
                      >
                        {inc.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {new Date(inc.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-emerald-600 dark:text-emerald-400 text-right text-sm">
                      +${inc.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(inc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(inc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic">
                    No income records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <IncomeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingIncome}
        loading={actionLoading}
      />
    </div>
  );
};
