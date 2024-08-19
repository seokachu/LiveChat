import { Server } from "socket.io";
import express from "express";
import http from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev }); // Next.js 앱 초기화
const handle = nextApp.getRequestHandler(); // Next.js 요청 핸들러
const app = express();
const server = http.createServer(app);
const PORT = 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

nextApp.prepare().then(() => {
  // Next.js 요청 핸들러 설정
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  io.on("connection", (client) => {
    const connectedClientUserName = client.handshake.query.username;
    console.log(`사용자가 들어왔습니다. ${connectedClientUserName}`);

    // 전체 메세지
    client.broadcast.emit("message", {
      username: "",
      message: `${connectedClientUserName} 님이 들어왔습니다.`,
    });

    // 사용자가 나갔을 때
    client.on("disconnect", () => {
      io.emit("message", {
        username: "",
        message: `${connectedClientUserName} 님이 나갔습니다.`,
      });
    });

    // 사용자가 보내는 message 수신
    client.on("message", (msg) => {
      console.log(`보낸 사용자. ${connectedClientUserName}`);
      console.log(msg);

      // 클라이언트 메세지 보내주기
      io.emit("message", {
        username: msg.username,
        message: msg.message,
      });
    });
  });

  // 서버 시작
  server.listen(PORT, () => {
    console.log(`서버와 연결되었습니다. 포트: ${PORT}`);
  });
});
