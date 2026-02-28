import { io, Socket } from "socket.io-client";
import type { SocketCommand } from "@hq/shared";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SERVER_URL, { autoConnect: false });
  }
  return socket;
}

export function joinSession(params: {
  campaignId: string;
  sessionId?: string;
  role: "gm" | "player";
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = getSocket();
    s.connect();
    s.emit("join", params);
    s.once("joined", () => resolve());
    s.once("connect_error", reject);
  });
}

export function sendCommand(cmd: SocketCommand) {
  getSocket().emit("command", cmd);
}

export function onStateUpdate(handler: (update: any) => void) {
  const s = getSocket();
  s.on("state_update", handler);
  return () => s.off("state_update", handler);
}

export function onError(handler: (err: { message: string }) => void) {
  const s = getSocket();
  s.on("error", handler);
  return () => s.off("error", handler);
}
