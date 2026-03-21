const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Student joins their own room using their userId
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Admin joins a global admin room
    socket.on("joinAdmin", () => {
      socket.join("adminRoom");
      console.log("Admin joined adminRoom");
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;