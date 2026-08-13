import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";
import { LoginClient } from "@/app/login/login-client";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already signed in — no reason to show the form again.
  const user = await getSessionUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <Suspense>
        <LoginClient />
      </Suspense>
    </div>
  );
}
