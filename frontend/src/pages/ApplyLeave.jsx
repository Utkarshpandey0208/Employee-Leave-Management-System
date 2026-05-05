import { useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLeaves } from "../context/LeaveContext";
import { useToast } from "../context/ToastContext";

const initialForm = {
  type: "Sick",
  fromDate: "",
  toDate: "",
  reason: ""
};

export default function ApplyLeave() {
  const { user } = useAuth();
  const { leaves, applyLeave } = useLeaves();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const balance = useMemo(() => {
    const taken = leaves
      .filter((leave) => leave.employeeId === user.id && leave.status === "Approved")
      .reduce((sum, leave) => sum + leave.days, 0);
    return user.totalLeaves - taken;
  }, [leaves, user]);

  const selectedDays = useMemo(() => {
    if (!form.fromDate || !form.toDate) return 0;
    const diff = new Date(form.toDate).getTime() - new Date(form.fromDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [form.fromDate, form.toDate]);

  const validate = () => {
    const nextErrors = {};
    if (!form.type) nextErrors.type = "Leave type is required.";
    if (!form.fromDate) nextErrors.fromDate = "From date is required.";
    if (!form.toDate) nextErrors.toDate = "To date is required.";
    if (form.fromDate && form.toDate && new Date(form.toDate) < new Date(form.fromDate)) {
      nextErrors.toDate = "To date must be the same as or after from date.";
    }
    if (!form.reason.trim()) nextErrors.reason = "Reason is required.";
    if (selectedDays > balance) nextErrors.toDate = "Requested days exceed your remaining balance.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await applyLeave({ ...form, employeeId: user.id, reason: form.reason.trim() });
      setForm(initialForm);
      showToast("Leave request submitted", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to submit leave request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Apply Leave</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Submit a leave request for admin approval.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Leave Type" error={errors.type}>
              <select
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option>Sick</option>
                <option>Casual</option>
                <option>Paid</option>
              </select>
            </Field>
            <Field label="From Date" error={errors.fromDate}>
              <input
                type="date"
                value={form.fromDate}
                onChange={(event) => setForm((current) => ({ ...current, fromDate: event.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </Field>
            <Field label="To Date" error={errors.toDate}>
              <input
                type="date"
                value={form.toDate}
                onChange={(event) => setForm((current) => ({ ...current, toDate: event.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </Field>
            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Selected Days</p>
              <p className="mt-2 text-2xl font-bold">{selectedDays > 0 ? selectedDays : 0}</p>
            </div>
          </div>
          <Field label="Reason" error={errors.reason} className="mt-4">
            <textarea
              rows="5"
              value={form.reason}
              onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
              placeholder="Briefly explain the reason for leave"
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </Field>
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CalendarPlus className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Leave Balance</p>
          <p className="mt-3 text-4xl font-bold">{balance}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">days remaining out of {user.totalLeaves}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.max(0, Math.min(100, (balance / user.totalLeaves) * 100))}%` }} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, error, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1 block text-xs font-medium text-rose-600 dark:text-rose-300">{error}</span>}
    </label>
  );
}
