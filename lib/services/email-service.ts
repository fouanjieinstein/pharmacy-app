import type { OrderEmailPayload } from "@/lib/email/templates";

// Thin client-side wrapper around POST /api/send-order-email. Failures are
// swallowed into a typed result rather than thrown — a failed confirmation
// email should never block or roll back an already-completed checkout.

export interface SendOrderEmailInput extends OrderEmailPayload {
  to: string;
}

export interface SendOrderEmailResult {
  sent: boolean;
  error?: string;
}

export async function sendOrderEmail(input: SendOrderEmailInput): Promise<SendOrderEmailResult> {
  try {
    const res = await fetch("/api/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    return { sent: Boolean(data.sent), error: data.error };
  } catch {
    return { sent: false, error: "Network error while sending confirmation email." };
  }
}
