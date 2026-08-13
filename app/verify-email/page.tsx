import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";
import { VerifyEmailClient } from "@/app/verify-email/verify-email-client";

export const metadata: Metadata = {
  title: "Verify Your Email",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/verify-email");
  if (user.emailVerifiedAt) redirect("/account");

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <VerifyEmailClient email={user.email} />
    </div>
  );
}
