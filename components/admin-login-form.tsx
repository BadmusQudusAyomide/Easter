"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/admin/login/actions";

const initialState = {
  error: "",
};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="mb-3 block font-[family:var(--font-cinzel)] text-[11px] uppercase tracking-[0.35em] text-[var(--gold-dim)]"
        >
          Admin Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-2xl border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.04)] px-5 py-4 text-lg text-[var(--cream)] outline-none transition focus:border-[var(--gold)]"
        />
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-[rgba(166,50,40,0.35)] bg-[rgba(166,50,40,0.1)] px-4 py-3 text-sm text-[#f0a59f]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--gold)_0%,var(--gold-light)_50%,var(--gold)_100%)] px-8 py-4 font-[family:var(--font-cinzel)] text-sm font-semibold tracking-[0.3em] text-[var(--dark)] shadow-[0_6px_30px_rgba(201,168,76,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(201,168,76,0.48)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "SIGNING IN..." : "ENTER ADMIN"}
      </button>
    </form>
  );
}
