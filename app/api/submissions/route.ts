import { NextResponse } from "next/server";

import { saveSubmission } from "@/lib/submissions";
import type { QuizSubmissionPayload } from "@/lib/types";

function isValidPayload(payload: unknown): payload is QuizSubmissionPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.score === "number" &&
    typeof candidate.totalQuestions === "number" &&
    typeof candidate.percentage === "number" &&
    Array.isArray(candidate.answers) &&
    candidate.answers.every((answer) => typeof answer === "number")
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json();

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Invalid submission payload." },
      { status: 400 },
    );
  }

  try {
    const record = await saveSubmission(body);
    return NextResponse.json({ submission: record }, { status: 201 });
  } catch (error) {
    console.error("Failed to save submission", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save submission.",
      },
      { status: 500 },
    );
  }
}
