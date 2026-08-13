# Meridian Health — Backend & Platform Architecture

This document describes the architecture a production backend would need in order to power the
front-end prototype in this repository. Nothing described here is implemented in this repo — it is the
integration target.

## 1. System Overview

```
┌──────────────────┐      HTTPS       ┌───────────────────────┐
│  Next.js Frontend │ ───────────────▶ │  Backend API (BFF)     │
│  (this repo)      │ ◀─────────────── │  Node/TS, REST or GraphQL │
└──────────────────┘                  └───────────┬───────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 ▼                                  ▼                                  ▼
        ┌────────────────┐               ┌───────────────────┐              ┌───────────────────┐
        │ Primary DB       │               │ Payment Provider   │              │ Pharmacy Mgmt /     │
        │ (Postgres)       │               │ (Stripe / Flutterwave│            │ Inventory System    │
        └────────────────┘               │ / DPO Pay)          │              └───────────────────┘
                 │                        └─────────┬──────────┘                        │
                 ▼                                  ▼                                   ▼
        ┌────────────────┐               ┌───────────────────┐              ┌───────────────────┐
        │ File Storage     │               │ Webhook Receiver    │              │ International        │
        │ (prescriptions,   │               │ (signature-verified)│              │ Logistics Provider   │
        │ encrypted, ACL'd) │               └───────────────────┘              └───────────────────┘
        └────────────────┘
```

The frontend never talks to the payment provider, pharmacy-management system, or logistics provider
directly — all of that goes through the backend API, which is the only service holding provider secrets.

## 2. Backend Services

| Service | Responsibility |
|---|---|
| **Auth Service** | Registration/login, session issuance (httpOnly cookies or short-lived JWT + refresh), RBAC (`customer`, `pharmacist`, `admin`, `super_admin`), MFA for staff roles. |
| **Catalog Service** | Product/category CRUD, inventory sync, pricing, country-availability rules. |
| **Order Service** | Cart → order transition, order state machine, ties together payment confirmation, prescription status, and inventory decrement in a single transaction. |
| **Prescription Service** | Secure upload handling (virus scan, encryption at rest), pharmacist review queue, status transitions, audit trail. |
| **Payment Service** | Thin wrapper around the chosen PCI-compliant provider's server SDK; creates PaymentIntents/charges using **tokens only**, never raw card data; verifies webhooks. |
| **Shipping/Logistics Service** | Rate shopping and label creation via the logistics provider's API; cold-chain routing checks; tracking-event ingestion. |
| **Notification Service** | Transactional email/SMS for order, prescription, and payment status changes. |
| **Admin/Reporting Service** | Aggregated views for the admin console (dashboard stats, analytics) — typically a read replica or a scheduled ETL into an analytics store. |

## 3. Database Schema

Relational database (PostgreSQL recommended). Primary keys are UUIDs unless noted.

### Entities

**users**
`id, email (unique), password_hash, name, phone, role (enum: customer|pharmacist|admin|super_admin), mfa_enabled, created_at, updated_at`

**addresses**
`id, user_id → users.id, full_name, phone, email, address_line1, address_line2, city, state_province, postal_code, country_code, is_default, created_at`

**countries**
`code (PK, ISO 3166-1 alpha-2), name, region, default_currency, delivery_available, rx_import_allowed, cold_chain_available, customs_notice, standard_delivery_days_min, standard_delivery_days_max, express_delivery_days_min, express_delivery_days_max`

**categories**
`id, label, group (enum: otc|prescription|wellness), description`

**products**
`id, slug (unique), name, generic_name, active_ingredient, brand, manufacturer, category_id → categories.id, dosage, form, pack_size, prescription_required, price_usd, compare_at_price_usd, cold_chain_required, description, storage_instructions, created_at, updated_at`
- `product_indications`, `product_directions`, `product_warnings`, `product_contraindications`,
  `product_side_effects`, `product_faqs`, `product_tags` — child tables (or JSONB columns) for
  one-to-many attributes.
- `product_country_availability` — join table: `product_id, country_code`.
- `product_images` — `product_id, url, sort_order`.

**inventory**
`id, product_id → products.id (unique), stock_count, low_stock_threshold, updated_at`
(kept separate from `products` so inventory writes don't lock catalog reads)

**prescriptions**
`id, user_id → users.id, file_url (private storage reference, not public), file_type, file_size_kb, status (enum: pending_review|under_pharmacist_review|approved|rejected|info_required), uploaded_at`

**prescription_reviews**
`id, prescription_id → prescriptions.id, pharmacist_id → users.id, decision, notes, reviewed_at`
(append-only — a prescription can have multiple review rows across its lifecycle, e.g. info-requested → resubmitted → approved)

**orders**
`id, order_number (unique, human-readable), user_id → users.id, status (enum, see order status sequence below), destination_country → countries.code, shipping_method_id, shipping_address_id → addresses.id, prescription_id → prescriptions.id (nullable), subtotal_usd, shipping_usd, tax_usd, total_usd, currency, placed_at, updated_at`

**order_items**
`id, order_id → orders.id, product_id → products.id, quantity, unit_price_usd`

**order_tracking_events**
`id, order_id → orders.id, status, label, description, occurred_at`
(append-only log driven by the logistics-provider webhook/integration, not client-generated as this
prototype does for demo purposes)

**payments**
`id, order_id → orders.id (unique), provider (enum: stripe|flutterwave|dpo_pay), provider_transaction_id, status (enum: succeeded|failed|pending|refunded), amount, currency, card_brand, last4, customer_id → users.id, created_at`
- **No column ever stores a raw card number, CVV/CVC, or PIN.** The only card-related data is
  `card_brand` and `last4`, both non-sensitive per PCI-DSS.

**payment_methods** (saved/tokenized cards)
`id, user_id → users.id, provider, provider_token (opaque reference from the provider's vault), brand, last4, expiry_month, expiry_year, is_default`

**refunds**
`id, payment_id → payments.id, amount, reason, status (enum: requested|processing|completed|denied), requested_by → users.id, requested_at, resolved_at`

**notifications**
`id, user_id → users.id, type, payload (JSONB), read_at, created_at`

**audit_logs**
`id, actor_id → users.id, action, entity_type, entity_id, metadata (JSONB), ip_address, created_at`
(append-only; every prescription decision, refund action, and admin mutation writes here)

### Key Relationships

- `users 1—N addresses`, `users 1—N orders`, `users 1—N prescriptions`, `users 1—N payment_methods`
- `orders 1—N order_items`, `orders 1—N order_tracking_events`, `orders 1—1 payments`
- `orders N—1 addresses` (shipping address), `orders N—1 prescriptions` (nullable — only Rx orders)
- `prescriptions 1—N prescription_reviews` (full audit trail of pharmacist decisions)
- `products N—1 categories`, `products 1—1 inventory`, `products N—N countries` (via
  `product_country_availability`)
- `payments 1—N refunds`

## 4. Security Architecture

- **Transport**: HTTPS everywhere (HSTS enabled); no plaintext HTTP endpoints.
- **AuthN**: password hashing with a modern algorithm (argon2id/bcrypt), httpOnly + `Secure` +
  `SameSite=Lax` session cookies (or short-lived JWT + rotating refresh token), MFA required for
  `pharmacist`/`admin`/`super_admin` roles.
- **AuthZ**: RBAC enforced server-side on every endpoint — the frontend's role switcher (used in this
  prototype for demo purposes) is illustrative only and must never be treated as an authorization
  source in production.
- **Input/API validation**: schema validation (e.g. zod) on every request body, param, and query string,
  server-side, in addition to any client-side form validation.
- **Rate limiting**: per-IP and per-account rate limits on auth, checkout, and prescription-upload
  endpoints to blunt brute-force and abuse.
- **File uploads**: prescriptions accepted only as PDF/JPG/PNG under a hard size cap, virus-scanned on
  upload, stored in a private bucket with signed, time-limited access URLs — never a public path.
- **Prescription access control**: readable only by the uploading patient, the assigned pharmacist, and
  admin roles; every read/decision is written to `audit_logs`.
- **Payment tokenization**: card data is collected directly into the payment provider's hosted
  fields/Elements (so it never transits our own servers), producing a token that our backend exchanges
  for a charge. Our database never contains a raw PAN, CVV/CVC, or PIN — see the `payments` and
  `payment_methods` schema above.
- **Webhook verification**: all payment-provider and logistics-provider webhooks are verified via HMAC
  signature (provider-issued signing secret) before being trusted; replay protection via idempotency
  keys.
- **CSRF**: double-submit cookie or same-site cookie strategy for state-changing requests from browser
  sessions.
- **XSS**: React's default escaping + a strict Content-Security-Policy; no `dangerouslySetInnerHTML`
  with unsanitized input.
- **SQL injection**: parameterized queries / ORM (e.g. Prisma, Drizzle) exclusively — no raw string
  concatenation into SQL.
- **Secrets management**: provider API keys, database credentials, and webhook signing secrets live only
  in the backend's environment/secret manager (see `.env.example`) — **never** in frontend code, build
  output, or a public repo.
- **Audit logging**: every prescription decision, payment/refund action, and admin/staff mutation is
  written to `audit_logs` with actor, action, and timestamp.

## 5. Payment & Settlement Architecture

```
Frontend  ──(tokenize card via provider SDK, e.g. Stripe Elements)──▶  Payment Provider
Frontend  ──(send only the resulting token)──▶  Backend
Backend   ──(create charge/PaymentIntent using token + secret key)──▶  Payment Provider
Payment Provider ──(webhook: payment_succeeded)──▶  Backend (signature-verified)
Backend   ──(mark order paid, decrement inventory, enqueue notifications)
Payment Provider ──(settlement, per provider's payout schedule)──▶  Merchant Bank Account
```

Backend-only configuration (see `.env.example`):

- `PAYMENT_PROVIDER` — which provider is active (`stripe` | `flutterwave` | `dpo_pay`)
- `MERCHANT_ACCOUNT` — the merchant/business account identifier used for settlement routing
- `SETTLEMENT_CURRENCY` — currency the provider settles into the business bank account
- `WEBHOOK_ENDPOINT` — the backend URL registered with the provider to receive signed webhook events

Bank account numbers, provider secret keys, and signing secrets are **never** stored in the database in
plaintext and **never** appear in frontend code — they live in the backend's secret manager
(e.g. AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) and are injected as environment
variables at deploy time.

## 6. Deployment Architecture

- **Frontend**: this Next.js app deployed to a platform with edge/CDN caching for static assets
  (Vercel, or a containerized deployment behind a CDN). Static/prerendered routes (product pages,
  category pages) are served from cache; dynamic routes (cart, checkout, account, admin) render per
  request.
- **Backend API**: containerized (Docker), deployed behind a load balancer, horizontally scalable,
  stateless (sessions in Redis or JWT-based) so any instance can serve any request.
- **Database**: managed PostgreSQL with automated backups, point-in-time recovery, and a read replica
  for reporting/analytics workloads.
- **File storage**: object storage (S3-compatible) with private ACLs for prescription files, public-read
  for product imagery.
- **Background jobs**: a queue (e.g. SQS/BullMQ) for virus scanning uploads, sending notifications, and
  reconciling webhook events.
- **Observability**: structured logging, error tracking (e.g. Sentry), and uptime/latency monitoring on
  the checkout and payment-webhook paths specifically, since those are the highest-impact failure
  points.
- **CI/CD**: type-check + lint + build on every PR; migrations run as a distinct, reviewed deploy step
  (never auto-applied on frontend deploys).

## 7. Environment Variables

See [`.env.example`](./.env.example). Summary of what a real backend deployment needs, grouped by
concern — **none of these are used by or present in this frontend prototype**:

- **Database**: connection string, pool size
- **Auth**: session secret, JWT signing key, MFA provider config
- **Payments**: `PAYMENT_PROVIDER`, provider secret key, `MERCHANT_ACCOUNT`, `SETTLEMENT_CURRENCY`,
  `WEBHOOK_ENDPOINT`, webhook signing secret
- **File storage**: bucket name, access credentials, region
- **Logistics provider**: API key, account ID
- **Notifications**: email/SMS provider credentials
- **Observability**: error-tracking DSN

**One exception exists today**: `EMAIL_USER` and `EMAIL_APP_PASSWORD` (see
[`.env.local.example`](./.env.local.example)) power a real Gmail-SMTP transactional email send in
`app/api/send-order-email/route.ts` — order confirmation and payment-decline emails are genuinely sent,
not mocked. This is a narrow, deliberate carve-out from the "frontend-only" scope; at production scale it
should be replaced by a dedicated transactional email provider (Resend, SendGrid, Postmark) with proper
domain authentication (SPF/DKIM/DMARC) for deliverability, following the same "secrets live in backend
env vars only" rule as everything else in this section.
