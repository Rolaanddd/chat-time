//server.js

import { createServer } from "http";
//import { parse } from "url"; // Only keep if used
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.NEXTAUTH_URL
          : "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("sendMessage", (data) => {
      const { senderId, receiverId, text, messageId, timestamp } = data;

      io.to(senderId).to(receiverId).emit("newMessage", {
        id: messageId,
        senderId,
        receiverId,
        text,
        timestamp,
      });
    });

    socket.on("typing", (data) => {
      const { senderId, receiverId, isTyping } = data;
      socket.to(receiverId).emit("userTyping", {
        userId: senderId,
        isTyping,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
