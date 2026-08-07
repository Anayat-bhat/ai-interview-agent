import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessageType[];
  candidateName?: string;
  isThinking?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  candidateName,
  isThinking = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} candidateName={candidateName} />
      ))}
      <TypingIndicator isVisible={isThinking} />
      <div ref={bottomRef} />
    </div>
  );
};
