import http from "http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;

// http server banaya
const server = http.createServer(app);

// socket init
initSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
