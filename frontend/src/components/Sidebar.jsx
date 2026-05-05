import { ClipboardCheck, FileClock, Home, PanelLeftClose, PlusCircle, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const employeeItems = [
  { label: "Dashboard", path: "/dashboard", icon: Home },
  { label: "Apply Leave", path: "/apply", icon: PlusCircle },
  { label: "History", path: "/history", icon: FileClock }
];

const adminItems = [
  { label: "Dashboard", path: "/admin", icon: Home },
  { label: "Admin Panel", path: "/admin/requests", icon: ClipboardCheck },
  { label: "History", path: "/history", icon: FileClock }
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = user?.role === "admin" ? adminItems : employeeItems;

  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={onClose} aria-label="Close sidebar" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">LeaveFlow</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Management System</p>
            </div>
          </div>
          <button className="rounded-md p-2 text-slate-500 lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-100"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="m-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Signed in as</p>
          <p className="mt-1 text-sm font-semibold">{user?.role === "admin" ? "Administrator" : "Employee"}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
      </aside>
    </>
  );
}
