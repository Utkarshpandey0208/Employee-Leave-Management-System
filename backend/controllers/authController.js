const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials for selected role" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials for selected role" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
