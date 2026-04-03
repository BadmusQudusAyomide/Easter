import Link from "next/link";

import { logoutAction } from "@/app/admin/login/actions";
import { getLatestSubmissions } from "@/lib/submissions";
import type { SubmissionRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let submissionsError = "";
  let submissions: SubmissionRecord[] = [];

  try {
    submissions = Array.from(await getLatestSubmissions());
  } catch (error) {
    submissionsError =
      error instanceof Error
        ? error.message
        : "Could not load submissions right now.";
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[var(--dark)] px-5 py-10 text-[var(--cream)] sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,168,76,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-[rgba(201,168,76,0.18)] bg-[rgba(16,10,5,0.72)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.35em] text-[var(--gold)]">
              Easter Quiz Admin
            </p>
            <h1 className="mt-3 font-[family:var(--font-cinzel)] text-3xl font-black text-[var(--gold-light)] sm:text-4xl">
              Submission Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[rgba(245,239,224,0.72)]">
              Review saved attempts from your Next.js quiz here. Once Neon is connected,
              this page becomes your simple admin view.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(201,168,76,0.4)] px-5 py-3 font-[family:var(--font-cinzel)] text-sm tracking-[0.25em] text-[var(--gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
            >
              BACK TO QUIZ
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(201,168,76,0.4)] px-5 py-3 font-[family:var(--font-cinzel)] text-sm tracking-[0.25em] text-[var(--gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
              >
                LOG OUT
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total Submissions" value={String(submissions.length)} />
          <SummaryCard
            label="Average Score"
            value={
              submissions.length > 0
                ? `${Math.round(
                    submissions.reduce((sum, submission) => sum + submission.percentage, 0) /
                      submissions.length,
                  )}%`
                : "--"
            }
          />
          <SummaryCard
            label="Best Score"
            value={
              submissions.length > 0
                ? `${Math.max(...submissions.map((submission) => submission.score))}/${submissions[0]?.total_questions ?? 20}`
                : "--"
            }
          />
        </div>

        <section className="mt-8 rounded-[2rem] border border-[rgba(201,168,76,0.18)] bg-[rgba(16,10,5,0.72)] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6">
          {submissionsError ? (
            <div className="rounded-[1.5rem] border border-[rgba(166,50,40,0.35)] bg-[rgba(166,50,40,0.1)] p-5">
              <p className="font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.3em] text-[#f0a59f]">
                Database setup needed
              </p>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[rgba(245,239,224,0.78)]">
                {submissionsError}
              </p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="rounded-[1.5rem] border border-[rgba(201,168,76,0.16)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.3em] text-[var(--gold-dim)]">
                No submissions yet
              </p>
              <p className="mt-3 text-base leading-7 text-[rgba(245,239,224,0.72)]">
                The table is ready. Once someone finishes the quiz, their result will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:hidden">
                {submissions.map((submission) => (
                  <article
                    key={submission.id}
                    className="rounded-[1.25rem] border border-[rgba(201,168,76,0.14)] bg-[rgba(255,255,255,0.03)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--cream)]">
                          {submission.name}
                        </p>
                        <p className="mt-1 text-sm text-[rgba(245,239,224,0.56)]">
                          {new Date(submission.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-[family:var(--font-cinzel)] text-lg text-[var(--gold)]">
                        {submission.score}/{submission.total_questions}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-3">
                        <p className="font-[family:var(--font-cinzel)] text-[10px] uppercase tracking-[0.22em] text-[var(--gold-dim)]">
                          Percent
                        </p>
                        <p className="mt-2 text-[rgba(245,239,224,0.82)]">
                          {submission.percentage}%
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[rgba(201,168,76,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-3">
                        <p className="font-[family:var(--font-cinzel)] text-[10px] uppercase tracking-[0.22em] text-[var(--gold-dim)]">
                          Answers
                        </p>
                        <p className="mt-2 break-words text-[rgba(245,239,224,0.82)]">
                          {formatAnswers(submission.answers)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-[1.5rem] border border-[rgba(201,168,76,0.14)] md:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-[rgba(201,168,76,0.08)]">
                      <tr className="font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.25em] text-[var(--gold-dim)]">
                        <th className="px-4 py-4">Name</th>
                        <th className="px-4 py-4">Score</th>
                        <th className="px-4 py-4">Percent</th>
                        <th className="px-4 py-4">Submitted</th>
                        <th className="px-4 py-4">Answers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission) => (
                        <tr
                          key={submission.id}
                          className="border-t border-[rgba(201,168,76,0.1)] text-sm text-[rgba(245,239,224,0.8)]"
                        >
                          <td className="px-4 py-4 font-semibold text-[var(--cream)]">
                            {submission.name}
                          </td>
                          <td className="px-4 py-4">
                            {submission.score}/{submission.total_questions}
                          </td>
                          <td className="px-4 py-4">{submission.percentage}%</td>
                          <td className="px-4 py-4">
                            {new Date(submission.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-[rgba(245,239,224,0.56)]">
                            {formatAnswers(submission.answers)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-[rgba(201,168,76,0.18)] bg-[rgba(16,10,5,0.72)] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur">
      <p className="font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.3em] text-[var(--gold-dim)]">
        {label}
      </p>
      <p className="mt-4 font-[family:var(--font-cinzel)] text-4xl font-semibold text-[var(--gold)]">
        {value}
      </p>
    </div>
  );
}

function formatAnswers(answers: SubmissionRecord["answers"]) {
  if (Array.isArray(answers)) {
    return answers.join(", ");
  }

  if (typeof answers === "string") {
    try {
      const parsed = JSON.parse(answers);
      return Array.isArray(parsed) ? parsed.join(", ") : "Saved";
    } catch {
      return answers;
    }
  }

  return "Saved";
}
