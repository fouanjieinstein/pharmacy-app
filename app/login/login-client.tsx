"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export function LoginClient() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFields({});
    setSubmitting(true);
    const result = await login({ email, password });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Sign-in failed.");
      setFields(result.fields ?? {});
      return;
    }
    router.push(next);
    router.refresh();
  };

  return (
    <Card>
      <CardBody className="p-6 sm:p-8">
        <h1 className="font-display text-2xl text-brand-navy-900">Sign In</h1>
        <p className="mt-1.5 text-sm text-brand-gray-500">
          Access your orders, prescriptions, and bookings.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="loginEmail"
            type="email"
            label="Email Address"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fields.email}
          />
          <Input
            id="loginPassword"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fields.password}
          />

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-sm bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <XCircle className="mt-0.5 size-4 shrink-0" /> {error}
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-brand-emerald-700 underline"
          >
            Create one
          </Link>
        </p>
      </CardBody>
    </Card>
  );
}
