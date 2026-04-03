"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type {
  QuizQuestion,
  QuizSubmissionPayload,
  ShuffledQuizQuestion,
} from "@/lib/types";

type QuizExperienceProps = {
  questions: QuizQuestion[];
};

const optionLetters = ["A", "B", "C", "D"];

export function QuizExperience({ questions }: QuizExperienceProps) {
  const shuffledQuestions = useMemo(
    () => questions.map((question) => shuffleQuestion(question)),
    [questions],
  );
  const total = questions.length;
  const [screen, setScreen] = useState<"intro" | "quiz" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [draftName, setDraftName] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    () => Array.from({ length: shuffledQuestions.length }, () => -1),
  );
  const [revealedAnswer, setRevealedAnswer] = useState<number | null>(null);
  const hasSubmittedRef = useRef(false);

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = (currentIndex / total) * 100;
  const percentage = Math.round((score / total) * 100);
  const hasName = draftName.trim().length > 0;

  const resultData = useMemo(() => getResultData(score, total), [score, total]);

  useEffect(() => {
    if (screen !== "result" || hasSubmittedRef.current) {
      return;
    }

    const payload: QuizSubmissionPayload = {
      name: playerName,
      score,
      totalQuestions: total,
      answers: selectedAnswers,
      percentage,
    };

    hasSubmittedRef.current = true;

    void fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not save your score right now.");
        }
      })
      .catch(() => {});
  }, [percentage, playerName, score, screen, selectedAnswers, total]);

  function startQuiz() {
    const trimmedName = draftName.trim();

    if (trimmedName.length === 0) {
      return;
    }

    setPlayerName(trimmedName);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswers(Array.from({ length: shuffledQuestions.length }, () => -1));
    setRevealedAnswer(null);
    setScreen("quiz");
    hasSubmittedRef.current = false;
  }

  function selectAnswer(selectedIndex: number) {
    if (revealedAnswer !== null) {
      return;
    }

    setRevealedAnswer(selectedIndex);
    setSelectedAnswers((previous) => {
      const next = [...previous];
      next[currentIndex] = selectedIndex;
      return next;
    });

    if (selectedIndex === currentQuestion.answer) {
      setScore((previous) => previous + 1);
    }
  }

  function nextQuestion() {
    if (currentIndex === total - 1) {
      setScreen("result");
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setRevealedAnswer(null);
  }

  function playAgain() {
    setDraftName(playerName);
    setScreen("intro");
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswers(Array.from({ length: shuffledQuestions.length }, () => -1));
    setRevealedAnswer(null);
    hasSubmittedRef.current = false;
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[var(--dark)] text-[var(--cream)]">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,168,76,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
        {screen === "intro" ? (
          <section className="mx-auto w-full text-center">
            <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-[rgba(201,168,76,0.18)] bg-[rgba(16,10,5,0.72)] px-4 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:px-6 sm:py-10 md:rounded-[2rem] md:px-10 md:py-14">
              <p className="mb-5 text-5xl text-[var(--gold-light)] drop-shadow-[0_0_18px_rgba(201,168,76,0.45)]">
                ✝
              </p>
              <p className="font-[family:var(--font-cinzel)] text-[10px] uppercase tracking-[0.28em] text-[var(--gold)] sm:text-[11px] sm:tracking-[0.45em]">
                Easter 2026 . Special Edition
              </p>
              <h1 className="mt-5 font-[family:var(--font-cinzel)] text-3xl leading-tight font-black text-[var(--gold-light)] drop-shadow-[0_4px_30px_rgba(201,168,76,0.35)] sm:text-5xl sm:leading-none md:text-6xl">
                How Well Do You
                <br />
                Know Jesus?
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[rgba(245,239,224,0.75)] italic sm:text-lg sm:leading-8">
                You call yourself a Christian, but can you answer these? Twenty
                questions on the life, death, and resurrection of Jesus Christ.
              </p>

              <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 rounded-[1.25rem] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.03)] px-4 py-5 sm:mt-10 sm:grid-cols-3 sm:gap-4 sm:rounded-[1.5rem] sm:px-8">
                <Stat value="20" label="Questions" />
                <Stat value="4" label="Options Each" />
                <Stat value="ENDLESS" label="Replays" />
              </div>

              <form
                className="mx-auto mt-10 max-w-md text-left"
                onSubmit={(event) => {
                  event.preventDefault();
                  startQuiz();
                }}
              >
                <label
                  htmlFor="player-name"
                  className="mb-3 block font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.35em] text-[var(--gold-dim)]"
                >
                  Your Name
                </label>
                <input
                  id="player-name"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Enter your name to begin..."
                  maxLength={30}
                  required
                  className="w-full rounded-2xl border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.04)] px-5 py-4 text-lg text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
                />
                <p className="mt-3 text-sm text-[rgba(245,239,224,0.45)]">
                  Enter your name before starting the quiz.
                </p>

                <button
                  type="submit"
                  disabled={!hasName}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold)_0%,var(--gold-light)_50%,var(--gold)_100%)] px-8 py-4 font-[family:var(--font-cinzel)] text-sm font-semibold tracking-[0.25em] text-[var(--dark)] shadow-[0_6px_30px_rgba(201,168,76,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(201,168,76,0.48)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  BEGIN THE QUIZ
                </button>
              </form>

              <p className="mt-5 text-sm italic text-[rgba(245,239,224,0.35)]">
                Built with love and curiosity.
              </p>
            </div>
          </section>
        ) : null}

        {screen === "quiz" ? (
          <section className="mx-auto w-full max-w-3xl">
            <div className="rounded-[1.75rem] border border-[rgba(201,168,76,0.18)] bg-[rgba(16,10,5,0.72)] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6 md:rounded-[2rem] md:p-8">
              <div className="mb-8">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <p className="font-[family:var(--font-cinzel)] text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] sm:text-[11px] sm:tracking-[0.35em]">
                    Question {currentIndex + 1} of {total}
                  </p>
                  <p className="font-[family:var(--font-cinzel)] text-sm text-[rgba(245,239,224,0.6)]">
                    Score: <span className="text-[var(--gold)]">{score}</span>
                  </p>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-[rgba(201,168,76,0.15)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--gold-dim),var(--gold))] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[rgba(201,168,76,0.2)] bg-[rgba(255,255,255,0.04)] p-4 sm:rounded-[1.75rem] sm:p-6">
                <p className="mb-3 font-[family:var(--font-cinzel)] text-[10px] uppercase tracking-[0.2em] text-[var(--gold-dim)] sm:text-[11px] sm:tracking-[0.3em]">
                  {currentQuestion.ref}
                </p>
                <h2 className="text-xl leading-8 font-light text-[var(--cream)] sm:text-2xl sm:leading-9">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="mt-5 grid gap-3">
                {currentQuestion.options.map((option, optionIndex) => {
                  const isSelected = revealedAnswer === optionIndex;
                  const isCorrect = optionIndex === currentQuestion.answer;
                  const wasAnswered = revealedAnswer !== null;

                  let optionStyle =
                    "border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.03)] text-[var(--cream)] hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(201,168,76,0.08)]";

                  if (wasAnswered && isCorrect) {
                    optionStyle =
                      "border-[rgba(61,140,64,0.8)] bg-[rgba(61,140,64,0.15)] text-[#b7e9b8]";
                  } else if (wasAnswered && isSelected && !isCorrect) {
                    optionStyle =
                      "border-[rgba(166,50,40,0.9)] bg-[rgba(166,50,40,0.14)] text-[#f4b0ab]";
                  } else if (wasAnswered) {
                    optionStyle =
                      "border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.02)] text-[rgba(245,239,224,0.32)]";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(optionIndex)}
                      disabled={wasAnswered}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-4 text-left text-base transition sm:items-center sm:gap-4 sm:px-5 sm:text-lg ${optionStyle}`}
                    >
                      <span className="mt-0.5 font-[family:var(--font-cinzel)] text-sm font-semibold text-[var(--gold-dim)] sm:mt-0">
                        {optionLetters[optionIndex]}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {revealedAnswer !== null ? (
                <div
                  className={`mt-5 rounded-[1.5rem] border px-5 py-4 ${
                    revealedAnswer === currentQuestion.answer
                      ? "border-[rgba(61,140,64,0.35)] bg-[rgba(61,140,64,0.1)]"
                      : "border-[rgba(166,50,40,0.35)] bg-[rgba(166,50,40,0.1)]"
                  }`}
                >
                  <p
                    className={`font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.3em] ${
                      revealedAnswer === currentQuestion.answer
                        ? "text-[#82cc86]"
                        : "text-[#e28d86]"
                    }`}
                  >
                    {revealedAnswer === currentQuestion.answer
                      ? "Correct!"
                      : "Not Quite"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[rgba(245,239,224,0.82)] italic sm:text-base">
                    {currentQuestion.explanation}
                  </p>
                </div>
              ) : null}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={revealedAnswer === null}
                  className="w-full rounded-full border border-[rgba(201,168,76,0.35)] px-5 py-4 font-[family:var(--font-cinzel)] text-sm tracking-[0.25em] text-[var(--gold)] transition hover:bg-[rgba(201,168,76,0.1)] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {currentIndex < total - 1 ? "NEXT QUESTION ->" : "SEE MY RESULTS ->"}
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {screen === "result" ? (
          <section className="mx-auto w-full max-w-3xl">
            <div className="rounded-[1.75rem] border border-[rgba(201,168,76,0.18)] bg-[rgba(16,10,5,0.72)] px-4 py-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:px-6 sm:py-10 md:rounded-[2rem] md:px-10">
              <p className="text-4xl text-[var(--gold-light)]">✝</p>
              <p className="mt-4 font-[family:var(--font-cinzel)] text-[10px] uppercase tracking-[0.28em] text-[var(--gold-dim)] sm:text-[11px] sm:tracking-[0.35em]">
                {playerName}
              </p>
              <p className="mt-4 font-[family:var(--font-cinzel)] text-5xl font-black text-[var(--gold)] drop-shadow-[0_0_30px_rgba(201,168,76,0.45)] sm:text-7xl">
                {score}/{total}
              </p>
              <p className="mt-3 font-[family:var(--font-cinzel)] text-xs uppercase tracking-[0.28em] text-[rgba(245,239,224,0.48)] sm:text-sm sm:tracking-[0.35em]">
                {percentage}% Correct
              </p>
              <h2 className="mt-5 font-[family:var(--font-cinzel)] text-2xl text-[var(--gold-light)] sm:text-4xl">
                {resultData.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[rgba(245,239,224,0.7)] italic sm:text-lg sm:leading-8">
                {resultData.message}
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={playAgain}
                  className="rounded-full border border-[rgba(201,168,76,0.4)] px-6 py-3 font-[family:var(--font-cinzel)] text-sm tracking-[0.25em] text-[var(--gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-[family:var(--font-cinzel)] text-2xl font-semibold text-[var(--gold)] sm:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[rgba(245,239,224,0.45)] sm:text-[11px] sm:tracking-[0.3em]">
        {label}
      </p>
    </div>
  );
}

function shuffleQuestion(question: QuizQuestion): ShuffledQuizQuestion {
  const optionOrder = question.options.map((_, index) => index);

  for (let index = optionOrder.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [optionOrder[index], optionOrder[randomIndex]] = [
      optionOrder[randomIndex],
      optionOrder[index],
    ];
  }

  return {
    ...question,
    options: optionOrder.map((index) => question.options[index]),
    answer: optionOrder.indexOf(question.answer),
    optionOrder,
  };
}

function getResultData(score: number, total: number) {
  const pct = Math.round((score / total) * 100);

  if (pct === 100) {
    return {
      pct,
      title: "You Are The Word",
      message:
        "Perfect score. Either you went to seminary or you read your Bible every day. Genuinely impressive.",
    };
  }

  if (pct >= 80) {
    return {
      pct,
      title: "Faithful and Knowledgeable",
      message:
        "You know your scriptures well. A few gaps here and there, but your foundation is solid. Go revisit the ones you missed.",
    };
  }

  if (pct >= 60) {
    return {
      pct,
      title: "Sunday School Graduate",
      message:
        "You know the main story, but the details tripped you up. Maybe dust off that Bible this Easter season.",
    };
  }

  if (pct >= 40) {
    return {
      pct,
      title: "Casual Believer",
      message:
        "You know Jesus exists and the basics, but the depth is not quite there yet. The Easter story is worth a full read.",
    };
  }

  return {
    pct,
    title: "We Need to Talk",
    message:
      "There is room to grow here. The good news is the story is still waiting for you, and now your attempt can be saved too.",
  };
}
