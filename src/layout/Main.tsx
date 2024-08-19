"use client";

import {
  useConnectActions,
  useNickname,
  useSocket,
} from "@/store/connect-store";
import { Messages } from "@/types";
import renderMessageList from "@/utils/ChatListItem";
import React, { useEffect, useState } from "react";

const Main = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const nickname = useNickname();
  const { setIsConnect } = useConnectActions();
  const socket = useSocket();

  //NOTE - 접속중, 미접속 표시
  const onConnected = () => {
    console.log("프론트 들어왔습니다.");
    setIsConnect(true);
  };

  const onDisConnected = () => {
    console.log("프론트 나갔습니다");
    setIsConnect(false);
  };

  //NOTE - 메세지 전송
  const sendMessageToChatServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUserInput("");
    socket?.emit(
      "message",
      { username: nickname, message: userInput },
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
    <main>
      <ul>{renderMessageList(messages)}</ul>
      <form onSubmit={sendMessageToChatServer}>
        <input
          value={userInput}
          placeholder="내용을 입력해 주세요."
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button>보내기</button>
      </form>
    </main>
  );
};

export default Main;
