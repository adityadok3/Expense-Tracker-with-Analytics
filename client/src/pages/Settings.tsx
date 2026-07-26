import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun, Shield, Terminal, Database, Server } from "lucide-react";

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Application Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          System preferences, theme configuration, and architecture details.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
          Appearance & Interface
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Dark Mode Theme</h4>
            <p className="text-xs text-slate-500">Switch between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
          Full-Stack Tech Architecture Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <Server className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Backend Server</p>
              <p className="text-slate-500 mt-0.5">Node.js, Express, TypeScript, JWT Auth, Winston, Helmet</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <Database className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Database & ORM</p>
              <p className="text-slate-500 mt-0.5">PostgreSQL with Prisma ORM schema migrations & seeders</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <Terminal className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Frontend Stack</p>
              <p className="text-slate-500 mt-0.5">React 19, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">AI Intelligence</p>
              <p className="text-slate-500 mt-0.5">Google Generative AI SDK (`@google/genai` model: gemini-2.5-flash)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
