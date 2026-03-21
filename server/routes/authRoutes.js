const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, deleteAccount, sendOTP, resetPasswordWithOTP } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);

router.post("/forgot-password", sendOTP);
router.post("/reset-password", resetPasswordWithOTP);

module.exports = router;