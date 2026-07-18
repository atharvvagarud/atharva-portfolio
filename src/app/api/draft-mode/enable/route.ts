import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedRedirects = new Set([
  "/",
  "/about",
  "/projects",
  "/photography",
]);

function safeRedirect(value: string | null): string | null {
  if (!value) return "/";
  return allowedRedirects.has(value) ? value : null;
}

function secretsMatch(supplied: string, expected: string): boolean {
  const suppliedDigest = createHash("sha256").update(supplied).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(suppliedDigest, expectedDigest);
}

export async function GET(request: Request) {
  const previewSecret = process.env.SANITY_PREVIEW_SECRET?.trim();
  if (!previewSecret) {
    return NextResponse.json(
      { enabled: false, error: "Preview is not configured." },
      { status: 503 },
    );
  }

  const requestUrl = new URL(request.url);
  const suppliedSecret = requestUrl.searchParams.get("secret")?.trim();

  if (!suppliedSecret || !secretsMatch(suppliedSecret, previewSecret)) {
    return NextResponse.json(
      { enabled: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  const redirect = safeRedirect(requestUrl.searchParams.get("redirect"));
  if (!redirect) {
    return NextResponse.json(
      { enabled: false, error: "Invalid preview redirect." },
      { status: 400 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirect, requestUrl.origin), 307);
}
