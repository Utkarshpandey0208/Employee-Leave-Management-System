const express = require("express");
const {
  getAllLeaves,
  createLeave,
  updateLeaveStatus
} = require("../controllers/leaveController");

const router = express.Router();

router.get("/", getAllLeaves);
router.post("/", createLeave);
router.patch("/:id/status", updateLeaveStatus);

module.exports = router;
