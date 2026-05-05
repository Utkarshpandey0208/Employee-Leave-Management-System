require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

const allowedOrigins = ["http://localhost:5173"];

if (process.env.CLIENT_URL) {
  allowedOrigins[allowedOrigins.length] = process.env.CLIENT_URL;
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Employee Leave Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/employees", employeeRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Server error"
  });
});

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB connection error:", err));
  
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
