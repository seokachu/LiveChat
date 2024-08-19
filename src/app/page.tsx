"use client";

import { useConnectActions, useNickname } from "@/store/connect-store";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import S from "@/style/enter.module.css";
import Style from "@/style/common.module.css";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const { setIsConnect, setNickname, setSocket } = useConnectActions();
  const username = useNickname();
  console.log(username);

  //NOTE - 소켓 연결 함수
  const connectToChatServer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("닉네임을 입력해 주세요.");
      return;
    } else {
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
      toast.success("입장에 성공했습니다.");
    }
  };

  return (
    <div className={Style.container}>
      <main className={S.main}>
        <h1 className="gamjaFlowerRegular">seokachu&apos;s Chat</h1>
        <form onSubmit={connectToChatServer}>
          <label htmlFor="nickname">닉네임을 입력하고 입장해 주세요!</label>
          <input
            id="nickname"
            value={username}
            placeholder="닉네임을 입력해 주세요."
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
            maxLength={10}
          />
          <button type="submit">입장하기</button>
        </form>
      </main>
    </div>
  );
}
