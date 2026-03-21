const express = require("express");
const router = express.Router();
const {
  submitRequest,
  getMyRequests,
  getRequestById,
  trackRequest,
} = require("../controllers/requestcontroller");
const { protect } = require("../middleware/authmiddleware");
const { upload } = require("../middleware/uploadmiddleware");

router.post("/", protect, upload.array("documents", 5), submitRequest);
router.get("/", protect, getMyRequests);
router.get("/track/:requestId", protect, trackRequest);
router.get("/:id", protect, getRequestById);

module.exports = router;