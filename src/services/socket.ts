import { io } from "socket.io-client";
const ip = import.meta.env.VITE_SERVER_URL;

const socket = io(ip, {
  withCredentials: true,
});

export default socket;
