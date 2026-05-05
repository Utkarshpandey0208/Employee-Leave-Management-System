const { getEmployees, getLeaves, setLeaves } = require("../models/dataStore");

const calculateDays = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

const getAllLeaves = (req, res) => {
  const { employeeId, status, search } = req.query;
  let filteredLeaves = [...getLeaves()];

  if (employeeId) {
    filteredLeaves = filteredLeaves.filter((leave) => leave.employeeId === Number(employeeId));
  }

  if (status && status !== "All") {
    filteredLeaves = filteredLeaves.filter((leave) => leave.status === status);
  }

  if (search) {
    const term = search.toLowerCase();
    filteredLeaves = filteredLeaves.filter(
      (leave) =>
        leave.employeeName.toLowerCase().includes(term) ||
        leave.type.toLowerCase().includes(term) ||
        leave.reason.toLowerCase().includes(term) ||
        leave.department.toLowerCase().includes(term)
    );
  }

  res.json(filteredLeaves.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)));
};

const createLeave = (req, res) => {
  const { employeeId, type, fromDate, toDate, reason } = req.body;

  if (!employeeId || !type || !fromDate || !toDate || !reason) {
    return res.status(400).json({ message: "All leave fields are required" });
  }

  const days = calculateDays(fromDate, toDate);
  if (Number.isNaN(days) || days <= 0) {
    return res.status(400).json({ message: "To date must be the same as or after from date" });
  }

  const employee = getEmployees().find((user) => user.id === Number(employeeId) && user.role === "employee");
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const approvedDays = getLeaves()
    .filter((leave) => leave.employeeId === employee.id && leave.status === "Approved")
    .reduce((sum, leave) => sum + leave.days, 0);

  if (approvedDays + days > employee.totalLeaves) {
    return res.status(400).json({ message: "Leave request exceeds remaining leave balance" });
  }

  const newLeave = {
    id: Date.now(),
    employeeId: employee.id,
    employeeName: employee.name,
    department: employee.department,
    type,
    fromDate,
    toDate,
    days,
    reason,
    status: "Pending",
    appliedAt: new Date().toISOString()
  };

  setLeaves([newLeave, ...getLeaves()]);
  res.status(201).json(newLeave);
};

const updateLeaveStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be Approved or Rejected" });
  }

  const leaves = getLeaves();
  const leave = leaves.find((item) => item.id === Number(id));

  if (!leave) {
    return res.status(404).json({ message: "Leave request not found" });
  }

  const nextLeaves = leaves.map((item) => (item.id === Number(id) ? { ...item, status } : item));
  setLeaves(nextLeaves);

  res.json(nextLeaves.find((item) => item.id === Number(id)));
};

module.exports = {
  getAllLeaves,
  createLeave,
  updateLeaveStatus
};
