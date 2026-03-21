const Request = require("../models/Request");

// @route   POST /api/requests
// Student submits a new request
const submitRequest = async (req, res) => {
  const { type, description, priority } = req.body;

  const documents = req.files
    ? req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        name: file.originalname,
      }))
    : [];

  const request = await Request.create({
    student: req.user._id,
    type,
    description,
    priority: priority || "NORMAL",
    documents,
    statusHistory: [
      { status: "SUBMITTED", changedBy: req.user.name, changedAt: new Date() },
    ],
  });

  // Emit real-time event to admin room
  req.io.to("adminRoom").emit("newRequest", {
    message: `New request submitted: ${type}`,
    requestId: request.requestId,
  });

  res.status(201).json({ success: true, request });
};

// @route   GET /api/requests
// Student views their own requests
const getMyRequests = async (req, res) => {
  const requests = await Request.find({ student: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, requests });
};

// @route   GET /api/requests/:id
// Get single request by mongo id
const getRequestById = async (req, res) => {
  const request = await Request.findById(req.params.id).populate(
    "student",
    "name email studentId department"
  );

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  // Students can only view their own requests
  if (
    req.user.role === "student" &&
    request.student._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  res.json({ success: true, request });
};

// @route   GET /api/requests/track/:requestId
// Track by requestId (REQ00001)
const trackRequest = async (req, res) => {
  const request = await Request.findOne({
    requestId: req.params.requestId,
  }).populate("student", "name email studentId");

  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  res.json({ success: true, request });
};

module.exports = {
  submitRequest,
  getMyRequests,
  getRequestById,
  trackRequest,
};