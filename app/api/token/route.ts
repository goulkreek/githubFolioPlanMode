import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

const COOKIE_NAME = "gh_token";
const FLAG_NAME = "gh_token_set";
const MAX_AGE = 60 * 60 * 24;

const bodySchema = z.object({
  token: z
    .string()
    .trim()
    .min(20, "Token trop court")
    .max(255, "Token trop long")
    .regex(/^[A-Za-z0-9_]+$/, "Format de token invalide"),
});

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Token invalide" },
      { status: 400 },
    );
  }

  const probe = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${parsed.data.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (probe.status === 401) {
    return NextResponse.json(
      { ok: false, error: "Token refusé par GitHub (401)" },
      { status: 400 },
    );
  }
  if (!probe.ok) {
    return NextResponse.json(
      { ok: false, error: `GitHub a renvoyé ${probe.status}` },
      { status: 400 },
    );
  }

  const store = await cookies();
  store.set(COOKIE_NAME, parsed.data.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  store.set(FLAG_NAME, "1", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  store.delete(FLAG_NAME);
  return NextResponse.json({ ok: true });
}
