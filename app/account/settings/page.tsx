import type { Metadata } from "next";
import { SettingsClient } from "@/app/account/settings/settings-client";

export const metadata: Metadata = { title: "Account Settings", robots: { index: false, follow: false } };

export default function AccountSettingsPage() {
  return <SettingsClient />;
}
