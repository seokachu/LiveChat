"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUserName] = useState("");
  const router = useRouter();

  //NOTE - 소켓 연결 함수
  const connectToChatServer = () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const _socket = io(serverUrl!, {
      autoConnect: false,
      query: {
        username,
      },
    });
    _socket.connect();
    setSocket(_socket);
    router.push("/chat");
  };

  return (
    <>
      <h1>입장하기</h1>
      <form>
        <label htmlFor="nickname">닉네임을 입력해 주세요</label>
        <input
          value={username}
          placeholder="닉네임을 입력해 주세요."
          onChange={(e) => setUserName(e.target.value)}
        />
        <button type="button" onClick={connectToChatServer} socket={socket}>
          입장하기
        </button>
      </form>
    </>
  );
}
