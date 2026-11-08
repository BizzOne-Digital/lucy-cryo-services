import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function ok(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function fail(message: string, status = 400, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ success: false, message, ...extra }, { status });
}

/** Converts thrown errors into safe JSON responses. Never leaks stack traces. */
export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    const field = first?.path?.join(".");
    return fail(field ? `${field}: ${first.message}` : "Invalid request.", 400);
  }
  if (err instanceof HttpError) return fail(err.message, err.status);
  const e = err as { code?: number; name?: string };
  if (e?.code === 11000) return fail("A record with this value already exists (for example a duplicate slug).", 409);
  if (e?.name === "CastError") return fail("Invalid identifier.", 400);
  console.error("[api]", err);
  return fail("Something went wrong. Please try again.", 500);
}

export function isObjectId(id: string) {
  return /^[a-f0-9]{24}$/i.test(id);
}

export async function readJson(req: Request) {
  try {
    return await req.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body.");
  }
}
