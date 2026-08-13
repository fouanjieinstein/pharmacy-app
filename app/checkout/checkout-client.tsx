"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { useCurrency } from "@/lib/context/currency-context";
import { useCountry } from "@/lib/context/country-context";
import { useAuthUser } from "@/lib/context/auth-context";
import { useToast } from "@/lib/context/toast-context";
import { createOrder } from "@/lib/services/order-service";
import { sendOrderEmail } from "@/lib/services/email-service";
import { Stepper, type StepDef } from "@/components/checkout/stepper";
import { OrderSummarySidebar } from "@/components/checkout/order-summary-sidebar";
import { StepCustomerInfo, type CustomerInfo } from "@/components/checkout/step-customer-info";
import { StepShippingAddress, type ShippingAddressForm } from "@/components/checkout/step-shipping-address";
import { StepCountryEligibility } from "@/components/checkout/step-country-eligibility";
import { StepPrescription } from "@/components/checkout/step-prescription";
import { StepShippingMethod } from "@/components/checkout/step-shipping-method";
import { StepPayment } from "@/components/checkout/step-payment";
import { Card, CardBody } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader2, ShoppingBag } from "lucide-react";
import type { PaymentTransaction, ShippingMethod } from "@/types";

type StepKey = "customer" | "address" | "eligibility" | "prescription" | "shipping" | "payment";

export function CheckoutClient() {
  const { activeItems, hasPrescriptionItems, clearCart, productFor, unitPriceFor, subtotalUsd } = useCart();
  const { currency, convert } = useCurrency();
  const { countryCode, setCountryCode } = useCountry();
  const user = useAuthUser();
  const { showToast } = useToast();
  const router = useRouter();
  const [placingOrder, setPlacingOrder] = useState(false);

  const steps: StepKey[] = useMemo(
    () => ["customer", "address", "eligibility", ...(hasPrescriptionItems ? (["prescription"] as const) : []), "shipping", "payment"],
    [hasPrescriptionItems]
  );
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ fullName: user.name, email: user.email, phone: "" });
  const [address, setAddress] = useState<ShippingAddressForm>({
    fullName: user.name,
    phone: "",
    email: user.email,
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: countryCode,
  });
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);

  const stepDefs: StepDef[] = steps.map((key, i) => ({
    id: i + 1,
    label: {
      customer: "Customer Info",
      address: "Shipping Address",
      eligibility: "Eligibility",
      prescription: "Prescription",
      shipping: "Shipping Method",
      payment: "Payment",
    }[key],
  }));

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const shippingUsd = shippingMethod?.priceUsd ?? 0;
  const taxUsd = Math.round(subtotalUsd * 0.05 * 100) / 100;

  const emailItems = activeItems.map((item) => ({
    name: productFor(item.productId)?.name ?? "Item",
    quantity: item.quantity,
    unitPrice: convert(unitPriceFor(item.productId)),
  }));

  const handlePaymentSuccess = async (transaction: PaymentTransaction) => {
    setPlacingOrder(true);
    let order;
    try {
      order = await createOrder({
        cartItems: activeItems,
        unitPriceFor,
        shippingAddress: address,
        shippingMethodId: shippingMethod?.id ?? "standard-intl",
        shippingCostUsd: shippingUsd,
        currency,
        payment: transaction,
        prescriptionId: prescriptionId ?? undefined,
      });
    } catch (err) {
      setPlacingOrder(false);
      showToast(
        err instanceof Error ? err.message : "Payment succeeded but we couldn't save your order. Please contact support.",
        "error"
      );
      return;
    }

    clearCart();
    showToast("Payment confirmed — your order has been placed.", "success");

    sendOrderEmail({
      to: user.email,
      customerName: user.name,
      status: "succeeded",
      orderNumber: order.orderNumber,
      currency,
      items: emailItems,
      subtotal: convert(subtotalUsd),
      shipping: convert(shippingUsd),
      tax: convert(taxUsd),
      total: convert(subtotalUsd + shippingUsd + taxUsd),
      shippingAddressLines: [
        address.fullName,
        address.addressLine1 + (address.addressLine2 ? `, ${address.addressLine2}` : ""),
        `${address.city}, ${address.stateProvince} ${address.postalCode}`,
      ],
      shippingMethodName: shippingMethod?.name,
    }).then((result) => {
      if (!result.sent) showToast("Order placed — confirmation email could not be sent.", "info");
    });

    router.push(`/order-confirmation?order=${order.orderNumber}`);
  };

  const handlePaymentDeclined = (failureReason: string) => {
    sendOrderEmail({
      to: user.email,
      customerName: user.name,
      status: "failed",
      currency,
      items: emailItems,
      subtotal: convert(subtotalUsd),
      shipping: convert(shippingUsd),
      tax: convert(taxUsd),
      total: convert(subtotalUsd + shippingUsd + taxUsd),
      failureReason,
    });
  };

  useEffect(() => {
    setAddress((a) => ({ ...a, country: countryCode }));
  }, [countryCode]);

  if (activeItems.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-12" />}
        title="Your cart is empty"
        description="Add items to your cart before proceeding to checkout."
        action={
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Browse Shop
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <Stepper steps={stepDefs} currentStep={stepIndex + 1} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardBody className="p-6 sm:p-8">
            {currentStep === "customer" && (
              <StepCustomerInfo
                value={customerInfo}
                onNext={(data) => {
                  setCustomerInfo(data);
                  setAddress((a) => ({ ...a, fullName: data.fullName, email: data.email, phone: data.phone }));
                  next();
                }}
              />
            )}
            {currentStep === "address" && (
              <StepShippingAddress
                value={address}
                onBack={back}
                onNext={(data) => {
                  setAddress(data);
                  setCountryCode(data.country);
                  next();
                }}
              />
            )}
            {currentStep === "eligibility" && (
              <StepCountryEligibility destinationCountry={address.country} onBack={back} onNext={next} />
            )}
            {currentStep === "prescription" && (
              <StepPrescription
                selectedId={prescriptionId}
                onBack={back}
                onNext={(id) => {
                  setPrescriptionId(id);
                  next();
                }}
              />
            )}
            {currentStep === "shipping" && (
              <StepShippingMethod
                destinationCountry={address.country}
                selectedId={shippingMethod?.id ?? null}
                onBack={back}
                onNext={(method) => {
                  setShippingMethod(method);
                  next();
                }}
              />
            )}
            {currentStep === "payment" && placingOrder && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <Loader2 className="size-8 animate-spin text-brand-emerald-600" />
                <p className="text-sm text-brand-gray-600">Confirming your order…</p>
              </div>
            )}
            {currentStep === "payment" && !placingOrder && (
              <StepPayment
                amountUsd={subtotalUsd + shippingUsd + taxUsd}
                currency={currency}
                customerId={user.id}
                onBack={back}
                onNext={handlePaymentSuccess}
                onDeclined={handlePaymentDeclined}
              />
            )}
          </CardBody>
        </Card>

        <OrderSummarySidebar shippingUsd={shippingMethod?.priceUsd ?? 0} shippingLabel={shippingMethod?.name} />
      </div>
    </div>
  );
}
