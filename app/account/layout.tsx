import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/session";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { EmailVerificationBanner } from "@/components/account/email-verification-banner";

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  // Server-side gate. Every /account/* page is behind this — the client-side
  // context is only a rendering cache and is never trusted for access control.
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="font-display mb-8 text-3xl text-brand-navy-900">My Account</h1>
      <EmailVerificationBanner />
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
