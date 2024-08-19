import { Socket } from "socket.io-client";
import { create } from "zustand";

interface ConnectState {
  nickname: string;
  socket: Socket | null;
  actions: {
    setNickname: (nickname: string) => void;
    setSocket: (socket: Socket | null) => void;
  };
}

const useConnectStore = create<ConnectState>((set) => ({
  nickname: "",
  socket: null,

  actions: {
    setNickname: (nickname: string) => set({ nickname }),
    setSocket: (socket: Socket | null) => set({ socket }),
  },
}));

export const useNickname = () => useConnectStore((state) => state.nickname);

export const useConnectActions = () =>
  useConnectStore((state) => state.actions);
