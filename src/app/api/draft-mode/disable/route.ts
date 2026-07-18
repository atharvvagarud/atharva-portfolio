import "server-only";

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

const allowedRedirects = new Set([
  "/",
  "/about",
  "/projects",
  "/photography",
]);

function safeRedirect(value: FormDataEntryValue | null): string {
  return typeof value === "string" && allowedRedirects.has(value) ? value : "/";
}

export async function POST(request: Request) {
  let redirect = "/";

  try {
    const formData = await request.formData();
    redirect = safeRedirect(formData.get("redirect"));
  } catch {
    // A malformed form still exits preview and returns to the safe default.
  }

  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(redirect, new URL(request.url).origin), 303);
}
