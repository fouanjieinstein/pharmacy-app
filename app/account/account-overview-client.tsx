"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, FileText, Heart, Stethoscope, FlaskConical, ArrowRight } from "lucide-react";
import { useAuthUser } from "@/lib/context/auth-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { listOrders } from "@/lib/services/order-service";
import { listPrescriptions } from "@/lib/services/prescription-service";
import { listConsultations } from "@/lib/services/consultation-service";
import { listLabBookings } from "@/lib/services/lab-booking-service";
import { formatMoney } from "@/lib/data/currencies";
import type { Order, PrescriptionUpload, Consultation, LabBooking } from "@/types";
import { Card, CardBody } from "@/components/ui/card";
import { PrescriptionStatusBadge } from "@/components/prescription/status-badge";

export function AccountOverviewClient() {
  const user = useAuthUser();
  const { items: wishlistItems } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionUpload[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
    listPrescriptions()
      .then(setPrescriptions)
      .catch(() => setPrescriptions([]));
    listConsultations()
      .then(setConsultations)
      .catch(() => setConsultations([]));
    listLabBookings()
      .then(setLabBookings)
      .catch(() => setLabBookings([]));
  }, [user.id]);

  const stats = [
    { label: "Orders Placed", value: orders.length, icon: ShoppingBag, href: "/account/orders" },
    { label: "Prescriptions", value: prescriptions.length, icon: FileText, href: "/account/prescriptions" },
    { label: "Consultations", value: consultations.length, icon: Stethoscope, href: "/account/consultations" },
    { label: "Lab Bookings", value: labBookings.length, icon: FlaskConical, href: "/account/lab-bookings" },
    { label: "Wishlist Items", value: wishlistItems.length, icon: Heart, href: "/account/settings" },
  ];

  return (
    <div className="space-y-8">
      <p className="text-sm text-brand-gray-600">Welcome back, {user.name.split(" ")[0]}.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardBody className="flex items-center gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-emerald-50 text-brand-emerald-600">
                  <stat.icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-2xl text-brand-navy-900">{stat.value}</p>
                  <p className="text-xs text-brand-gray-500">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg text-brand-navy-900">Recent Orders</h2>
          <Link href="/account/orders" className="flex items-center gap-1 text-sm font-medium text-brand-emerald-700 hover:underline">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <Card><CardBody className="text-sm text-brand-gray-500">No orders yet. Start shopping to see your order history here.</CardBody></Card>
        ) : (
          <div className="space-y-2.5">
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id}>
                <CardBody className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-brand-navy-900">{order.orderNumber}</p>
                    <p className="text-xs text-brand-gray-500">{new Date(order.placedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-medium text-brand-navy-900">{formatMoney(order.totalUsd, order.currency)}</span>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg text-brand-navy-900">Recent Prescriptions</h2>
          <Link href="/account/prescriptions" className="flex items-center gap-1 text-sm font-medium text-brand-emerald-700 hover:underline">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {prescriptions.length === 0 ? (
          <Card><CardBody className="text-sm text-brand-gray-500">No prescriptions uploaded yet.</CardBody></Card>
        ) : (
          <div className="space-y-2.5">
            {prescriptions.slice(0, 3).map((rx) => (
              <Card key={rx.id}>
                <CardBody className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-brand-navy-900">{rx.fileName}</p>
                  <PrescriptionStatusBadge status={rx.status} />
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
