import { ShieldCheck, Crown } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useCurrency } from "@/lib/context/currency-context";
import { useMembership } from "@/lib/context/membership-context";
import { Card, CardBody } from "@/components/ui/card";
import { ProductImage } from "@/components/products/product-image";

export function OrderSummarySidebar({
  shippingUsd = 0,
  shippingLabel,
}: {
  shippingUsd?: number;
  shippingLabel?: string;
}) {
  const { activeItems, productFor, subtotalUsd, unitPriceFor } = useCart();
  const { format } = useCurrency();
  const { isPlusMember } = useMembership();
  const taxUsd = Math.round(subtotalUsd * 0.05 * 100) / 100;
  const total = subtotalUsd + shippingUsd + taxUsd;
  const memberSavingsUsd = activeItems.reduce((sum, item) => {
    const product = productFor(item.productId);
    if (!product) return sum;
    return sum + (product.priceUsd - unitPriceFor(item.productId)) * item.quantity;
  }, 0);

  return (
    <Card className="sticky top-24">
      <CardBody>
        <h2 className="font-display mb-4 text-lg text-brand-navy-900">Order Summary</h2>
        <ul className="scrollbar-thin max-h-64 space-y-3 overflow-y-auto">
          {activeItems.map((item) => {
            const product = productFor(item.productId);
            if (!product) return null;
            return (
              <li key={item.productId} className="flex items-center gap-3">
                <ProductImage variant={product.images[0]} group={product.group} className="size-12 shrink-0 rounded-sm" iconClassName="size-5" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-medium text-brand-navy-900">{product.name}</p>
                  <p className="text-xs text-brand-gray-500">Qty {item.quantity}</p>
                </div>
                <span className="whitespace-nowrap text-xs font-semibold text-brand-navy-900">
                  {format(unitPriceFor(item.productId) * item.quantity)}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 space-y-2 border-t border-brand-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-brand-gray-600">
            <span>Subtotal</span>
            <span className="text-brand-navy-900">{format(subtotalUsd)}</span>
          </div>
          <div className="flex justify-between text-brand-gray-600">
            <span>Shipping {shippingLabel ? `(${shippingLabel})` : ""}</span>
            <span className="text-brand-navy-900">
              {shippingUsd > 0 ? format(shippingUsd) : shippingLabel ? (isPlusMember ? "Free with Plus" : "Free") : "—"}
            </span>
          </div>
          <div className="flex justify-between text-brand-gray-600">
            <span>Estimated taxes/fees</span>
            <span className="text-brand-navy-900">{format(taxUsd)}</span>
          </div>
          {memberSavingsUsd > 0 && (
            <div className="flex justify-between font-medium text-brand-gold-700">
              <span className="flex items-center gap-1"><Crown className="size-3.5" /> Plus savings</span>
              <span>-{format(memberSavingsUsd)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-brand-gray-200 pt-4">
          <span className="font-medium text-brand-navy-900">Total</span>
          <span className="font-display text-xl text-brand-navy-900">{format(total)}</span>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-sm bg-brand-gray-50 px-3 py-2.5 text-xs text-brand-gray-500">
          <ShieldCheck className="size-4 shrink-0 text-brand-emerald-600" />
          Secure checkout · Card details are tokenized, never stored raw.
        </div>
      </CardBody>
    </Card>
  );
}
