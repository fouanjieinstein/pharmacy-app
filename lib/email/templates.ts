import { company } from "@/lib/data/company";

export interface OrderEmailLineItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEmailPayload {
  customerName: string;
  status: "succeeded" | "failed";
  orderNumber?: string;
  currency: string;
  items: OrderEmailLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddressLines?: string[];
  shippingMethodName?: string;
  failureReason?: string;
}

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

const BRAND_NAVY = "#0f172a";
const BRAND_EMERALD = "#059669";
const BRAND_RED = "#dc2626";

export function layout(bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f8fafc;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
            <tr>
              <td style="background-color:${BRAND_NAVY};padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;">Meridian Health</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background-color:#f1f5f9;padding:24px 32px;font-size:12px;color:#64748b;line-height:1.6;">
                <p style="margin:0 0 8px;">${company.legalName}</p>
                <p style="margin:0 0 8px;">${company.addressLines.join(", ")}</p>
                <p style="margin:0 0 8px;">
                  Questions? Contact us at
                  <a href="mailto:${company.supportEmail}" style="color:${BRAND_EMERALD};">${company.supportEmail}</a>
                  or ${company.phone}
                </p>
                <p style="margin:16px 0 0;color:#94a3b8;">
                  Information in this email is for order-related purposes only and does not replace advice
                  from a qualified healthcare professional.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function itemsTable(items: OrderEmailLineItem[], currency: string): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:${BRAND_NAVY};font-size:14px;">${item.name} × ${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:${BRAND_NAVY};font-size:14px;text-align:right;">${money(item.unitPrice * item.quantity, currency)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${rows}</table>`;
}

function totalsTable(payload: OrderEmailPayload): string {
  const { subtotal, shipping, tax, total, currency } = payload;
  const row = (label: string, value: string, bold = false) => `
    <tr>
      <td style="padding:4px 0;font-size:${bold ? "15px" : "13px"};color:${bold ? BRAND_NAVY : "#64748b"};font-weight:${bold ? "700" : "400"};">${label}</td>
      <td style="padding:4px 0;font-size:${bold ? "15px" : "13px"};color:${bold ? BRAND_NAVY : "#64748b"};font-weight:${bold ? "700" : "400"};text-align:right;">${value}</td>
    </tr>`;
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      ${row("Subtotal", money(subtotal, currency))}
      ${row("Shipping", shipping > 0 ? money(shipping, currency) : "Free")}
      ${row("Taxes / fees", money(tax, currency))}
      ${row("Total", money(total, currency), true)}
    </table>`;
}

export function renderOrderEmailSubject(payload: OrderEmailPayload): string {
  return payload.status === "succeeded"
    ? `Order Confirmed — ${payload.orderNumber}`
    : `Payment Failed — Meridian Health Order`;
}

export function renderOrderEmailHtml(payload: OrderEmailPayload): string {
  if (payload.status === "failed") {
    return layout(`
      <h1 style="margin:0 0 8px;font-size:20px;color:${BRAND_RED};">Payment Could Not Be Processed</h1>
      <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6;">
        Hi ${payload.customerName}, we were unable to process payment for your recent order.
        ${payload.failureReason ? `<br/><strong>Reason:</strong> ${payload.failureReason}` : ""}
      </p>
      <h2 style="margin:24px 0 0;font-size:14px;color:${BRAND_NAVY};">Items in your attempted order</h2>
      ${itemsTable(payload.items, payload.currency)}
      ${totalsTable(payload)}
      <p style="margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;">
        No charge was made to your payment method. Please try again from your cart, or use a different
        payment method.
      </p>
    `);
  }

  return layout(`
    <h1 style="margin:0 0 8px;font-size:20px;color:${BRAND_EMERALD};">Payment Confirmed</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6;">
      Hi ${payload.customerName}, thank you for your order. Your order
      <strong>${payload.orderNumber}</strong> has been confirmed.
    </p>
    <h2 style="margin:24px 0 0;font-size:14px;color:${BRAND_NAVY};">Order Summary</h2>
    ${itemsTable(payload.items, payload.currency)}
    ${totalsTable(payload)}
    ${
      payload.shippingAddressLines
        ? `<h2 style="margin:24px 0 8px;font-size:14px;color:${BRAND_NAVY};">Shipping To</h2>
           <p style="margin:0;font-size:13px;color:#334155;line-height:1.6;">${payload.shippingAddressLines.join("<br/>")}</p>`
        : ""
    }
    ${
      payload.shippingMethodName
        ? `<p style="margin:8px 0 0;font-size:13px;color:#64748b;">Shipping method: ${payload.shippingMethodName}</p>`
        : ""
    }
    <p style="margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;">
      ${
        payload.items.length > 0
          ? "If your order includes prescription items, our pharmacist team will review them before dispatch."
          : ""
      }
      You can track this order any time from your Meridian Health account.
    </p>
  `);
}

export function renderVerificationEmailSubject(): string {
  return "Verify your email — Meridian Health";
}

export function renderVerificationEmailHtml(input: { customerName: string; code: string }): string {
  return layout(`
    <h1 style="margin:0 0 8px;font-size:20px;color:${BRAND_NAVY};">Verify Your Email</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.6;">
      Hi ${input.customerName}, enter this code to verify your Meridian Health account:
    </p>
    <p style="margin:0 0 20px;text-align:center;">
      <span style="display:inline-block;padding:14px 28px;border-radius:8px;background-color:#f1f5f9;font-size:32px;font-weight:700;letter-spacing:8px;color:${BRAND_NAVY};">${input.code}</span>
    </p>
    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
      This code expires in 15 minutes. If you didn't create a Meridian Health account, you can safely
      ignore this email.
    </p>
  `);
}
