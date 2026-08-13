"use client";

import { useState, type FormEvent } from "react";
import { useAuth, useAuthUser } from "@/lib/context/auth-context";
import { useToast } from "@/lib/context/toast-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export function ProfileTab() {
  const user = useAuthUser();
  const { refresh } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFields({});
    setSaving(true);

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setFields(data.fields ?? {});
      showToast(data.error ?? "Could not save your profile.", "error");
      return;
    }

    await refresh();
    showToast("Profile updated.", "success");
  };

  return (
    <Card>
      <CardBody>
        <h2 className="font-display mb-4 text-lg text-brand-navy-900">Profile Information</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="profileName"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fields.name}
          />
          <Input
            id="profilePhone"
            type="tel"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fields.phone}
          />
          <div className="sm:col-span-2">
            <Input
              id="profileEmail"
              type="email"
              label="Email Address"
              value={user.email}
              disabled
              hint="Changing your email requires verification — contact support to update it."
              onChange={() => {}}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" loading={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
