import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

server.listen(PORT, () => {
  console.log(`서버와 연결되었습니다. 포트: ${PORT}`);
});

app.get("/api", (_, res) => res.send("api"));
app.get("/message", (_, res) => res.send("express"));

io.on("connection", (client) => {
  const connectedClientUserName = client.handshake.query.username;
  console.log(`사용자가 들어왔습니다. ${connectedClientUserName}`);

  //NOTE - 전체 메세지
  client.broadcast.emit("message", {
    username: "",
    message: `${connectedClientUserName} 님이 방에 들어왔습니다.`,
  });

  //NOTE - 사용자가 나갔을 때
  client.on("disconnect", () => {
    io.emit("message", {
      username: "",
      message: `${connectedClientUserName} 님이 나갔습니다.`,
    });
  });

  //NOTE - 사용자가 보내는 message 수신
  client.on("message", (msg) => {
    console.log(`보낸 사용자. ${connectedClientUserName}`);
    console.log(msg);

    //클라이언트 메세지 보내주기
    io.emit("message", {
      username: msg.username,
      message: msg.message,
    });
  });
});
