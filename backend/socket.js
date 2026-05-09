import { Server } from "socket.io";
import Message from "./models/message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Assuming standard vite port, check frontend if diff
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Join a specific startup's chat room
    socket.on("join-room", (startupId) => {
      socket.join(startupId);
      console.log(`User ${socket.id} joined room: ${startupId}`);
    });

    // Handle sending a message
    socket.on("send-message", async (data) => {
      try {
        const { startupId, senderId, content } = data;

        // 1. Save to database
        const newMessage = await Message.create({
          startup: startupId,
          sender: senderId,
          content: content
        });

        // Populate sender info before broadcasting
        await newMessage.populate("sender", "name email role");

        // 2. Broadcast to everyone in the room (including sender so they see it instantly)
        io.to(startupId).emit("receive-message", newMessage);
      } catch (error) {
        console.error("Socket send-message error:", error);
      }
    });

    socket.on("clear-chat", (startupId) => {
      // Broadcast to everyone in the room to clear their chat UI
      io.to(startupId).emit("chat-cleared");
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
