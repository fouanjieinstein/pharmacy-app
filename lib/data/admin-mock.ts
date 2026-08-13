// Seed data for the admin dashboard UI. All figures are illustrative mock
// data for prototype purposes only and are not derived from real business
// activity.

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  country: string;
  ordersCount: number;
  totalSpentUsd: number;
  joinedAt: string;
  status: "active" | "suspended";
  isPlusMember: boolean;
}

export interface AdminConsultation {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  slot: string;
  feeUsd: number;
  status: "scheduled" | "completed" | "cancelled";
}

export interface AdminLabBooking {
  id: string;
  reference: string;
  patientName: string;
  testName: string;
  collectionMode: "Home visit" | "Collection centre";
  slot: string;
  totalUsd: number;
  status: "Scheduled" | "Sample Collected" | "Processing" | "Report Ready" | "Cancelled";
}

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  country: string;
  itemCount: number;
  totalUsd: number;
  status: string;
  placedAt: string;
  hasRx: boolean;
}

export interface AdminPrescriptionReview {
  id: string;
  patientName: string;
  fileName: string;
  submittedAt: string;
  status: "pending_review" | "under_pharmacist_review" | "approved" | "rejected" | "info_required";
  assignedPharmacist?: string;
  medication: string;
}

export interface AdminPayment {
  id: string;
  orderNumber: string;
  provider: string;
  amountUsd: number;
  currency: string;
  status: "succeeded" | "failed" | "pending" | "refunded";
  last4: string;
  brand: string;
  timestamp: string;
}

export interface AdminRefund {
  id: string;
  orderNumber: string;
  amountUsd: number;
  reason: string;
  status: "requested" | "processing" | "completed" | "denied";
  requestedAt: string;
}

export const adminCustomers: AdminCustomer[] = [
  { id: "c001", name: "Aanya Sharma", email: "aanya.sharma@example.com", country: "India", ordersCount: 12, totalSpentUsd: 842.5, joinedAt: "2024-08-12", status: "active", isPlusMember: true },
  { id: "c002", name: "James Whitfield", email: "j.whitfield@example.com", country: "United Kingdom", ordersCount: 4, totalSpentUsd: 210.0, joinedAt: "2025-01-03", status: "active", isPlusMember: false },
  { id: "c003", name: "Fatima Al-Mansoori", email: "fatima.alm@example.com", country: "United Arab Emirates", ordersCount: 8, totalSpentUsd: 610.75, joinedAt: "2024-11-20", status: "active", isPlusMember: true },
  { id: "c004", name: "Liam Chen", email: "liam.chen@example.com", country: "Singapore", ordersCount: 2, totalSpentUsd: 96.0, joinedAt: "2025-03-15", status: "active", isPlusMember: false },
  { id: "c005", name: "Priya Menon", email: "priya.menon@example.com", country: "India", ordersCount: 21, totalSpentUsd: 1540.2, joinedAt: "2024-05-02", status: "active", isPlusMember: true },
  { id: "c006", name: "Robert Adeyemi", email: "r.adeyemi@example.com", country: "Nigeria", ordersCount: 1, totalSpentUsd: 42.0, joinedAt: "2025-06-01", status: "suspended", isPlusMember: false },
];

export const adminConsultations: AdminConsultation[] = [
  { id: "ac001", patientName: "Aanya Sharma", doctorName: "Dr. Neha Kapoor", specialty: "General Physician", slot: "2026-08-12T10:00:00Z", feeUsd: 85, status: "scheduled" },
  { id: "ac002", patientName: "Fatima Al-Mansoori", doctorName: "Dr. Arjun Mehta", specialty: "Cardiology", slot: "2026-08-10T14:30:00Z", feeUsd: 220, status: "completed" },
  { id: "ac003", patientName: "Priya Menon", doctorName: "Dr. Sanjay Rao", specialty: "Endocrinology & Diabetes", slot: "2026-08-13T09:00:00Z", feeUsd: 180, status: "scheduled" },
  { id: "ac004", patientName: "Liam Chen", doctorName: "Dr. Priya Narayanan", specialty: "Dermatology", slot: "2026-08-09T11:00:00Z", feeUsd: 150, status: "cancelled" },
  { id: "ac005", patientName: "James Whitfield", doctorName: "Dr. Vikram Oberoi", specialty: "Psychiatry & Mental Health", slot: "2026-08-14T16:00:00Z", feeUsd: 195, status: "scheduled" },
];

export const adminLabBookings: AdminLabBooking[] = [
  { id: "lb001", reference: "ML-583014", patientName: "Priya Menon", testName: "Intracellular Micronutrient Panel", collectionMode: "Collection centre", slot: "2026-08-12T08:30:00Z", totalUsd: 960, status: "Processing" },
  { id: "lb002", reference: "ML-582877", patientName: "Aanya Sharma", testName: "Complete Thyroid Panel", collectionMode: "Home visit", slot: "2026-08-12T07:00:00Z", totalUsd: 480, status: "Scheduled" },
  { id: "lb003", reference: "ML-582640", patientName: "Fatima Al-Mansoori", testName: "Hereditary Cancer Panel", collectionMode: "Collection centre", slot: "2026-08-09T09:15:00Z", totalUsd: 1850, status: "Report Ready" },
  { id: "lb004", reference: "ML-582411", patientName: "Liam Chen", testName: "Stool & Microbiome Analysis", collectionMode: "Home visit", slot: "2026-08-10T10:00:00Z", totalUsd: 925, status: "Sample Collected" },
  { id: "lb005", reference: "ML-582203", patientName: "James Whitfield", testName: "Component-Resolved Allergy Panel", collectionMode: "Home visit", slot: "2026-08-08T11:30:00Z", totalUsd: 1155, status: "Report Ready" },
  { id: "lb006", reference: "ML-581998", patientName: "Priya Menon", testName: "ctDNA Liquid Biopsy", collectionMode: "Collection centre", slot: "2026-08-07T08:00:00Z", totalUsd: 2780, status: "Processing" },
  { id: "lb007", reference: "ML-581742", patientName: "Robert Adeyemi", testName: "Pharmacogenomic Panel", collectionMode: "Home visit", slot: "2026-08-06T14:00:00Z", totalUsd: 925, status: "Cancelled" },
];

export const adminOrders: AdminOrderRow[] = [
  { id: "o1001", orderNumber: "MH-104822", customerName: "Aanya Sharma", country: "India", itemCount: 3, totalUsd: 64.5, status: "Dispatched", placedAt: "2026-08-08", hasRx: false },
  { id: "o1002", orderNumber: "MH-104819", customerName: "Fatima Al-Mansoori", country: "UAE", itemCount: 2, totalUsd: 112.0, status: "Prescription Verified", placedAt: "2026-08-08", hasRx: true },
  { id: "o1003", orderNumber: "MH-104810", customerName: "Priya Menon", country: "India", itemCount: 5, totalUsd: 88.25, status: "Delivered", placedAt: "2026-08-05", hasRx: false },
  { id: "o1004", orderNumber: "MH-104798", customerName: "Liam Chen", country: "Singapore", itemCount: 1, totalUsd: 46.0, status: "Pharmacy Processing", placedAt: "2026-08-04", hasRx: true },
  { id: "o1005", orderNumber: "MH-104780", customerName: "James Whitfield", country: "United Kingdom", itemCount: 4, totalUsd: 57.8, status: "In Transit", placedAt: "2026-08-02", hasRx: false },
  { id: "o1006", orderNumber: "MH-104755", customerName: "Robert Adeyemi", country: "Nigeria", itemCount: 1, totalUsd: 42.0, status: "Payment Failed", placedAt: "2026-07-30", hasRx: false },
];

export const adminPrescriptionReviews: AdminPrescriptionReview[] = [
  { id: "r501", patientName: "Fatima Al-Mansoori", fileName: "prescription_scan_08.pdf", submittedAt: "2026-08-08T09:12:00Z", status: "under_pharmacist_review", assignedPharmacist: "Pharm. R. Nair, RPh", medication: "BronchoFlow Inhaler" },
  { id: "r502", patientName: "Liam Chen", fileName: "rx_photo.jpg", submittedAt: "2026-08-08T07:40:00Z", status: "pending_review", medication: "TamoxiCare 20" },
  { id: "r503", patientName: "Aanya Sharma", fileName: "clinic_letter.pdf", submittedAt: "2026-08-06T11:02:00Z", status: "approved", assignedPharmacist: "Pharm. S. Iyer, RPh", medication: "Glucomet 500" },
  { id: "r504", patientName: "Priya Menon", fileName: "prescription_v2.png", submittedAt: "2026-08-05T15:23:00Z", status: "info_required", assignedPharmacist: "Pharm. R. Nair, RPh", medication: "MethoPrime 2.5" },
  { id: "r505", patientName: "James Whitfield", fileName: "scan_0004.pdf", submittedAt: "2026-08-01T10:00:00Z", status: "rejected", assignedPharmacist: "Pharm. S. Iyer, RPh", medication: "NeuroCalm 50" },
];

export const adminPayments: AdminPayment[] = [
  { id: "pay801", orderNumber: "MH-104822", provider: "Stripe", amountUsd: 64.5, currency: "USD", status: "succeeded", last4: "4242", brand: "visa", timestamp: "2026-08-08T09:00:00Z" },
  { id: "pay802", orderNumber: "MH-104819", provider: "DPO Pay", amountUsd: 112.0, currency: "AED", status: "succeeded", last4: "1881", brand: "mastercard", timestamp: "2026-08-08T08:15:00Z" },
  { id: "pay803", orderNumber: "MH-104810", provider: "Stripe", amountUsd: 88.25, currency: "INR", status: "succeeded", last4: "0005", brand: "rupay", timestamp: "2026-08-05T06:44:00Z" },
  { id: "pay804", orderNumber: "MH-104755", provider: "Flutterwave", amountUsd: 42.0, currency: "USD", status: "failed", last4: "0002", brand: "visa", timestamp: "2026-07-30T13:21:00Z" },
  { id: "pay805", orderNumber: "MH-104701", provider: "Stripe", amountUsd: 31.0, currency: "USD", status: "refunded", last4: "3782", brand: "amex", timestamp: "2026-07-22T10:05:00Z" },
];

export const adminRefunds: AdminRefund[] = [
  { id: "ref301", orderNumber: "MH-104701", amountUsd: 31.0, reason: "Customer changed mind before dispatch", status: "completed", requestedAt: "2026-07-21" },
  { id: "ref302", orderNumber: "MH-104690", amountUsd: 18.5, reason: "Item damaged in transit", status: "processing", requestedAt: "2026-08-07" },
  { id: "ref303", orderNumber: "MH-104650", amountUsd: 64.0, reason: "Prescription rejected after payment", status: "requested", requestedAt: "2026-08-09" },
];

export const dashboardStats = {
  totalRevenueUsd: 184320,
  revenueChangePct: 8.2,
  totalOrders: 3140,
  ordersChangePct: 4.6,
  activeCustomers: 1862,
  customersChangePct: 6.1,
  pendingPrescriptionReviews: adminPrescriptionReviews.filter(
    (r) => r.status === "pending_review" || r.status === "under_pharmacist_review"
  ).length,
  lowStockProducts: 6,
  plusMembers: 612,
  plusMembersChangePct: 11.4,
  scheduledConsultations: adminConsultations.filter((c) => c.status === "scheduled").length,
  activeLabBookings: adminLabBookings.filter((b) => b.status !== "Cancelled" && b.status !== "Report Ready").length,
  labRevenueUsd: adminLabBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.totalUsd, 0),
  ordersByStatus: [
    { status: "Processing", count: 214 },
    { status: "Dispatched", count: 380 },
    { status: "In Transit", count: 512 },
    { status: "Delivered", count: 1890 },
    { status: "Payment Failed", count: 44 },
  ],
  revenueByMonth: [
    { month: "Mar", revenueUsd: 21400 },
    { month: "Apr", revenueUsd: 24800 },
    { month: "May", revenueUsd: 22950 },
    { month: "Jun", revenueUsd: 27300 },
    { month: "Jul", revenueUsd: 29650 },
    { month: "Aug", revenueUsd: 18420 },
  ],
  topCountries: [
    { country: "India", ordersShare: 38 },
    { country: "UAE", ordersShare: 17 },
    { country: "Singapore", ordersShare: 11 },
    { country: "United Kingdom", ordersShare: 10 },
    { country: "Others", ordersShare: 24 },
  ],
};
