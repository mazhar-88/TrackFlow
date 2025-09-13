import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // production me yahan Vercel ka frontend URL dalna
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    // join session room
    socket.on("joinSession", ({ sessionCode, userId }) => {
      socket.join(sessionCode);
      console.log(`${userId} joined session ${sessionCode}`);
    });

    // share location
    socket.on("sendLocation", ({ sessionCode, userId, coords }) => {
      io.to(sessionCode).emit("locationUpdate", { userId, coords });
    });

    // disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
