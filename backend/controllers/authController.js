const { getEmployees, publicUser } = require("../models/dataStore");

const login = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  const user = getEmployees().find(
    (employee) =>
      employee.email.toLowerCase() === email.toLowerCase() &&
      employee.password === password &&
      employee.role === role
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials for selected role" });
  }

  res.json({
    user: publicUser(user),
    token: `mock-token-${user.id}-${Date.now()}`
  });
};

module.exports = { login };
