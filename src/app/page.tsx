"use client";

import { useConnectActions, useNickname } from "@/store/connect-store";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

export default function Home() {
  const router = useRouter();
  const { setIsConnect, setNickname, setSocket } = useConnectActions();
  const username = useNickname();
  console.log(username);

  //NOTE - 소켓 연결 함수
  const connectToChatServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const _socket = io(serverUrl!, {
      autoConnect: false,
      query: {
        username,
      },
    });
    _socket.connect();
    setSocket(_socket);
    setIsConnect(true);
    router.push("/chat");
  };

  return (
    <main>
      <h1>입장하기</h1>
      <form onSubmit={connectToChatServer}>
        <label htmlFor="nickname">닉네임을 입력해 주세요</label>
        <input
          value={username}
          placeholder="닉네임을 입력해 주세요."
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit">입장하기</button>
      </form>
    </main>
  );
}
