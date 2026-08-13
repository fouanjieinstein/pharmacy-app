"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { useToast } from "@/lib/context/toast-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export function RegisterClient() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFields({});
    setSubmitting(true);
    const result = await register(form);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Sign-up failed.");
      setFields(result.fields ?? {});
      return;
    }
    showToast(
      result.emailVerificationSent
        ? "Account created — check your email for a verification code."
        : "Account created. We couldn't send a verification email — you can request one from your account.",
      result.emailVerificationSent ? "success" : "info"
    );
    router.push(next);
    router.refresh();
  };

  return (
    <Card>
      <CardBody className="p-6 sm:p-8">
        <h1 className="font-display text-2xl text-brand-navy-900">Create Your Account</h1>
        <p className="mt-1.5 text-sm text-brand-gray-500">
          Track orders, manage prescriptions, and book consultations and lab tests.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="registerName"
            label="Full Name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={fields.name}
          />
          <Input
            id="registerEmail"
            type="email"
            label="Email Address"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={fields.email}
          />
          <Input
            id="registerPhone"
            type="tel"
            label="Phone Number (optional)"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={fields.phone}
          />
          <Input
            id="registerPassword"
            type="password"
            label="Password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={fields.password}
            hint="At least 10 characters. Longer passphrases are stronger than short complex ones."
          />

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-sm bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <XCircle className="mt-0.5 size-4 shrink-0" /> {error}
            </div>
          )}

          <div className="flex items-start gap-2 rounded-sm bg-brand-gray-50 px-3.5 py-2.5 text-xs text-brand-gray-500">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-emerald-600" />
            Your password is hashed with argon2id and never stored in readable form.
          </div>

          <Button type="submit" fullWidth size="lg" loading={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-gray-500">
          Already have an account?{" "}
          <Link
            href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-brand-emerald-700 underline"
          >
            Sign in
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
