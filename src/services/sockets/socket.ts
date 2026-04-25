import { io } from "socket.io-client";

export const socket = io("http://localhost:8080", {
  autoConnect: false,
  withCredentials: true,

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 3000,

  timeout: 10000,

  transports: ["websocket", "polling"],
});
