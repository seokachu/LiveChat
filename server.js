import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(4000, () => {
  console.log("서버와 연결되었습니다. 4000포트입니다.");
});

app.get("/message", (_, res) => res.send("express"));

app.get("/api", (_, res) => {
  res.send("api");
});

io.on("connection", (client) => {
  client.broadcast.emit("message", {
    message: "",
  });
});
