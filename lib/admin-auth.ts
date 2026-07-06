import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_SESSION_VALUE = "authenticated";

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === ADMIN_SESSION_VALUE;
}

export async function verifyAdmin(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return false;
  }

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));

  if (!match) {
    return false;
  }

  const value = match.slice(ADMIN_COOKIE_NAME.length + 1);
  return value === ADMIN_SESSION_VALUE;
}

export function validateAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }
  return password === expected;
}

export { ADMIN_SESSION_VALUE };
