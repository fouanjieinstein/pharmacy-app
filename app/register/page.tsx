import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";
import { RegisterClient } from "@/app/register/register-client";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect("/account");

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <Suspense>
        <RegisterClient />
      </Suspense>
    </div>
  );
}
