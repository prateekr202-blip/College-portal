const express = require("express");
const router = express.Router();
const {
  getAllRequests,
  updateRequestStatus,
  addRemark,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authmiddleware");

router.get("/requests", protect, adminOnly, getAllRequests);
router.put("/requests/:id/status", protect, adminOnly, updateRequestStatus);
router.post("/requests/:id/remark", protect, adminOnly, addRemark);
router.get("/analytics", protect, adminOnly, getAnalytics);

module.exports = router;