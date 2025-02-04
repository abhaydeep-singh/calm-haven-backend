import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import mongoose from "mongoose"; 
import url from 'url';
import { Message } from "./models/message.models.js"; // Import the Message model
import userRouter from "./routes/user.routes.js";
import infoRouter from "./routes/info.routes.js";
import blogRouter from "./routes/blog.routes.js";
import aptRouter from "./routes/apt.routes.js";

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app); // Create HTTP server

// WebSocket server initialization
const wss = new WebSocketServer({ noServer: true });

// Store active WebSocket connections
const clients = new Map(); // A map of userId => WebSocket connection

// WebSocket connection handling
wss.on('connection', (ws, request) => {
  const userId = request.userId;
  clients.set(userId, ws);

  console.log(`WebSocket connection established with userId: ${userId}`);

  // Handle incoming messages
  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message); // Assuming you send JSON data
      const { senderId, receiverId, text } = parsedMessage;

      console.log(`Received message from ${senderId} to ${receiverId}: ${text}`);

      // Save the message to the database
      const newMessage = new Message({
        senderId,
        reciverId: receiverId, // Make sure the field matches the model (reciverId)
        message: text
      });

      await newMessage.save(); // Save the message to the DB
      console.log("Message saved to the database.");

      // Find the WebSocket connection for the recipient
      const recipientWs = clients.get(receiverId);

      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        // Send the message to the intended recipient
        recipientWs.send(
          JSON.stringify({
            senderId,
            text,
          })
        );
        console.log(`Message sent to userId: ${receiverId}`);
      } else {
        console.log(`Recipient userId: ${receiverId} not connected`);
      }
    } catch (error) {
      console.error("Error processing the message:", error);
    }
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    clients.delete(userId);
    console.log(`WebSocket connection closed for userId: ${userId}`);
  });
});

// Handle WebSocket upgrades
server.on("upgrade", (request, socket, head) => {
  const parsedUrl = url.parse(request.url, true);
  const userId = parsedUrl.query.userId;

  if (!userId) {
    socket.destroy(); // If userId is not provided, close the socket
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    request.userId = userId; // Pass userId to WebSocket connection
    wss.emit("connection", ws, request);
  });
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", //FIXME: Frontend origin link
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json()); // Parse requests of content-type - application/json

// Declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/info", infoRouter);
app.use("/api/v1/blog",blogRouter); // /add /delete /get-all
app.use("/api/v1/booking",aptRouter); //add /delete /update

export { app, server }; // Export both app and server
