"use client";

import {
  useConnectActions,
  useIsConnect,
  useNickname,
  useSocket,
} from "@/store/connect-store";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import S from "@/style/header.module.css";

const Header = () => {
  const router = useRouter();
  const nickname = useNickname();
  const isConnect = useIsConnect();
  const { setNickname } = useConnectActions();
  const socket = useSocket();

  const disConnectToChatServer = () => {
    console.log("사용자가 나갔습니다.");
    socket?.disconnect();
    setNickname("");
    router.push("/");
    toast.success("접속 종료 성공!");
  };

  return (
    <div className={S.headerWrapper}>
      <header className={S.header}>
        <h1>내 닉네임 : {nickname}</h1>
        <h2>현재 접속 상태 : {isConnect ? "입장" : "미입장"}</h2>
        <button
          onClick={() => {
            disConnectToChatServer();
          }}
        >
          접속종료
        </button>
      </header>
    </div>
  );
};

export default Header;
