import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  PieChart,
  PiggyBank,
  FolderTree,
  BarChart3,
  Bot,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Expenses", path: "/expenses", icon: CreditCard },
  { name: "Income", path: "/income", icon: TrendingUp },
  { name: "Budgets", path: "/budgets", icon: PieChart },
  { name: "Savings Goals", path: "/savings", icon: PiggyBank },
  { name: "Categories", path: "/categories", icon: FolderTree },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "AI Advisor", path: "/ai-advisor", icon: Bot, badge: "AI" },
  { name: "PDF Reports", path: "/reports", icon: FileSpreadsheet },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 transition-colors">
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center">
        <Bot className="w-8 h-8 mx-auto text-indigo-600 dark:text-indigo-400 mb-2" />
        <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Smart Financial Engine</h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Powered by Google GenAI SDK for automated spending advice.
        </p>
      </div>
    </aside>
  );
};
