"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/**
 * Shown in place of a booking/purchase action when the visitor isn't signed
 * in. Preserves where they were so they land back here after authenticating.
 */
export function SignInPrompt({ message }: { message: string }) {
  const pathname = usePathname();
  const next = encodeURIComponent(pathname ?? "/");

  return (
    <div className="rounded-md border border-brand-gray-200 bg-brand-gray-50 p-5 text-center">
      <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-white text-brand-emerald-600">
        <LogIn className="size-5" />
      </span>
      <p className="text-sm text-brand-gray-600">{message}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href={`/login?next=${next}`} className={buttonVariants({ size: "sm" })}>
          Sign In
        </Link>
        <Link href={`/register?next=${next}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Create Account
        </Link>
      </div>
    </div>
  );
}
