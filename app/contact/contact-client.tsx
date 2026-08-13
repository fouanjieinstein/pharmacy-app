"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center py-12 text-center">
          <CheckCircle2 className="mb-3 size-10 text-brand-emerald-600" />
          <h2 className="font-display text-xl text-brand-navy-900">Message Received</h2>
          <p className="mt-2 max-w-sm text-sm text-brand-gray-500">
            Thank you, {form.name.split(" ")[0] || "there"}. Our support team will respond within one
            business day.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input id="contactName" label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input id="contactEmail" label="Email Address" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Input id="contactSubject" label="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Textarea id="contactMessage" label="Message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <Button type="submit" size="lg">Send Message</Button>
        </form>
      </CardBody>
    </Card>
  );
}
