import { QuizExperience } from "@/components/quiz-experience";
import { questions } from "@/lib/questions";

export default function Home() {
  return <QuizExperience questions={questions} />;
}
