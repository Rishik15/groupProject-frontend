import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
});
