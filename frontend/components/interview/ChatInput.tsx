import React, { useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea up to max 160px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend(value);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value);
    }
  };

  return (
    <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-3 sm:p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3 relative">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            disabled={disabled}
            aria-label="Type your answer"
            className="w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="rounded-2xl h-[46px] w-[46px] p-0 flex items-center justify-center shrink-0 shadow-md"
        >
          <SendHorizontal className="w-5 h-5" />
        </Button>
      </form>

      <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-2 font-medium">
        Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 border rounded text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 border rounded text-[10px]">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
};
