'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import candidatesData from '@/data/candidates.json';
import { Candidate } from '@/types/candidate';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from '@/components/interview/ChatHeader';
import { MessageList } from '@/components/interview/MessageList';
import { ChatInput } from '@/components/interview/ChatInput';

function InterviewChatContent() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');

  // Find candidate by ID or fallback to default placeholder
  const candidate: Candidate = useMemo(() => {
    if (candidateId) {
      const found = (candidatesData as Candidate[]).find((c) => c.id === Number(candidateId));
      if (found) return found;
    }
    return {
      id: 1,
      name: 'John Doe',
      role: 'Frontend Developer',
      experience: '2 Years',
    };
  }, [candidateId]);

  const { messages, inputMessage, setInputMessage, addMessage } = useChat();

  const handleSendMessage = (text: string) => {
    addMessage(text, 'candidate');
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-gray-50/50 dark:bg-gray-950 overflow-hidden font-sans">
      {/* Top Navbar */}
      <ChatHeader
        candidateName={candidate.name}
        candidateRole={candidate.role}
        currentQuestion={2}
        totalQuestions={10}
      />

      {/* Scrollable Conversation Feed */}
      <MessageList messages={messages} candidateName={candidate.name} />

      {/* Fixed Bottom Input Bar */}
      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={handleSendMessage}
      />
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-500">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20" />
            <p className="text-sm font-medium">Loading interview session...</p>
          </div>
        </div>
      }
    >
      <InterviewChatContent />
    </Suspense>
  );
}
