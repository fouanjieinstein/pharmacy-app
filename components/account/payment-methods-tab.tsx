"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { addPaymentMethodFromCardInput, listPaymentMethods, removePaymentMethod } from "@/lib/services/payment-methods-service";
import type { SavedPaymentMethod } from "@/types";
import { useToast } from "@/lib/context/toast-context";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export function PaymentMethodsTab() {
  const [methods, setMethods] = useState<SavedPaymentMethod[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const { showToast } = useToast();

  useEffect(() => setMethods(listPaymentMethods()), []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const [expiryMonth, expiryYear] = expiry.split("/").map(Number);
    addPaymentMethodFromCardInput({ cardNumber, expiryMonth, expiryYear });
    setMethods(listPaymentMethods());
    setModalOpen(false);
    setCardNumber("");
    setExpiry("");
    showToast("Payment method saved.", "success");
  };

  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-brand-navy-900">Payment Methods</h2>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Add Card
          </Button>
        </div>

        {methods.length === 0 ? (
          <EmptyState icon={<CreditCard className="size-10" />} title="No saved payment methods" description="Add a card to speed up future checkouts." />
        ) : (
          <div className="space-y-3">
            {methods.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-md border border-brand-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-sm bg-brand-gray-100 text-brand-gray-600">
                    <CreditCard className="size-5" />
                  </span>
                  <div className="text-sm">
                    <p className="font-medium capitalize text-brand-navy-900">
                      {m.brand} •••• {m.last4} {m.isDefault && <Badge variant="emerald" className="ml-1.5">Default</Badge>}
                    </p>
                    <p className="text-xs text-brand-gray-500">Expires {String(m.expiryMonth).padStart(2, "0")}/{m.expiryYear} · via {m.provider}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removePaymentMethod(m.id);
                    setMethods(listPaymentMethods());
                  }}
                  aria-label="Remove payment method"
                  className="text-brand-gray-400 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-brand-gray-400">
          Only a tokenized reference, card brand, last 4 digits, and expiry are stored. Full card numbers and
          CVV/CVC are never saved.
        </p>
      </CardBody>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Payment Method">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="pmCardNumber"
            label="Card Number"
            required
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <Input
            id="pmExpiry"
            label="Expiry (MM/YY)"
            required
            autoComplete="cc-exp"
            placeholder="12/28"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
          <p className="text-xs text-brand-gray-400">
            We don&apos;t collect or store your CVV — saved cards never require it for future charges.
          </p>
          <Button type="submit" fullWidth>Save Card</Button>
        </form>
      </Modal>
    </Card>
  );
}
