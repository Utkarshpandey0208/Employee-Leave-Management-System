const mongoose = require("mongoose");

const Leave = require("../models/Leave");
const User = require("../models/User");

const statusToDb = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "rejected"
};

const statusToApi = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected"
};

const calculateDays = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

const formatLeave = (leave) => {
  const employee = leave.employeeId;
  const hasEmployee = employee && typeof employee === "object";
  const employeeId = hasEmployee ? employee._id.toString() : employee.toString();

  return {
    id: leave._id.toString(),
    employeeId,
    employeeName: hasEmployee ? employee.name : "",
    department: hasEmployee ? employee.department : "",
    type: leave.type,
    fromDate: formatDate(leave.fromDate),
    toDate: formatDate(leave.toDate),
    days: leave.days,
    reason: leave.reason,
    status: statusToApi[leave.status],
    appliedAt: leave.createdAt
  };
};

const getAllLeaves = async (req, res, next) => {
  try {
    const { employeeId, status, search } = req.query;
    const match = {};

    if (employeeId) {
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.json([]);
      }

      match.employeeId = new mongoose.Types.ObjectId(employeeId);
    }

    if (status && status !== "All") {
      match.status = statusToDb[status] || status.toLowerCase();
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" }
    ];

    const term = search ? search.trim() : "";

    if (term) {
      pipeline[pipeline.length] = {
        $match: {
          $or: [
            { type: { $regex: term, $options: "i" } },
            { reason: { $regex: term, $options: "i" } },
            { "employee.name": { $regex: term, $options: "i" } },
            { "employee.department": { $regex: term, $options: "i" } }
          ]
        }
      };
    }

    pipeline[pipeline.length] = { $sort: { createdAt: -1 } };
    pipeline[pipeline.length] = {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        employeeId: { $toString: "$employeeId" },
        employeeName: "$employee.name",
        department: "$employee.department",
        type: 1,
        fromDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$fromDate"
          }
        },
        toDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$toDate"
          }
        },
        days: 1,
        reason: 1,
        status: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "pending"] }, then: "Pending" },
              { case: { $eq: ["$status", "approved"] }, then: "Approved" },
              { case: { $eq: ["$status", "rejected"] }, then: "Rejected" }
            ],
            default: "$status"
          }
        },
        appliedAt: "$createdAt"
      }
    };

    const response = await Leave.aggregate(pipeline);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const createLeave = async (req, res, next) => {
  try {
    const { employeeId, type, fromDate, toDate, reason } = req.body;

    if (!employeeId || !type || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All leave fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const days = calculateDays(fromDate, toDate);
    if (Number.isNaN(days) || days <= 0) {
      return res.status(400).json({ message: "To date must be the same as or after from date" });
    }

    const employee = await User.findOne({ _id: employeeId, role: "employee" });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const approvedSummary = await Leave.aggregate([
      {
        $match: {
          employeeId: employee._id,
          status: "approved"
        }
      },
      {
        $group: {
          _id: "$employeeId",
          approvedDays: { $sum: "$days" }
        }
      }
    ]);

    const approvedDays = approvedSummary[0]?.approvedDays || 0;

    if (approvedDays + days > employee.totalLeaves) {
      return res.status(400).json({ message: "Leave request exceeds remaining leave balance" });
    }

    const newLeave = await Leave.create({
      employeeId: employee._id,
      type,
      fromDate,
      toDate,
      reason,
      days,
      status: "pending"
    });

    await newLeave.populate("employeeId", "name department");

    res.status(201).json(formatLeave(newLeave));
  } catch (error) {
    next(error);
  }
};

const updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Approved or Rejected" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status: statusToDb[status] },
      { new: true, runValidators: true }
    ).populate("employeeId", "name department");

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json(formatLeave(updatedLeave));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLeaves,
  createLeave,
  updateLeaveStatus
};
