import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { employeeApi, leaveApi } from "../services/api";

const LeaveContext = createContext(null);

export function LeaveProvider({ children }) {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leaveData, employeeData] = await Promise.all([leaveApi.getAll(), employeeApi.getAll()]);
      setLeaves(leaveData);
      setEmployees(employeeData);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load leave data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const applyLeave = async (payload) => {
    const created = await leaveApi.create(payload);
    setLeaves((current) => [created, ...current]);
    return created;
  };

  const updateStatus = async (id, status) => {
    const updated = await leaveApi.updateStatus(id, status);
    setLeaves((current) => current.map((leave) => (leave.id === updated.id ? updated : leave)));
    await refreshData();
    return updated;
  };

  const value = useMemo(
    () => ({ leaves, employees, loading, error, refreshData, applyLeave, updateStatus }),
    [leaves, employees, loading, error]
  );

  return <LeaveContext.Provider value={value}>{children}</LeaveContext.Provider>;
}

export const useLeaves = () => useContext(LeaveContext);
