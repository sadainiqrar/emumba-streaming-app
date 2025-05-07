import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Chat } from '../../types';
import { getChatSocket } from '../../services/socket';
import ChatMessage from './ChatMessage';

interface ChatBoxProps {
  streamId: string;
}

const ChatBox = ({ streamId }: ChatBoxProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const chatSocket = getChatSocket();
      
      // Join the stream's chat room
      chatSocket.emit('joinStream', streamId);
      
      // Listen for new messages
      chatSocket.on('receiveMessage', (message: Chat) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      
      // Clean up on unmount
      return () => {
        chatSocket.off('receiveMessage');
        chatSocket.emit('leaveStream', streamId);
      };
    } catch (err) {
      console.error('Error connecting to chat:', err);
      setError('Failed to connect to chat. Please refresh the page.');
    }
  }, [streamId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    try {
      const chatSocket = getChatSocket();
      
      chatSocket.emit('sendMessage', {
        streamId,
        userId: user.id,
        message: newMessage,
      });
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Live Chat</h3>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-2 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No messages yet. Be the first to say something!
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isCurrentUser={message.user?.id === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            disabled={!user}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
            disabled={!user || !newMessage.trim()}
          >
            Send
          </button>
        </div>
        {!user && (
          <p className="text-sm text-gray-500 mt-2">
            You need to be signed in to chat.
          </p>
        )}
      </form>
    </div>
  );
};

export default ChatBox;
