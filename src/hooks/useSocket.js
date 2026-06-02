import { useEffect } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";

export function useSocket() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    getSocket();
  }, [isAuthenticated]);

  const socket = isAuthenticated ? getSocket() : null;
  return { socket, disconnect: disconnectSocket };
}
