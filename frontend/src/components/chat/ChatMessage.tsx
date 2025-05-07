import { Chat } from '../../types';

interface ChatMessageProps {
  message: Chat;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  const formattedTime = new Date(message.sentAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`mb-3 ${isCurrentUser ? 'text-right' : ''}`}>
      <div
        className={`inline-block max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser
            ? 'bg-blue-100 text-blue-900'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {!isCurrentUser && (
          <div className="font-semibold text-sm">
            {message.user?.name || 'Anonymous'}
          </div>
        )}
        <div className="text-sm">{message.message}</div>
        <div className="text-xs text-gray-500 mt-1">{formattedTime}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
