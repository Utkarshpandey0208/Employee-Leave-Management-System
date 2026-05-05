const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    days: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.employeeId = ret.employeeId.toString();
        ret.status = ret.status.charAt(0).toUpperCase() + ret.status.slice(1);
        ret.fromDate = ret.fromDate.toISOString().slice(0, 10);
        ret.toDate = ret.toDate.toISOString().slice(0, 10);
        ret.appliedAt = ret.createdAt;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model("Leave", leaveSchema);
