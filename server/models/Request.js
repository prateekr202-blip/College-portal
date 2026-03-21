const mongoose = require("mongoose");

const REQUEST_TYPES = [
  "Bonafide Certificate",
  "Transcript",
  "ID Card",
  "Hostel Letter",
  "Migration Certificate",
  "Character Certificate",
  "Fee Receipt",
  "Other",
];

const STATUS = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "IN_PROGRESS",
  "APPROVED",
  "REJECTED",
  "READY_FOR_COLLECTION",
  "COMPLETED",
];

const remarkSchema = new mongoose.Schema({
  by: { type: String, required: true },
  byId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const requestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: REQUEST_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: STATUS,
      default: "SUBMITTED",
    },
    description: {
      type: String,
      trim: true,
    },
    documents: [
      {
        url: String,
        publicId: String,
        name: String,
      },
    ],
    remarks: [remarkSchema],
    priority: {
      type: String,
      enum: ["LOW", "NORMAL", "HIGH"],
      default: "NORMAL",
    },
    statusHistory: [
      {
        status: String,
        changedBy: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate requestId before saving
requestSchema.pre("save", async function () {
  if (!this.requestId) {
    const count = await mongoose.model("Request").countDocuments();
    this.requestId = `REQ${String(count + 1).padStart(5, "0")}`;
  }
});

module.exports = mongoose.model("Request", requestSchema);