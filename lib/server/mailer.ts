import "server-only";
import nodemailer from "nodemailer";

// Shared Gmail SMTP sender — see app/api/send-order-email/route.ts for the
// original single-purpose version this was factored out of. Requires
// EMAIL_USER and EMAIL_APP_PASSWORD (see .env.local.example). Callers should
// treat a missing config as a soft failure (log/notify), never as a reason to
// fail the surrounding request — see README's "Real Order Confirmation
// Emails" section.

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

export type SendMailResult = { sent: true } | { sent: false; error: string; status: 503 | 502 };

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  const emailUser = process.env.EMAIL_USER;
  const emailAppPassword = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailAppPassword) {
    return {
      sent: false,
      status: 503,
      error:
        "Email sending is not configured on this server. Set EMAIL_USER and EMAIL_APP_PASSWORD in .env.local (see .env.local.example).",
    };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailAppPassword },
  });

  try {
    await transporter.sendMail({
      from: `"Meridian Health" <${emailUser}>`,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
    return { sent: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { sent: false, status: 502, error: "Email provider rejected the send request." };
  }
}
