import { Socket } from "socket.io-client";

export interface Messages {
  username: string;
  message: string;
}

export interface ConnectState {
  nickname: string;
  socket: Socket | null;
  isConnect: boolean;
  actions: {
    setNickname: (nickname: string) => void;
    setSocket: (socket: Socket | null) => void;
    setIsConnect: (isConnect: boolean) => void;
  };
}
