import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import LeaveTable from "../components/LeaveTable";
import LoadingState from "../components/LoadingState";
import { useLeaves } from "../context/LeaveContext";
import { useToast } from "../context/ToastContext";

const pageSize = 5;

export default function AdminPanel() {
  const { leaves, loading, updateStatus } = useLeaves();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);

  const filteredLeaves = useMemo(() => {
    const term = search.toLowerCase();
    return leaves.filter((leave) => {
      const matchesStatus = status === "All" || leave.status === status;
      const matchesSearch =
        leave.employeeName.toLowerCase().includes(term) ||
        leave.department.toLowerCase().includes(term) ||
        leave.type.toLowerCase().includes(term) ||
        leave.reason.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [leaves, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedLeaves = filteredLeaves.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const askUpdate = (leave, statusValue) => {
    setModal({
      leave,
      status: statusValue,
      title: `${statusValue} leave request`,
      message: `${statusValue} ${leave.employeeName}'s ${leave.days}-day ${leave.type.toLowerCase()} leave request?`
    });
  };

  const confirmUpdate = async () => {
    try {
      await updateStatus(modal.leave.id, modal.status);
      showToast(`Request ${modal.status.toLowerCase()}`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Unable to update request", "error");
    } finally {
      setModal(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review, approve, or reject employee leave requests.</p>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search requests"
            className="w-full rounded-md border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>
      <LeaveTable
        leaves={paginatedLeaves}
        showEmployee
        actions={(leave) =>
          leave.status === "Pending" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => askUpdate(leave, "Approved")}
                className="rounded-md bg-emerald-600 p-2 text-white hover:bg-emerald-700"
                aria-label="Approve request"
                title="Approve request"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => askUpdate(leave, "Rejected")}
                className="rounded-md bg-rose-600 p-2 text-white hover:bg-rose-700"
                aria-label="Reject request"
                title="Reject request"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-400">Completed</span>
          )
        }
      />
      <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <p className="text-slate-500 dark:text-slate-400">
          Showing {paginatedLeaves.length} of {filteredLeaves.length} requests
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ConfirmModal
        open={Boolean(modal)}
        title={modal?.title}
        message={modal?.message}
        confirmLabel={modal?.status}
        tone={modal?.status === "Rejected" ? "danger" : "brand"}
        onClose={() => setModal(null)}
        onConfirm={confirmUpdate}
      />
    </div>
  );
}
