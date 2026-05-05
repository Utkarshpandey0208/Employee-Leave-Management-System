import { ClipboardList, Clock3, Users } from "lucide-react";
import LoadingState from "../components/LoadingState";
import LeaveTable from "../components/LeaveTable";
import StatCard from "../components/StatCard";
import { useLeaves } from "../context/LeaveContext";

export default function AdminDashboard() {
  const { leaves, employees, loading, error } = useLeaves();
  const pending = leaves.filter((leave) => leave.status === "Pending").length;

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Organization-wide leave activity and pending approvals.</p>
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
