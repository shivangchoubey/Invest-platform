import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Message from "./models/message.js";
import { canAccessChat } from "./utils/access.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Authentication Middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error: No token provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) return next(new Error("Authentication error: User not found"));
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Authenticated client connected: ${socket.id} (${socket.user.name})`);

    // Join a specific startup's chat room
    socket.on("join-room", async (startupId) => {
      try {
        // Authorization Check
        const access = await canAccessChat(socket.user, startupId);
        if (!access.allowed) {
          return socket.emit("error-message", access.message);
        }

        socket.join(startupId);
        console.log(`User ${socket.user.name} joined room: ${startupId}`);
      } catch (error) {
        console.error("Socket join-room error:", error);
      }
    });

    // Handle sending a message
    socket.on("send-message", async (data) => {
      try {
        const { startupId, content } = data;

        // Double check access before saving/broadcasting
        const access = await canAccessChat(socket.user, startupId);
        if (!access.allowed) return;

        // 1. Save to database
        const newMessage = await Message.create({
          startup: startupId,
          sender: socket.user._id,
          content: content
        });

        // Populate sender info before broadcasting
        await newMessage.populate("sender", "name email role");

        // 2. Broadcast to everyone in the room
        io.to(startupId).emit("receive-message", newMessage);
      } catch (error) {
        console.error("Socket send-message error:", error);
      }
    });

    socket.on("clear-chat", async (startupId) => {
      // Only founders check is already in the API, but for sockets we can double check
      if (socket.user.role === "FOUNDER") {
        io.to(startupId).emit("chat-cleared");
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
