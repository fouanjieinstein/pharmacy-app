import "server-only";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Local-disk stand-in for the private, access-controlled object storage
// ARCHITECTURE.md calls for (S3-compatible, encrypted at rest) in production.
// Deliberately outside public/ — nothing here is ever reachable by a direct
// URL; every read goes through an authenticated route (see
// app/api/prescriptions/[id]/file/route.ts) that checks ownership/role and
// writes an audit_logs entry, matching ARCHITECTURE.md §4's prescription
// access-control rule.
const STORAGE_ROOT = path.join(process.cwd(), "storage", "prescriptions");

/** Only ever derived from a random UUID + a sanitized extension — never from
 * user-controlled input — so a storageKey can't be used for path traversal. */
function safeExtension(originalFileName: string): string {
  const ext = path.extname(originalFileName);
  return /^\.[a-zA-Z0-9]{1,10}$/.test(ext) ? ext : "";
}

export async function savePrescriptionFile(buffer: Buffer, originalFileName: string): Promise<string> {
  await mkdir(STORAGE_ROOT, { recursive: true });
  const key = `${randomUUID()}${safeExtension(originalFileName)}`;
  await writeFile(path.join(STORAGE_ROOT, key), buffer);
  return key;
}

export async function readPrescriptionFile(storageKey: string): Promise<Buffer> {
  return readFile(path.join(STORAGE_ROOT, storageKey));
}

export async function deletePrescriptionFile(storageKey: string): Promise<void> {
  try {
    await unlink(path.join(STORAGE_ROOT, storageKey));
  } catch {
    // Already gone — deletion is best-effort.
  }
}
