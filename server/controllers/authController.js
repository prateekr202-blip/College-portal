const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Request = require("../models/request");
const { sendWelcomeEmail } = require("../utils/emailservice");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, studentId, department, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  const user = await User.create({
    name, email, password,
    role: role || "student",
    studentId, department, phone,
  });

  sendWelcomeEmail({
    to: user.email,
    studentName: user.name,
  }).catch(err => console.error("Welcome email failed:", err));

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      department: user.department,
      phone: user.phone,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      department: user.department,
      phone: user.phone,
    },
  });
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, phone, department, studentId, currentPassword, newPassword } = req.body;

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (department) user.department = department;
  if (studentId) user.studentId = studentId;

  if (currentPassword && newPassword) {
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
    user.password = newPassword;
  }

  await user.save();

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      department: user.department,
      phone: user.phone,
    },
  });
};

const deleteAccount = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: "Password is required" });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

  await Request.deleteMany({ student: req.user._id });
  await user.deleteOne();

  res.json({ success: true, message: "Account deleted successfully" });
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account found with this email" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.resetOTP = otp;
  user.resetOTPExpiry = expiry;
  await user.save();

  // Send OTP email
  await require("../utils/emailservice").sendOTPEmail({
    to: user.email,
    studentName: user.name,
    otp,
  });

  res.json({ success: true, message: "OTP sent to your email" });
};

const resetPasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP and new password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account found with this email" });

  if (!user.resetOTP || user.resetOTP !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.resetOTPExpiry < new Date()) {
    return res.status(400).json({ message: "OTP has expired. Please request a new one" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  user.password = newPassword;
  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successfully" });
};

module.exports = { registerUser, loginUser, getMe, updateProfile, deleteAccount, sendOTP, resetPasswordWithOTP };