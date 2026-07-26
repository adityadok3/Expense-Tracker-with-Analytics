import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: string | number;
  icon: LucideIcon;
  change?: number;
  subtext?: string;
  gradient?: string;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  icon: Icon,
  change,
  subtext,
  gradient = "from-indigo-500 to-purple-600",
  iconBg = "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {typeof amount === "number" ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : amount}
        </h3>

        {(change !== undefined || subtext) && (
          <div className="mt-2 flex items-center space-x-2 text-xs font-medium">
            {change !== undefined && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold ${
                  isPositive
                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                }`}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {Math.abs(change)}%
              </span>
            )}
            <span className="text-slate-500 dark:text-slate-400">{subtext || "vs last month"}</span>
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
    </div>
  );
};
