const { sendStatusUpdateEmail } = require("../utils/emailservice");

const Request = require("../models/request");

// @route   GET /api/admin/requests
// Admin gets all requests with filters
const getAllRequests = async (req, res) => {
  const { status, type, priority, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;
  if (search) filter.requestId = { $regex: search, $options: "i" };

  const requests = await Request.find(filter)
    .populate("student", "name email studentId department")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: requests.length, requests });
};

// @route   PUT /api/admin/requests/:id/status
// Admin updates request status
const updateRequestStatus = async (req, res) => {
  const { status, remark } = req.body;

  const request = await Request.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  request.status = status;
  request.statusHistory.push({
    status,
    changedBy: req.user.name,
    changedAt: new Date(),
  });

  if (remark) {
    request.remarks.push({
      by: req.user.name,
      byId: req.user._id,
      text: remark,
    });
  }

  await request.save();

  // Send email notification to student
  const student = await require("../models/user").findById(request.student);
  if (student?.email) {
    sendStatusUpdateEmail({
      to: student.email,
      studentName: student.name,
      requestId: request.requestId,
      requestType: request.type,
      status: request.status,
      remark: remark || null,
    }).catch(err => console.error("Status email failed:", err));
  }

  // Emit real-time update to the student's room
  req.io.to(request.student.toString()).emit("statusUpdate", {
    requestId: request.requestId,
    status: request.status,
    message: `Your request ${request.requestId} is now ${status}`,
    remark: remark || null,
  });

  // Also notify admin room
  req.io.to("adminRoom").emit("requestUpdated", {
    requestId: request.requestId,
    status: request.status,
  });

  res.json({ success: true, request });
};

// @route   POST /api/admin/requests/:id/remark
// Admin adds a remark without changing status
const addRemark = async (req, res) => {
  const { text } = req.body;

  const request = await Request.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ success: false, message: "Request not found" });
  }

  request.remarks.push({
    by: req.user.name,
    byId: req.user._id,
    text,
  });

  await request.save();

  req.io.to(request.student.toString()).emit("newRemark", {
    requestId: request.requestId,
    remark: text,
    by: req.user.name,
  });

  res.json({ success: true, request });
};

// @route   GET /api/admin/analytics
// Admin dashboard analytics
const getAnalytics = async (req, res) => {
  const totalRequests = await Request.countDocuments();
  const pending = await Request.countDocuments({ status: "SUBMITTED" });
  const underReview = await Request.countDocuments({ status: "UNDER_REVIEW" });
  const completed = await Request.countDocuments({ status: "COMPLETED" });
  const rejected = await Request.countDocuments({ status: "REJECTED" });

  const byType = await Request.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const byStatus = await Request.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    analytics: {
      totalRequests,
      pending,
      underReview,
      completed,
      rejected,
      byType,
      byStatus,
    },
  });
};

module.exports = {
  getAllRequests,
  updateRequestStatus,
  addRemark,
  getAnalytics,
};