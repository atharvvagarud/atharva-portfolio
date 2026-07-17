import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SANITY_CACHE_TAGS } from "@/sanity/cache";

export const runtime = "nodejs";

const revalidationTargets = {
  siteSettings: {
    tags: [SANITY_CACHE_TAGS.siteSettings],
    paths: ["/", "/about", "/projects", "/photography"],
  },
  homepage: {
    tags: [SANITY_CACHE_TAGS.homepage],
    paths: ["/"],
  },
  aboutPage: {
    tags: [SANITY_CACHE_TAGS.aboutPage],
    paths: ["/about"],
  },
  project: {
    tags: [SANITY_CACHE_TAGS.projects, SANITY_CACHE_TAGS.homepage],
    paths: ["/", "/projects"],
  },
  photo: {
    tags: [SANITY_CACHE_TAGS.photos],
    paths: ["/photography"],
  },
} as const;

type SupportedDocumentType = keyof typeof revalidationTargets;

type WebhookPayload = {
  readonly _type?: unknown;
  readonly _id?: unknown;
};

function response(
  status: number,
  values: {
    readonly revalidated: boolean;
    readonly documentType: string | null;
    readonly tags?: readonly string[];
    readonly paths?: readonly string[];
    readonly error?: string;
  },
) {
  return NextResponse.json(
    {
      revalidated: values.revalidated,
      documentType: values.documentType,
      tagsInvalidated: values.tags ?? [],
      pathsInvalidated: values.paths ?? [],
      timestamp: new Date().toISOString(),
      ...(values.error ? { error: values.error } : {}),
    },
    { status },
  );
}

function suppliedSecret(request: Request): string | null {
  const authorization = request.headers.get("authorization")?.trim();
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim() || null;
  }

  return request.headers.get("x-sanity-revalidation-secret")?.trim() || null;
}

function secretsMatch(supplied: string, expected: string): boolean {
  const suppliedDigest = createHash("sha256").update(supplied).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(suppliedDigest, expectedDigest);
}

function isSupportedDocumentType(
  value: string,
): value is SupportedDocumentType {
  return Object.hasOwn(revalidationTargets, value);
}

export async function POST(request: Request) {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!expectedSecret) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[sanity-revalidate] rejected reason=server-not-configured");
    }

    return response(503, {
      revalidated: false,
      documentType: null,
      error: "Revalidation is not configured.",
    });
  }

  const secret = suppliedSecret(request);
  if (!secret || !secretsMatch(secret, expectedSecret)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[sanity-revalidate] rejected reason=unauthorized");
    }

    return response(401, {
      revalidated: false,
      documentType: null,
      error: "Unauthorized.",
    });
  }

  let payload: WebhookPayload;
  try {
    payload = (await request.json()) as WebhookPayload;
  } catch {
    return response(400, {
      revalidated: false,
      documentType: null,
      error: "Malformed JSON payload.",
    });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return response(400, {
      revalidated: false,
      documentType: null,
      error: "Malformed JSON payload.",
    });
  }

  if (typeof payload._type !== "string" || !payload._type.trim()) {
    return response(400, {
      revalidated: false,
      documentType: null,
      error: "Document type is required.",
    });
  }

  const documentType = payload._type.trim();
  if (!isSupportedDocumentType(documentType)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[sanity-revalidate] ignored type=${documentType} reason=unsupported-type`,
      );
    }

    return response(200, {
      revalidated: false,
      documentType,
      error: "Unsupported document type.",
    });
  }

  const target = revalidationTargets[documentType];

  try {
    for (const tag of target.tags) {
      revalidateTag(tag, { expire: 0 });
    }

    for (const path of target.paths) {
      revalidatePath(path, "page");
    }

    if (process.env.NODE_ENV === "development") {
      console.info(`[sanity-revalidate] success type=${documentType}`);
    }

    return response(200, {
      revalidated: true,
      documentType,
      tags: target.tags,
      paths: target.paths,
    });
  } catch {
    console.error(`[sanity-revalidate] failed type=${documentType}`);

    return response(500, {
      revalidated: false,
      documentType,
      error: "Cache revalidation failed.",
    });
  }
}

