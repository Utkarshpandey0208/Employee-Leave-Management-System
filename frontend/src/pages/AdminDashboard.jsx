import { ClipboardList, Clock3, UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import LeaveTable from "../components/LeaveTable";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useLeaves } from "../context/LeaveContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { leaves, employees, loading, error } = useLeaves();
  const pending = leaves.filter((leave) => leave.status === "Pending").length;

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Organization-wide leave activity and pending approvals.</p>
        </div>
        {user?.role === "admin" && (
          <Link
            to="/add-employee"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Link>
        )}
      </div>
      {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">{error}</p>}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Employees" value={employees.length} helper="Active employee accounts" icon={Users} />
        <StatCard title="Total Requests" value={leaves.length} helper="Across all statuses" icon={ClipboardList} tone="green" />
        <StatCard title="Pending Requests" value={pending} helper="Awaiting action" icon={Clock3} tone="amber" />
      </div>
      <section>
        <h3 className="mb-3 text-lg font-bold">Latest Requests</h3>
        <LeaveTable leaves={leaves.slice(0, 5)} showEmployee />
      </section>
    </div>
  );
}
