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

const presentationParameterNames = [
  "sanity-preview-secret",
  "sanity-preview-pathname",
  "sanity-preview-perspective",
] as const;

function safeRedirect(value: string | null): string | null {
  if (!value) return "/";
  return allowedRedirects.has(value) ? value : null;
}

function secretsMatch(supplied: string, expected: string): boolean {
  const suppliedDigest = createHash("sha256").update(supplied).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(suppliedDigest, expectedDigest);
}

function isNextRedirect(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }

  const { digest } = error as { digest?: unknown };
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

function logPresentationHandshake({
  requestUrl,
  validationSucceeded,
  resolvedRedirectPathname,
  draftModeEnabled,
}: {
  requestUrl: URL;
  validationSucceeded: boolean;
  resolvedRedirectPathname: string;
  draftModeEnabled: boolean;
}) {
  console.info(
    `[sanity-preview] handshake=true secret=${requestUrl.searchParams.has("sanity-preview-secret")} pathname=${requestUrl.searchParams.has("sanity-preview-pathname")} validated=${validationSucceeded} redirect=${resolvedRedirectPathname} draftMode=${draftModeEnabled}`,
  );
}

async function handlePresentationHandshake(
  request: Request,
  requestUrl: URL,
) {
  const redirect = safeRedirect(
    requestUrl.searchParams.get("sanity-preview-pathname"),
  );
  const resolvedRedirectPathname = redirect ?? "rejected";

  if (!presentationDraftMode) {
    logPresentationHandshake({
      requestUrl,
      validationSucceeded: false,
      resolvedRedirectPathname,
      draftModeEnabled: false,
    });

    return NextResponse.json(
      { enabled: false, error: "Preview is not configured." },
      { status: 503 },
    );
  }

  try {
    const response = await presentationDraftMode.GET(request);
    logPresentationHandshake({
      requestUrl,
      validationSucceeded: false,
      resolvedRedirectPathname,
      draftModeEnabled: false,
    });
    return response;
  } catch (error) {
    const validationSucceeded = isNextRedirect(error);

    if (validationSucceeded && !redirect) {
      const draft = await draftMode();
      draft.disable();

      logPresentationHandshake({
        requestUrl,
        validationSucceeded: true,
        resolvedRedirectPathname,
        draftModeEnabled: false,
      });

      return NextResponse.json(
        { enabled: false, error: "Invalid preview redirect." },
        { status: 400 },
      );
    }

    const draft = await draftMode();
    logPresentationHandshake({
      requestUrl,
      validationSucceeded,
      resolvedRedirectPathname,
      draftModeEnabled: validationSucceeded && draft.isEnabled,
    });

    throw error;
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const isPresentationHandshake = presentationParameterNames.some(
    (parameterName) => requestUrl.searchParams.has(parameterName),
  );

  if (isPresentationHandshake) {
    return handlePresentationHandshake(request, requestUrl);
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
