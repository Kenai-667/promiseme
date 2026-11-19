import { timingSafeEqual } from "node:crypto";

/**
 * The owner key protects only the About-page owner controls. It is never
 * required for reading, uploading comics or voices, posting, commenting,
 * voting or chatting. When the variable is not set, the workspace demo stays
 * fully open so the tools can be tried immediately.
 */
export function ownerLockEnabled(): boolean {
  return Boolean(process.env.OWNER_EDIT_KEY);
}

export function isOwnerAuthorized(request: Request): boolean {
  const expected = process.env.OWNER_EDIT_KEY;
  if (!expected) return true;

  const provided = request.headers.get("x-owner-key") || "";
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export const OWNER_UNAUTHORIZED_MESSAGE =
  "Owner key required. This private key protects owner tools only; regular users still need no verification.";
