import { useState } from 'react';

/**
 * Reusable hook placeholder for interview progression state
 */
export function useInterview(initialQuestionIndex = 3, totalQuestions = 10) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const saveAnswer = (questionIndex: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: text }));
  };

  return {
    currentQuestionIndex,
    totalQuestions,
    answers,
    nextQuestion,
    previousQuestion,
    saveAnswer,
  };
}
