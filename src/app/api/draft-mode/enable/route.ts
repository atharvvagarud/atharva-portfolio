import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { sanityPreviewClient } from "@/sanity/client";

export const runtime = "nodejs";

const allowedRedirects = new Set([
  "/",
  "/about",
  "/projects",
  "/photography",
]);

const presentationDraftMode = sanityPreviewClient
  ? defineEnableDraftMode({ client: sanityPreviewClient })
  : null;

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
  const requestUrl = new URL(request.url);
  const presentationSecret = requestUrl.searchParams.get(
    "sanity-preview-secret",
  );

  if (presentationSecret) {
    const redirect = safeRedirect(
      requestUrl.searchParams.get("sanity-preview-pathname"),
    );

    if (!redirect) {
      return NextResponse.json(
        { enabled: false, error: "Invalid preview redirect." },
        { status: 400 },
      );
    }

    if (!presentationDraftMode) {
      return NextResponse.json(
        { enabled: false, error: "Preview is not configured." },
        { status: 503 },
      );
    }

    return presentationDraftMode.GET(request);
  }

  const manualPreviewSecret = process.env.SANITY_PREVIEW_SECRET?.trim();
  if (!manualPreviewSecret) {
    return NextResponse.json(
      { enabled: false, error: "Preview is not configured." },
      { status: 503 },
    );
  }

  const suppliedSecret = requestUrl.searchParams.get("secret")?.trim();

  if (
    !suppliedSecret ||
    !secretsMatch(suppliedSecret, manualPreviewSecret)
  ) {
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
