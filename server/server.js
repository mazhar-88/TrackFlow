import dotenv from "dotenv";
dotenv.config(); // .env file load karega

import http from "http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT;

const server = http.createServer(app);

initSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
