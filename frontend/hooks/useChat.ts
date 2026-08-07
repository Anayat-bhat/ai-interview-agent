import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { initialInterviewMessages } from '@/data/interviewMessages';

export function useChat(initialMessages: ChatMessage[] = initialInterviewMessages) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState<string>('');

  const addMessage = useCallback((content: string, sender: 'ai' | 'candidate' = 'candidate') => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
  }, []);

  const clearInput = useCallback(() => {
    setInputMessage('');
  }, []);

  const resetChat = useCallback(() => {
    setMessages(initialInterviewMessages);
    setInputMessage('');
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    addMessage,
    clearInput,
    resetChat,
  };
}
