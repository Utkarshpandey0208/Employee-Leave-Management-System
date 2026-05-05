import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import LoadingState from "../components/LoadingState";
import StatCard from "../components/StatCard";
import LeaveTable from "../components/LeaveTable";
import { useAuth } from "../context/AuthContext";
import { useLeaves } from "../context/LeaveContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { leaves, loading, error } = useLeaves();
  const myLeaves = leaves.filter((leave) => leave.employeeId === user.id);
  const leavesTaken = myLeaves.filter((leave) => leave.status === "Approved").reduce((sum, leave) => sum + leave.days, 0);
  const pending = myLeaves.filter((leave) => leave.status === "Pending").length;
  const remaining = user.totalLeaves - leavesTaken;

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Employee Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your current leave balance and latest activity.</p>
      </div>
      {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">{error}</p>}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Leaves" value={user.totalLeaves} helper="Annual allocation" icon={CalendarDays} />
        <StatCard title="Leaves Taken" value={leavesTaken} helper="Approved leave days" icon={CheckCircle2} tone="green" />
        <StatCard title="Leaves Remaining" value={remaining} helper={`${pending} request(s) pending`} icon={Clock3} tone="amber" />
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Leave Requests</h3>
        </div>
        <LeaveTable leaves={myLeaves.slice(0, 5)} />
      </section>
    </div>
  );
}
