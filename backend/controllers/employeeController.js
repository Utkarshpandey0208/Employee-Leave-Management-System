const bcrypt = require("bcrypt");

const User = require("../models/User");

const addEmployee = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Employee with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "employee"
    });

    res.status(201).json({
      message: "Employee added successfully",
      employee: employee.toJSON()
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Employee with this email already exists" });
    }

    next(error);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await User.aggregate([
      {
        $match: {
          role: "employee"
        }
      },
      {
        $lookup: {
          from: "leaves",
          localField: "_id",
          foreignField: "employeeId",
          as: "approvedLeaves",
          pipeline: [
            {
              $match: {
                status: "approved"
              }
            }
          ]
        }
      },
      {
        $addFields: {
          id: { $toString: "$_id" },
          leavesTaken: { $sum: "$approvedLeaves.days" }
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          password: 0,
          approvedLeaves: 0,
          createdAt: 0,
          updatedAt: 0
        }
      },
      {
        $sort: {
          name: 1
        }
      }
    ]);

    res.json(employees);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllEmployees, addEmployee };
