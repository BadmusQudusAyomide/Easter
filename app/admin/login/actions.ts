"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createAdminSessionToken,
  getAdminCookieName,
} from "@/lib/admin-auth";

type LoginState = {
  error: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return {
      error: "ADMIN_PASSWORD is not set yet. Add it to your environment first.",
    };
  }

  if (password !== adminPassword) {
    return {
      error: "That password is incorrect.",
    };
  }

  const cookieStore = await cookies();
  const sessionToken = await createAdminSessionToken();
  cookieStore.set({
    name: getAdminCookieName(),
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminCookieName());
  redirect("/admin/login");
}
