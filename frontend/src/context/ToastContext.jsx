import { createContext, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900"
            >
              <Icon
                className={`mt-0.5 h-5 w-5 ${
                  toast.type === "success"
                    ? "text-emerald-500"
                    : toast.type === "error"
                      ? "text-rose-500"
                      : "text-brand-600"
                }`}
              />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{toast.message}</p>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
