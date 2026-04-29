import { io } from 'socket.io-client';

// In production, connect directly to the backend server.
// In development, connect to localhost:5000.
const SOCKET_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'http://187.127.145.211:5000';

const socket = io(SOCKET_URL, {
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  transports: ['websocket', 'polling'],
});

export default socket;
