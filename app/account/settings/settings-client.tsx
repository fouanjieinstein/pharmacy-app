"use client";

import { Tabs } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/account/profile-tab";
import { AddressesTab } from "@/components/account/addresses-tab";
import { PaymentMethodsTab } from "@/components/account/payment-methods-tab";
import { MembershipTab } from "@/components/account/membership-tab";
import { WishlistTab } from "@/components/account/wishlist-tab";
import { NotificationsTab } from "@/components/account/notifications-tab";

export function SettingsClient() {
  return (
    <Tabs
      items={[
        { id: "profile", label: "Profile", content: <ProfileTab /> },
        { id: "addresses", label: "Saved Addresses", content: <AddressesTab /> },
        { id: "payment", label: "Payment Methods", content: <PaymentMethodsTab /> },
        { id: "membership", label: "Meridian Plus", content: <MembershipTab /> },
        { id: "wishlist", label: "Wishlist", content: <WishlistTab /> },
        { id: "notifications", label: "Notifications", content: <NotificationsTab /> },
      ]}
    />
  );
}
