import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 3000,

  timeout: 10000,

  transports: ["websocket", "polling"],
});
