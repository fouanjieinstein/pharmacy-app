import type { Metadata } from "next";
import { AccountOverviewClient } from "@/app/account/account-overview-client";

export const metadata: Metadata = { title: "Account Overview", robots: { index: false, follow: false } };

export default function AccountPage() {
  return <AccountOverviewClient />;
}
