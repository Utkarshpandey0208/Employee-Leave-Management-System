const { getPublicEmployees, getLeaves } = require("../models/dataStore");

const getAllEmployees = (req, res) => {
  const employees = getPublicEmployees().map((employee) => {
    const approvedLeaves = getLeaves().filter(
      (leave) => leave.employeeId === employee.id && leave.status === "Approved"
    );

    return {
      ...employee,
      leavesTaken: approvedLeaves.reduce((sum, leave) => sum + leave.days, 0)
    };
  });

  res.json(employees);
};

module.exports = { getAllEmployees };
