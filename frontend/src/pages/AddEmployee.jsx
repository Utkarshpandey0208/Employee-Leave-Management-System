import { useState } from "react";
import { UserPlus } from "lucide-react";
import { employeeApi } from "../services/api";
import { useLeaves } from "../context/LeaveContext";
import { useToast } from "../context/ToastContext";

const initialForm = {
  name: "",
  email: "",
  password: ""
};

export default function AddEmployee() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { refreshData } = useLeaves();
  const { showToast } = useToast();

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }

    setSubmitting(true);

    try {
      await employeeApi.add({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });
      setForm(initialForm);
      showToast("Employee added successfully", "success");
      await refreshData();
    } catch (err) {
      const message = err.response?.data?.message || "Unable to add employee";
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Employee</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a new employee account for leave management.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950"
      >
        {error && <p className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">{error}</p>}

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Employee name"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900"
              placeholder="employee@company.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Temporary password"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <UserPlus className="h-4 w-4" />
          {submitting ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
}
