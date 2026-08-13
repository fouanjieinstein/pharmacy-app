import { NextResponse } from "next/server";
import { renderOrderEmailHtml, renderOrderEmailSubject, type OrderEmailPayload } from "@/lib/email/templates";
import { sendMail } from "@/lib/server/mailer";

// ---------------------------------------------------------------------------
// Sends real transactional order-confirmation / payment-failure emails via
// Gmail SMTP. This is the one genuinely server-side integration point in an
// otherwise mock/frontend-only prototype.
//
// Requires EMAIL_USER and EMAIL_APP_PASSWORD to be set as environment
// variables in a local .env.local file (never committed — see
// .env.local.example). Without them, this route responds 503 rather than
// throwing, so a missing/unconfigured mailbox never breaks checkout.
// ---------------------------------------------------------------------------

const MAX_ITEMS = 100;
const MAX_STRING_LENGTH = 500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RequestBody extends OrderEmailPayload {
  to: string;
}

function isValidPayload(body: unknown): body is RequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Partial<RequestBody>;
  if (typeof b.to !== "string" || !EMAIL_REGEX.test(b.to)) return false;
  if (typeof b.customerName !== "string" || b.customerName.length > MAX_STRING_LENGTH) return false;
  if (b.status !== "succeeded" && b.status !== "failed") return false;
  if (typeof b.currency !== "string" || b.currency.length > 5) return false;
  if (!Array.isArray(b.items) || b.items.length > MAX_ITEMS) return false;
  for (const item of b.items) {
    if (typeof item.name !== "string" || item.name.length > MAX_STRING_LENGTH) return false;
    if (typeof item.quantity !== "number" || typeof item.unitPrice !== "number") return false;
  }
  if (typeof b.subtotal !== "number" || typeof b.shipping !== "number" || typeof b.tax !== "number" || typeof b.total !== "number") {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ sent: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ sent: false, error: "Invalid or missing fields in request body." }, { status: 400 });
  }

  const result = await sendMail({
    to: body.to,
    subject: renderOrderEmailSubject(body),
    html: renderOrderEmailHtml(body),
  });

  if (!result.sent) {
    return NextResponse.json({ sent: false, error: result.error }, { status: result.status });
  }
  return NextResponse.json({ sent: true });
}
