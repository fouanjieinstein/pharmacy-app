import "server-only";
import { createHash, randomInt } from "node:crypto";
import { db } from "@/lib/server/db";
import { safeEquals } from "@/lib/server/session";
import { sendMail } from "@/lib/server/mailer";
import { renderVerificationEmailHtml, renderVerificationEmailSubject } from "@/lib/email/templates";

const CODE_TTL_MINUTES = 15;
// A 6-digit code has only 1,000,000 possibilities — cap guesses tightly
// rather than relying on the code's own entropy the way a password can.
const MAX_ATTEMPTS = 5;

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function generateCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function issueVerificationCode(user: {
  id: string;
  email: string;
  name: string;
}): Promise<{ sent: boolean; error?: string; status?: 502 | 503 }> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  // Only one active code per user — issuing a new one invalidates any prior
  // unused code rather than letting several valid codes pile up.
  await db.$transaction([
    db.emailVerificationCode.deleteMany({ where: { userId: user.id } }),
    db.emailVerificationCode.create({ data: { userId: user.id, codeHash: hashCode(code), expiresAt } }),
  ]);

  const result = await sendMail({
    to: user.email,
    subject: renderVerificationEmailSubject(),
    html: renderVerificationEmailHtml({ customerName: user.name, code }),
  });

  if (!result.sent && process.env.NODE_ENV !== "production") {
    // Email isn't configured locally (see .env.local.example) — print the
    // code so verification is still testable without real SMTP creds.
    console.log(`[dev only] Email verification code for ${user.email}: ${code}`);
  }

  return result.sent ? { sent: true } : { sent: false, error: result.error, status: result.status };
}

export type VerifyCodeResult =
  | { ok: true }
  | { ok: false; reason: "no_code" | "expired" | "too_many_attempts" | "incorrect" };

export async function verifyCode(userId: string, submittedCode: string): Promise<VerifyCodeResult> {
  const record = await db.emailVerificationCode.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return { ok: false, reason: "no_code" };

  if (record.expiresAt.getTime() <= Date.now()) {
    await db.emailVerificationCode.delete({ where: { id: record.id } });
    return { ok: false, reason: "expired" };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await db.emailVerificationCode.delete({ where: { id: record.id } });
    return { ok: false, reason: "too_many_attempts" };
  }

  // Comparing two fixed-length (64-char) hex hashes keeps this constant-time
  // regardless of where the submitted code differs from the real one.
  const match = safeEquals(hashCode(submittedCode), record.codeHash);
  if (!match) {
    await db.emailVerificationCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    return { ok: false, reason: "incorrect" };
  }

  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } }),
    db.emailVerificationCode.deleteMany({ where: { userId } }),
  ]);

  return { ok: true };
}
