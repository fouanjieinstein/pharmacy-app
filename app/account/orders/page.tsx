import type { Metadata } from "next";
import { OrdersClient } from "@/app/account/orders/orders-client";

export const metadata: Metadata = { title: "My Orders", robots: { index: false, follow: false } };

export default function AccountOrdersPage() {
  return <OrdersClient />;
}
