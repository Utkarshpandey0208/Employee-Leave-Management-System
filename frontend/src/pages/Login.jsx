import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { user, login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "aarav@company.com",
    password: "employee123",
    role: "employee"
  });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  const handleRoleChange = (role) => {
    setForm({
      role,
      email: role === "admin" ? "admin@company.com" : "aarav@company.com",
      password: role === "admin" ? "admin123" : "employee123"
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.role) {
      setError("Please complete all login fields.");
      return;
    }

    try {
      const loggedInUser = await login(form);
      showToast("Login successful", "success");
      navigate(loggedInUser.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login. Check API server and credentials.");
      showToast("Login failed", "error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section className="hidden bg-slate-900 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-500">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">LeaveFlow</p>
              <p className="text-sm text-slate-300">Employee Leave Management</p>
            </div>
          </div>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-brand-100">Modern HR workflow</p>
            <h1 className="mt-4 text-5xl font-bold tracking-normal">Track leave balances, requests, and approvals in one focused workspace.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              A complete React and Express mini project with employee dashboards, admin approvals, history filters, and persistent session state.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-2xl font-bold">24</p>
              <p className="text-slate-300">Annual leaves</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-2xl font-bold">3</p>
              <p className="text-slate-300">Roles & views</p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="text-2xl font-bold">Live</p>
              <p className="text-slate-300">Status updates</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-600 text-white">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-bold">LeaveFlow</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Employee Leave Management</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-bold">Sign in</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose a role and use the sample credentials.</p>

              <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                {["employee", "admin"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${
                      form.role === role ? "bg-white text-brand-700 shadow-sm dark:bg-slate-950 dark:text-brand-100" : "text-slate-500 dark:text-slate-300"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
                <Input icon={LockKeyhole} label="Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} />
                {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({ icon: Icon, label, type, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <span className="mt-2 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
        <Icon className="h-4 w-4 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent py-3 text-sm text-slate-800 dark:text-slate-100"
        />
      </span>
    </label>
  );
}
