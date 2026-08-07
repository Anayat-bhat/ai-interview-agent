import { ChatMessage } from '@/types/chat';

export const initialInterviewMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'ai',
    content: 'Hello! Welcome to your AI technical interview. I will be guiding you through a series of technical questions today.',
    timestamp: '10:00 AM',
  },
  {
    id: 'msg_2',
    sender: 'candidate',
    content: "Thank you! I'm excited to be here and ready to begin.",
    timestamp: '10:01 AM',
  },
  {
    id: 'msg_3',
    sender: 'ai',
    content: 'Great. To start off, could you please introduce yourself and share a brief overview of your technical background?',
    timestamp: '10:01 AM',
  },
  {
    id: 'msg_4',
    sender: 'candidate',
    content: "I'm a frontend developer with two years of experience building scalable web applications using React, Next.js, TypeScript, and Tailwind CSS.",
    timestamp: '10:02 AM',
  },
  {
    id: 'msg_5',
    sender: 'ai',
    content: 'Excellent. Let’s dive into core concepts. Can you explain what the Virtual DOM is in React and why it improves rendering performance?',
    timestamp: '10:03 AM',
  },
  {
    id: 'msg_6',
    sender: 'candidate',
    content: 'The Virtual DOM is a lightweight, in-memory representation of the real browser DOM. When component state changes, React creates a new Virtual DOM tree and uses a diffing algorithm (reconciliation) to identify the exact changes, batching updates to minimize expensive real DOM reflows and repaints.',
    timestamp: '10:04 AM',
  },
];
