import Link from "next/link";

import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[var(--dark)] px-5 py-10 text-[var(--cream)] sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.16),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(201,168,76,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,168,76,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="rounded-[2rem] border border-[rgba(201,168,76,0.18)] bg-[rgba(16,10,5,0.72)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:p-10">
          <p className="font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.35em] text-[var(--gold)]">
            Easter Quiz Admin
          </p>
          <h1 className="mt-4 font-[family:var(--font-cinzel)] text-3xl font-black text-[var(--gold-light)] sm:text-4xl">
            Protected Dashboard Login
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[rgba(245,239,224,0.74)]">
            Enter your admin password to view quiz submissions. This keeps the
            dashboard private while your public quiz stays open to everyone.
          </p>

          <div className="mt-8">
            <AdminLoginForm />
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(201,168,76,0.4)] px-5 py-3 font-[family:var(--font-cinzel)] text-sm tracking-[0.25em] text-[var(--gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
            >
              BACK TO QUIZ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
