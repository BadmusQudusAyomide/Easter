export type QuizQuestion = {
  ref: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type ShuffledQuizQuestion = QuizQuestion & {
  optionOrder: number[];
};

export type QuizSubmissionPayload = {
  name: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: number[];
};

export type SubmissionRecord = {
  id: number;
  name: string;
  score: number;
  total_questions: number;
  percentage: number;
  answers: number[];
  created_at: string;
};
