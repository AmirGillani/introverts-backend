const http = require("http");
const { Server } = require("socket.io");

let io; // Global for reuse
const users = new Map(); // Shared across functions

module.exports.createConnection = function (app) {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: "*", // Your React app
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Store userId => socket.id
    socket.on("register", (userId) => {
      users.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (let [userId, id] of users.entries()) {
        if (id === socket.id) {
          users.delete(userId);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });

  return server; // return the server so you can .listen() elsewhere
};

module.exports.sendNotification = function (userId, message) {
  const socketId = users.get(userId);
  if (socketId && io) {
    io.to(socketId).emit("notification", message);
  } else {
    console.log(`User ${userId} not connected`);
  }
};
