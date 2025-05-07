import { io, Socket } from 'socket.io-client';

let streamSocket: Socket | null = null;
let chatSocket: Socket | null = null;

export const initializeSockets = (token: string) => {
  // Get the base URL from environment or use default
  const baseURL = import.meta.env.VITE_API_URL || '';

  // Initialize stream socket
  streamSocket = io(`${baseURL}/stream`, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  // Initialize chat socket
  chatSocket = io(`${baseURL}/chat`, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return { streamSocket, chatSocket };
};

export const getStreamSocket = () => {
  if (!streamSocket) {
    throw new Error('Stream socket not initialized. Call initializeSockets first.');
  }
  return streamSocket;
};

export const getChatSocket = () => {
  if (!chatSocket) {
    throw new Error('Chat socket not initialized. Call initializeSockets first.');
  }
  return chatSocket;
};

export const disconnectSockets = () => {
  if (streamSocket) {
    streamSocket.disconnect();
    streamSocket = null;
  }

  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
  }
};
