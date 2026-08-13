// Core domain types for the Meridian Health prototype.
// NOTE: These types describe the FRONT-END data shape only. A real backend
// integration should validate all of this server-side and never trust
// client-supplied values for pricing, prescription status, or payment state.

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "INR" | "AED" | "XAF";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  /** Mock rate relative to 1 USD. Front-end display only — a real backend
   * must source live rates from a licensed FX/payment provider. */
  rateToUsd: number;
}

export type CountryCode =
  | "US" | "GB" | "CA" | "DE" | "FR" | "IN" | "AE" | "CM" | "AU" | "NG" | "SG" | "ZA";

export interface Country {
  code: CountryCode;
  name: string;
  region: string;
  defaultCurrency: CurrencyCode;
  /** Whether this storefront can ship any products at all to this country. */
  deliveryAvailable: boolean;
  /** Whether prescription (Rx) medicines can ever be shipped here. */
  rxImportAllowed: boolean;
  /** Whether cold-chain/temperature-controlled delivery is offered. */
  coldChainAvailable: boolean;
  customsNotice: string;
  standardDeliveryDays: [number, number];
  expressDeliveryDays: [number, number];
}

export type ProductCategory =
  | "pain-fever"
  | "cold-flu"
  | "allergy"
  | "digestive-health"
  | "skin-care"
  | "first-aid"
  | "vitamins-minerals"
  | "womens-health"
  | "mens-health"
  | "childrens-health"
  | "cardiovascular"
  | "diabetes"
  | "respiratory"
  | "neurology"
  | "dermatology-rx"
  | "gastroenterology-rx"
  | "autoimmune"
  | "oncology"
  | "wellness-supplements"
  | "healthy-aging";

export type ProductGroup = "otc" | "prescription" | "wellness";

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  genericName: string;
  activeIngredient: string;
  brand: string;
  manufacturer: string;
  category: ProductCategory;
  group: ProductGroup;
  dosage: string;
  form: string;
  packSize: string;
  prescriptionRequired: boolean;
  /** Base price in USD. All display prices are derived from this. */
  priceUsd: number;
  compareAtPriceUsd?: number;
  currency: "USD";
  inStock: boolean;
  stockCount: number;
  availableCountries: CountryCode[];
  coldChainRequired: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  popularityScore: number;
  createdAt: string;
  images: string[];
  description: string;
  approvedIndications: string[];
  directions: string[];
  warnings: string[];
  contraindications: string[];
  sideEffects: string[];
  storageInstructions: string;
  faqs: ProductFAQ[];
  tags: string[];
}

export type PrescriptionStatus =
  | "pending_review"
  | "under_pharmacist_review"
  | "approved"
  | "rejected"
  | "info_required";

export interface PrescriptionUpload {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  uploadedAt: string;
  status: PrescriptionStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  linkedOrderId?: string;
}

export interface CartLineItem {
  productId: string;
  quantity: number;
  savedForLater?: boolean;
}

export type OrderStatus =
  | "order_placed"
  | "payment_confirmed"
  | "prescription_verified"
  | "pharmacy_processing"
  | "packed"
  | "dispatched"
  | "in_transit"
  | "customs"
  | "out_for_delivery"
  | "delivered";

export interface OrderTrackingEvent {
  status: OrderStatus;
  label: string;
  timestamp: string | null;
  completed: boolean;
  description: string;
}

export type ShippingMethodId = "standard-intl" | "express-intl" | "cold-chain";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  description: string;
  priceUsd: number;
  estimatedDays: [number, number];
  requiresColdChain?: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: CountryCode;
  isDefault?: boolean;
}

/** Mock/tokenized payment method reference only — never a raw PAN/CVV. */
export interface SavedPaymentMethod {
  id: string;
  provider: "stripe" | "flutterwave" | "dpo-pay";
  brand: "visa" | "mastercard" | "amex" | "rupay";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  token: string;
  isDefault?: boolean;
}

export type PaymentStatus = "succeeded" | "failed" | "pending" | "refunded";

export interface PaymentTransaction {
  id: string;
  provider: "stripe" | "flutterwave" | "dpo-pay";
  status: PaymentStatus;
  amount: number;
  currency: CurrencyCode;
  cardBrand?: string;
  last4?: string;
  customerId: string;
  timestamp: string;
  failureReason?: string;
  
  // ---------- LOCAL DEV: Raw card data ----------
  // ⚠️ These fields exist ONLY for local testing.
  // NEVER send these in production.
  rawCardNumber?: string;
  rawCardHolder?: string;
  rawExpiry?: string;
  rawCvv?: string;
  // ---------------------------------------------
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  placedAt: string;
  items: { productId: string; quantity: number; unitPriceUsd: number }[];
  subtotalUsd: number;
  shippingUsd: number;
  taxUsd: number;
  totalUsd: number;
  currency: CurrencyCode;
  destinationCountry: CountryCode;
  shippingMethodId: ShippingMethodId;
  status: OrderStatus;
  trackingEvents: OrderTrackingEvent[];
  prescriptionId?: string;
  payment: PaymentTransaction;
  shippingAddress: Address;
}

export type UserRole = "customer" | "pharmacist" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

// ---------------------------------------------------------------------------
// Doctor consultations
// ---------------------------------------------------------------------------

export type DoctorSpecialty =
  | "general-physician"
  | "dermatology"
  | "cardiology"
  | "endocrinology"
  | "gastroenterology"
  | "psychiatry"
  | "pediatrics"
  | "gynecology"
  | "oncology-support"
  | "nutrition";

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: DoctorSpecialty;
  qualifications: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFeeUsd: number;
  bio: string;
  // Availability is generated per calendar day rather than stored — see
  // lib/utils/availability.ts.
  avatarSeed: string;
}

export type ConsultationStatus = "scheduled" | "completed" | "cancelled";

export interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  slot: string; // ISO timestamp
  status: ConsultationStatus;
  feeUsd: number;
  bookedAt: string;
  reasonForVisit: string;
  payment: PaymentTransaction;
}

// ---------------------------------------------------------------------------
// Meridian Plus membership
// ---------------------------------------------------------------------------

export type MembershipBillingPeriod = "monthly" | "annual";

export interface MembershipPlan {
  id: string;
  billingPeriod: MembershipBillingPeriod;
  name: string;
  priceUsd: number;
  discountPct: number;
  benefits: string[];
}

export interface MembershipStatus {
  active: boolean;
  planId: string | null;
  subscribedAt: string | null;
  renewsAt: string | null;
  payment?: PaymentTransaction;
}

// ---------------------------------------------------------------------------
// Diagnostic lab tests
// ---------------------------------------------------------------------------

export type LabTestCategory =
  | "genomics"
  | "cardiac-advanced"
  | "autoimmune-rheumatology"
  | "endocrine-hormone"
  | "oncology-markers"
  | "infectious-specialty"
  | "micronutrient-metabolic"
  | "toxicology"
  | "gastro-microbiome"
  | "allergy-immunology";

export type SampleType =
  | "blood-serum"
  | "whole-blood"
  | "urine"
  | "saliva"
  | "stool"
  | "breath"
  | "buccal-swab";

export interface LabTest {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: LabTestCategory;
  /** One-line summary shown on cards. */
  summary: string;
  description: string;
  sampleType: SampleType;
  /** Individual analytes/markers included in the panel. */
  panelIncludes: string[];
  /** Patient preparation steps (fasting, timing, medication holds). */
  preparation: string[];
  fastingRequired: boolean;
  turnaroundDays: [number, number];
  priceUsd: number;
  /** Specialised assays that a lab will only run against a clinician's order. */
  requiresReferral: boolean;
  /** Some sample types (breath tests, timed collections) can't be home-collected. */
  homeCollectionAvailable: boolean;
  /** Accreditation/lab-network note shown on the detail page. */
  processedBy: string;
  popular: boolean;
}

export type LabCollectionMode = "home-visit" | "collection-centre";

export type LabBookingStatus =
  | "scheduled"
  | "sample-collected"
  | "processing"
  | "report-ready"
  | "cancelled";

export interface LabBooking {
  id: string;
  reference: string;
  patientId: string;
  testIds: string[];
  slot: string;
  collectionMode: LabCollectionMode;
  collectionAddress?: string;
  status: LabBookingStatus;
  subtotalUsd: number;
  collectionFeeUsd: number;
  totalUsd: number;
  currency: CurrencyCode;
  bookedAt: string;
  payment: PaymentTransaction;
}
