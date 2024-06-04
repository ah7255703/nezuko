"use client";

import { env } from "@/env.mjs";
import { io, Socket } from "socket.io-client";

export const socket: Socket = io(env.NEXT_PUBLIC_DIRECT_BACKEND_URL, {
    transports: ["websocket"],
});