import React from 'react';
import { MessageSender } from '@/types/chat';

interface ChatBubbleProps {
  sender: MessageSender;
  content: string;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ sender, content, timestamp }) => {
  const isAi = sender === 'ai';

  return (
    <div
      className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-3 text-sm sm:text-base leading-relaxed break-words shadow-sm transition-all ${
        isAi
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl rounded-tl-sm'
          : 'bg-primary text-white rounded-2xl rounded-tr-sm font-medium'
      }`}
    >
      <p className="whitespace-pre-wrap">{content}</p>
      {timestamp && (
        <span
          className={`block text-[10px] mt-1.5 font-medium ${
            isAi ? 'text-gray-400 dark:text-gray-500 text-left' : 'text-blue-100 text-right'
          }`}
        >
          {timestamp}
        </span>
      )}
    </div>
  );
};
