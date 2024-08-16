"use client";
import { Messages } from "@/types";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const Main = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUserName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);

  //NOTE - 소켓 연결 함수
  const connectToChatServer = () => {
    const _socket = io("http://localhost:4000", {
      autoConnect: false,
      query: {
        username,
      },
    });
    _socket.connect();
    setSocket(_socket);
  };

  const disConnectToChatServer = () => {
    console.log("사용자가 나갔습니다.");
    socket?.disconnect();
  };

  //NOTE - 접속중, 미접속 표시
  const onConnected = () => {
    console.log("프론트 들어왔습니다.");
    setIsConnected(true);
  };

  const onDisConnected = () => {
    console.log("프론트 나갔습니다");
    setIsConnected(false);
  };

  //NOTE - 메세지 전송
  const sendMessageToChatServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit(
      "message",
      { username, message: userInput },
      (msg: Messages) => {
        console.log(msg);
      }
    );
  };

  //NOTE - 실시간 message 리스트 보여주기
  const onMessageReceived = (msg: Messages) => {
    console.log("msg", msg);
    setMessages((prev) => [...prev, msg]);
  };

  //NOTE - message list 뿌려주기
  const messageList = messages.map((msg, index) => (
    <li key={index}>
      {msg.username} : {msg.message}
    </li>
  ));

  //NOTE - socket 정보 받아오기
  useEffect(() => {
    socket?.on("connect", onConnected);
    socket?.on("disconnect", onDisConnected);
    socket?.on("message", onMessageReceived);

    return () => {
      socket?.off("connect", onConnected);
      socket?.off("disconnect", onDisConnected);
      socket?.off("message", onMessageReceived);
    };
  }, [socket]);

  return (
    <div>
      <h1>유저 : {username}</h1>
      <h2>현재 접속 상태 : {isConnected ? "접속중" : "미접속"}</h2>
      <input value={username} onChange={(e) => setUserName(e.target.value)} />
      <button
        onClick={() => {
          connectToChatServer();
        }}
      >
        접속
      </button>
      <button
        onClick={() => {
          disConnectToChatServer();
        }}
      >
        접속종료
      </button>
      <ul>{messageList}</ul>
      <form onSubmit={sendMessageToChatServer}>
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button>보내기</button>
      </form>
    </div>
  );
};

export default Main;
