import { io } from "socket.io-client";
import { useAuthStore } from "@/store/auth.store";

let socket = null;

export function getSocket() {
  if (!socket) {
    const token = useAuthStore.getState().token;
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000", {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => console.log("[Socket] Connected:", socket.id));
    socket.on("disconnect", (reason) => console.log("[Socket] Disconnected:", reason));
    socket.on("connect_error", (err) => console.error("[Socket] Error:", err.message));
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
