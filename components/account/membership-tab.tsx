// components/account/membership-tab.tsx
"use client";

import { useMembership } from "@/lib/context/membership-context";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MembershipTab() {
  const { status } = useMembership();

  if (!status.active) {
    return (
      <Card>
        <CardBody>
          <h2 className="font-display text-lg text-brand-navy-900">Membership</h2>
          <p className="mt-2 text-sm text-brand-gray-500">
            You are not currently a Meridian Plus member.
          </p>
          <Link href="/plus">
            <Button className="mt-4">View Plans</Button>
          </Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <h2 className="font-display text-lg text-brand-navy-900">Meridian Plus</h2>
        <p className="mt-2 text-sm text-brand-gray-500">
          Active · renews on {status.renewsAt ? new Date(status.renewsAt).toLocaleDateString() : "N/A"}
        </p>
        <p className="mt-1 text-xs text-brand-gray-400">
          Plan: {status.planId}
        </p>
        <Link href="/plus">
          <Button variant="outline" size="sm" className="mt-4">
            Manage Membership
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
}