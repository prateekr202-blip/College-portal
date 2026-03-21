const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
require("express-async-errors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const adminRoutes = require("./routes/adminRoutes");
const socketHandler = require("./socket/sockethandler");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = process.env.CLIENT_URL === "*"
  ? "*"
  : [
      "http://localhost:3000",
      process.env.CLIENT_URL,
    ].filter(Boolean);

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://college-portal-iota.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.json({ message: "Campus Portal API running" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));