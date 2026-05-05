import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import LeaveTable from "../components/LeaveTable";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../context/AuthContext";
import { useLeaves } from "../context/LeaveContext";

export default function LeaveHistory() {
  const { user } = useAuth();
  const { leaves, loading } = useLeaves();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const visibleLeaves = useMemo(() => {
    const scoped = user.role === "admin" ? leaves : leaves.filter((leave) => leave.employeeId === user.id);
    return scoped.filter((leave) => {
      const matchesStatus = status === "All" || leave.status === status;
      const term = search.toLowerCase();
      const matchesSearch =
        leave.employeeName.toLowerCase().includes(term) ||
        leave.type.toLowerCase().includes(term) ||
        leave.reason.toLowerCase().includes(term) ||
        leave.status.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [leaves, search, status, user]);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Leave History</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search and filter leave records.</p>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, type, reason, or status"
            className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>
      <LeaveTable leaves={visibleLeaves} showEmployee={user.role === "admin"} />
    </div>
  );
}
