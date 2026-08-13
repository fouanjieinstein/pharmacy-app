# Meridian Health — Premium International Pharmacy (Front-End Prototype)

A production-quality **front-end prototype** for a premium international online pharmacy headquartered
in India. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

> **This is a front-end prototype with one real integration.** There is no real payment processor,
> prescription verification system, or pharmaceutical dispensing system behind it — those are all mock
> data seeded in `lib/data/` and `lib/services/`, persisted only to the browser's `localStorage` for demo
> continuity (cart, wishlist, orders, prescriptions, saved addresses, saved payment method references).
> The **one exception** is order-confirmation email, which sends a real email via Gmail SMTP when
> configured — see [Real Order Confirmation Emails](#real-order-confirmation-emails) below. See
> [`ARCHITECTURE.md`](./ARCHITECTURE.md) for how the rest of this would connect to a real backend.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build (type-checks + prerenders static routes)
npm run start   # serve the production build
npm run lint    # eslint
```

## What's Implemented

- **Catalog**: 50 mock products across OTC, prescription, wellness, and premium specialty/biologic
  medications ($60–$450), with filtering, sorting, search, category/ailment browsing, and detailed
  product pages (indications, warnings, contraindications, side effects, FAQs).
- **Doctor consultations** (`/consult`): browse 10 doctors across 10 specialties, filter by specialty,
  book a video consultation (time slot + mock payment), manage bookings from `/account/consultations`.
- **Meridian Plus membership** (`/plus`): monthly/annual subscription plans granting 5% member pricing
  (applied live across product cards, product pages, cart, and checkout), free Standard International
  shipping, and a "Plus savings" line at checkout. Managed from `/account/settings` → Meridian Plus tab.
- **Prescriptions**: mock drag-and-drop upload (PDF/JPG/PNG, 10 MB limit) with a simulated
  pending → under-review → approved/rejected/info-required lifecycle.
- **Cart & multi-step checkout**: sign-up (name + email, no password) → shipping address →
  destination-country eligibility → prescription verification (if applicable) → shipping method →
  payment → confirmation.
- **Payments**: mock, tokenized card charge simulation (`lib/services/payment-service.ts`) with a
  simulated decline path. **No raw card number, CVV/CVC, or PIN is ever persisted** — see
  [Security](#security-notes) below.
- **Real order-confirmation email**: on payment success or decline, a real email is sent from
  `fouanjieinstein@gmail.com` to the address collected at checkout sign-up, itemizing what was
  purchased, totals, and shipping details (or the decline reason). See
  [Real Order Confirmation Emails](#real-order-confirmation-emails).
- **Multi-currency**: USD, EUR, GBP, CAD, INR, AED, XAF with mock exchange rates, applied live across
  product cards, product pages, cart, and checkout.
- **Multi-country shipping eligibility**: destination-country rules (Rx import allowed, cold-chain
  availability, customs notices, delivery estimates) evaluated per cart item at checkout.
- **Order tracking**: a 10-step visual timeline (Order Placed → Delivered) driven by mock order state.
- **Account dashboard**: orders, prescriptions, saved addresses, saved (tokenized) payment methods,
  wishlist, notification preferences, and a role-preview switcher for demoing RBAC.
- **Admin console** (`/admin`): dashboard KPIs, orders, products, inventory, customers, prescriptions,
  a pharmacist review queue with approve/reject/request-info actions, payments, refunds, shipping,
  country eligibility, analytics, and a settings page documenting backend environment variables.
- **Legal/compliance pages**: About, Contact, FAQ, Shipping, Returns, Privacy, Terms, and a dedicated
  Medical Disclaimer page. A medical disclaimer banner also appears on the home, product, ailments, and
  wellness pages.

## Project Structure

```
app/                      Route segments (App Router)
  shop/ products/[slug]/ categories/[category]/ ailments/ prescription/ consult/ plus/
  wellness/ oncology/ cart/ checkout/ order-confirmation/ tracking/
  account/ (orders, prescriptions, consultations, settings)   admin/ (orders, products, inventory, ...)
  about/ contact/ faq/ shipping/ returns/ privacy/ terms/ medical-disclaimer/
  api/send-order-email/   Route Handler — the one real server-side integration (see below)
components/
  ui/            Generic design-system primitives (Button, Card, Modal, Tabs, Input, Badge, ...)
  navigation/    Header, MobileNav, Footer, Cart drawer, currency/country selectors, search
  products/      Product card/grid/filters/sort/gallery/purchase panel
  checkout/      Stepper + one component per checkout step, order summary sidebar, tracking timeline
  prescription/  Upload dropzone, status badge
  consult/       Doctor card/avatar, booking panel
  membership/    Plan card, subscribe modal, membership badge
  account/       Account settings tabs (profile, addresses, payment methods, membership, wishlist, ...)
  admin/         Admin sidebar, stat cards, data table, bar list
  home/          Hero, category grid, how-it-works, consult/plus teasers
lib/
  data/          Mock product/category/country/currency/shipping/doctor/membership/company/admin seed data
  services/      Mock service layer (payment, prescription, order, consultation, address, payment-methods, email)
  email/         HTML email template rendering for order-confirmation/payment-failure emails
  context/       React context providers (cart, currency, country, membership, wishlist, auth, toast)
  utils/         cn() class helper, click-outside hook, member-price hook
types/           Shared TypeScript domain types
```

## Security Notes

This prototype was deliberately built to demonstrate **safe patterns for payment handling**, even though
it's front-end only:

- Card number, expiry, and CVV fields exist **only in local component state** during checkout
  (`components/checkout/step-payment.tsx`) and the saved-card form
  (`components/account/payment-methods-tab.tsx`). They are never written to React context, localStorage,
  or any other persistence layer, and are cleared immediately after the mock charge/save call resolves.
- Only non-sensitive, PCI-safe metadata is ever persisted: provider, transaction ID, status, amount,
  currency, last 4 digits, card brand, and a mock token — mirroring what a real backend would store
  after integrating a provider like Stripe, Flutterwave, or DPO Pay.
- See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full security architecture this prototype is
  designed to plug into.

## Tech Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react

## Real Order Confirmation Emails

Checkout's first step now doubles as account sign-up — it collects the customer's name and email (no
password; this app has no backend capable of hashing/storing one securely). That email is where order
confirmations go.

When a payment succeeds or fails at checkout, the app calls `POST /api/send-order-email`
(`app/api/send-order-email/route.ts`), which sends a real HTML email via Gmail SMTP from
`fouanjieinstein@gmail.com`, itemizing the order (or the decline reason) and shipping details.

**To enable it:**

1. Copy the template: `cp .env.local.example .env.local` (Windows: just copy/rename the file).
2. Generate a **Gmail App Password** for `fouanjieinstein@gmail.com` — full steps are in the comments of
   [`.env.local.example`](./.env.local.example). In short: turn on 2-Step Verification on that Google
   account, then create an App Password at https://myaccount.google.com/apppasswords.
3. Put that 16-character code in `.env.local` as `EMAIL_APP_PASSWORD` (never in `.env.example`, never
   committed, never pasted anywhere but that local file).
4. Restart `npm run dev`.

Without those two variables set, checkout still works and orders are still created — the email route
just responds `503` and the app shows a toast noting the confirmation email couldn't be sent, rather than
failing the order.

**Note on scale**: Gmail SMTP is fine for testing and low volume, but has daily sending limits and weaker
deliverability than a dedicated transactional email provider (Resend, SendGrid, Postmark). For real
production volume, swap the transporter in `app/api/send-order-email/route.ts` for one of those.

## Environment Variables

Beyond the email variables above, this prototype needs no environment variables — everything else is
mock data. See [`.env.example`](./.env.example) for the variables a *real backend* integration (payments,
logistics, etc.) would additionally require, and [`ARCHITECTURE.md`](./ARCHITECTURE.md) for how they're
used.

## Further Reading

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for: backend service architecture, database schema and
entity relationships, security architecture, and deployment architecture for turning this prototype into
a production system.
