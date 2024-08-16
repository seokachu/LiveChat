import { Server } from "socket.io";
import express from "express";
import http from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev }); // Next.js 앱 초기화
const handle = nextApp.getRequestHandler(); // Next.js 요청 핸들러

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Next.js 앱이 준비되면 서버를 시작합니다
nextApp
  .prepare()
  .then(() => {
    app.get("/api", (_, res) => res.send("api"));
    app.get("/message", (_, res) => res.send("express"));

    // Next.js 핸들러 연결
    app.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, () => {
      console.log(`서버와 연결되었습니다. 포트: ${PORT}`);
    });

    io.on("connection", (client) => {
      const connectedClientUserName = client.handshake.query.username;
      console.log(`사용자가 들어왔습니다. ${connectedClientUserName}`);

      // 전체 메시지 브로드캐스트
      client.broadcast.emit("message", {
        username: "",
        message: `${connectedClientUserName} 님이 방에 들어왔습니다.`,
      });

      // 사용자가 나갔을 때 처리
      client.on("disconnect", () => {
        io.emit("message", {
          username: "",
          message: `${connectedClientUserName} 님이 나갔습니다.`,
        });
      });

      // 사용자가 보내는 메시지 수신
      client.on("message", (msg) => {
        console.log(`보낸 사용자: ${connectedClientUserName}`);
        console.log(msg);

        // 클라이언트에게 메시지 전송
        io.emit("message", {
          username: msg.username,
          message: msg.message,
        });
      });
    });
  })
  .catch((err) => {
    console.error("Next.js 준비 중 오류 발생:", err);
  });
