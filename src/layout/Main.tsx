"use client";

import {
  useConnectActions,
  useNickname,
  useSocket,
} from "@/store/connect-store";
import { Messages } from "@/types";
import renderMessageList from "@/utils/ChatListItem";
import React, { useCallback, useEffect, useState } from "react";
import S from "@/style/main.module.css";
import { toast } from "react-toastify";

const Main = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const nickname = useNickname();
  const { setIsConnect } = useConnectActions();
  const socket = useSocket();

  //NOTE - 접속중, 미접속 표시
  const onConnected = useCallback(() => {
    console.log("프론트 들어왔습니다.");
    setIsConnect(true);
  }, [setIsConnect]);

  const onDisConnected = useCallback(() => {
    console.log("프론트 나갔습니다");
    setIsConnect(false);
  }, [setIsConnect]);

  //NOTE - 실시간 message 리스트 보여주기
  const onMessageReceived = useCallback((msg: Messages) => {
    console.log("msg", msg);
    setMessages((prev) => [...prev, msg]);
  }, []);

  //NOTE - 메세지 전송
  const sendMessageToChatServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) {
      toast.error("내용을 입력해 주세요.");
      return;
    } else {
      socket?.emit(
        "message",
        { username: nickname, message: userInput },
        (msg: Messages) => {
          console.log(msg);
        }
      );
      setUserInput("");
    }
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
  }, [socket, onConnected, onDisConnected, onMessageReceived]);

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className={S.mainWrapper}>
      <main className={S.main}>
        <ul>{renderMessageList(messages, nickname)}</ul>
        <form onSubmit={sendMessageToChatServer}>
          <input
            value={userInput}
            placeholder="내용을 입력해 주세요."
            onChange={(e) => setUserInput(e.target.value)}
            autoFocus
          />
          <button>전송</button>
        </form>
      </main>
    </div>
  );
};

export default Main;
