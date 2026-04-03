import { getDb } from "@/lib/db";
import type { QuizSubmissionPayload, SubmissionRecord } from "@/lib/types";

export async function saveSubmission(payload: QuizSubmissionPayload) {
  const sql = getDb();

  const [record] = await sql<SubmissionRecord[]>`
    insert into quiz_submissions (name, score, total_questions, percentage, answers)
    values (${payload.name}, ${payload.score}, ${payload.totalQuestions}, ${payload.percentage}, ${JSON.stringify(payload.answers)}::jsonb)
    returning id, name, score, total_questions, percentage, answers, created_at
  `;

  return record;
}

export async function getLatestSubmissions() {
  const sql = getDb();

  return sql<SubmissionRecord[]>`
    select id, name, score, total_questions, percentage, answers, created_at
    from quiz_submissions
    order by created_at desc
    limit 100
  `;
}
