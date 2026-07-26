import React from "react";
import { useAuth } from "../context/AuthContext";
import { User as UserIcon, Mail, Calendar, ShieldCheck } from "lucide-react";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">User Account Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your security settings and personal info.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-6">
          <img
            src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo"}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover shadow-md"
          />
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <span className="mt-2 inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>JWT Authenticated</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">User ID</span>
            <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-1">{user.id}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Email Address</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
