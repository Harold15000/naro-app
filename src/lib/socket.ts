import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_URL || 'https://api.naroapp.net', {
  auth: { token: localStorage.getItem('token') },
  withCredentials: true,
  transports: ['websocket'],
  autoConnect: false,
});
