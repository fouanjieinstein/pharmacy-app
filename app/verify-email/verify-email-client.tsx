"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MailCheck, XCircle } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useToast } from "@/lib/context/toast-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export function VerifyEmailClient({ email }: { email: string }) {
  const { verifyEmail, resendVerification } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await verifyEmail(code);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Verification failed.");
      return;
    }
    showToast("Email verified.", "success");
    router.push("/account");
    router.refresh();
  };

  const handleResend = async () => {
    setResending(true);
    const result = await resendVerification();
    setResending(false);
    showToast(result.ok ? "A new code has been sent." : (result.error ?? "Couldn't resend the code."), result.ok ? "success" : "error");
  };

  return (
    <Card>
      <CardBody className="p-6 sm:p-8">
        <span className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
          <MailCheck className="size-5" />
        </span>
        <h1 className="font-display text-center text-2xl text-brand-navy-900">Verify Your Email</h1>
        <p className="mt-1.5 text-center text-sm text-brand-gray-500">
          Enter the 6-digit code we sent to <span className="font-medium text-brand-navy-900">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="verificationCode"
            label="Verification Code"
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="text-center text-lg tracking-[0.5em]"
          />

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-sm bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <XCircle className="mt-0.5 size-4 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={submitting} disabled={code.length !== 6}>
            {submitting ? "Verifying…" : "Verify Email"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-gray-500">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-brand-emerald-700 underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>
      </CardBody>
    </Card>
  );
}
