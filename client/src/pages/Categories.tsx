import React, { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import { Category } from "../types";
import { CategoryModal } from "../components/CategoryModal";
import { Plus, Tag, Lock, Edit3, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    if (category.isDefault) {
      toast.error("Default system categories cannot be modified.");
      return;
    }
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error("Default system categories cannot be deleted.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this custom category?")) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success("Category deleted!");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleSubmit = async (data: any) => {
    setActionLoading(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, data);
        toast.success("Category updated!");
      } else {
        await categoryService.createCategory(data);
        toast.success("Category created!");
      }
      setModalOpen(false);
      fetchCategories();
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Category Manager</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize transactions into system default or custom categories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{cat.name}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        cat.type === "EXPENSE"
                          ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                          : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {cat.type}
                    </span>
                    {cat.isDefault && (
                      <span className="flex items-center space-x-0.5 text-[10px] text-slate-400" title="System default">
                        <Lock className="w-3 h-3" />
                        <span>System</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!cat.isDefault && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.isDefault)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        loading={actionLoading}
      />
    </div>
  );
};
