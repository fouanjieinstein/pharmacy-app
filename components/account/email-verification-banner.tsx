"use client";

import Link from "next/link";
import { MailWarning } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { buttonVariants } from "@/components/ui/button";

/** Non-blocking prompt shown to signed-in users who haven't verified their
 * email yet. Doesn't gate any functionality — see /verify-email for the flow. */
export function EmailVerificationBanner() {
  const { isSignedIn, isEmailVerified } = useAuth();

  if (!isSignedIn || isEmailVerified) return null;

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-md border border-brand-gold-100 bg-brand-gold-50 p-4 sm:flex-row sm:items-center">
      <div className="flex items-start gap-2.5 text-sm text-brand-gold-700">
        <MailWarning className="mt-0.5 size-4 shrink-0" />
        <span>Please verify your email address to secure your account.</span>
      </div>
      <Link href="/verify-email" className={buttonVariants({ variant: "gold", size: "sm" })}>
        Verify Email
      </Link>
    </div>
  );
}
