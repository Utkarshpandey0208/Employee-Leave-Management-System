import StatusBadge from "./StatusBadge";

export default function LeaveTable({ leaves, showEmployee = false, actions }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {showEmployee && <Th>Employee</Th>}
              <Th>Type</Th>
              <Th>Dates</Th>
              <Th>Days</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
              {actions && <Th>Action</Th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={showEmployee ? 7 : 6} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No leave records found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  {showEmployee && (
                    <Td>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{leave.employeeName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{leave.department}</p>
                    </Td>
                  )}
                  <Td>{leave.type}</Td>
                  <Td>
                    <span className="whitespace-nowrap">{leave.fromDate}</span>
                    <span className="mx-2 text-slate-400">to</span>
                    <span className="whitespace-nowrap">{leave.toDate}</span>
                  </Td>
                  <Td>{leave.days}</Td>
                  <Td>
                    <span className="line-clamp-2 max-w-xs">{leave.reason}</span>
                  </Td>
                  <Td>
                    <StatusBadge status={leave.status} />
                  </Td>
                  {actions && <Td>{actions(leave)}</Td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{children}</td>;
}
