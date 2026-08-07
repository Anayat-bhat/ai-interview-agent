import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { ChatBubble } from './ChatBubble';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  candidateName?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, candidateName }) => {
  const isAi = message.sender === 'ai';

  const candidateInitials = (candidateName || 'Candidate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex items-start gap-3 w-full my-3 sm:my-4 ${
        isAi ? 'flex-row justify-start' : 'flex-row-reverse justify-start'
      }`}
      aria-label={`${isAi ? 'AI Interviewer' : candidateName || 'Candidate'} message`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 shadow-sm border ${
          isAi
            ? 'bg-gradient-to-br from-indigo-500 to-primary text-white border-indigo-200/50'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-200/50'
        }`}
        aria-hidden="true"
      >
        {isAi ? (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : candidateInitials ? (
          <span className="text-xs sm:text-sm font-bold tracking-wider">{candidateInitials}</span>
        ) : (
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </div>

      {/* Message Bubble */}
      <ChatBubble sender={message.sender} content={message.content} timestamp={message.timestamp} />
    </div>
  );
};
