const express = require("express");
const { getAllEmployees, addEmployee } = require("../controllers/employeeController");
const { verifyToken, checkAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllEmployees);
router.post("/add", verifyToken, checkAdmin, addEmployee);

module.exports = router;
