const ADMIN_COOKIE_NAME = "easter_admin_session";

function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SECRET is not set. Add it to your environment variables.");
  }

  return secret;
}

async function createSignature(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getAdminSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken() {
  const issuedAt = Date.now().toString();
  const signature = await createSignature(issuedAt);

  return `${issuedAt}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  const [issuedAt, signature] = token.split(".");

  if (!issuedAt || !signature) {
    return false;
  }

  const expectedSignature = await createSignature(issuedAt);
  const maxAgeMs = 1000 * 60 * 60 * 24 * 7;
  const issuedAtNumber = Number(issuedAt);
  const isExpired = Date.now() - issuedAtNumber > maxAgeMs;

  return signature === expectedSignature && Number.isFinite(issuedAtNumber) && !isExpired;
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}
