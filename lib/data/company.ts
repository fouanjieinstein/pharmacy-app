// Central company identity/contact details, used across the footer, About,
// Contact, admin settings, and outbound transactional email templates so
// they stay consistent in one place.

export const company = {
  legalName: "Meridian Health Pvt. Ltd.",
  displayName: "Meridian Health",
  supportEmail: "meridianhealthmh@gmail.com",
  phone: "+91 22 4890 2200",
  addressLines: ["14th Floor, Meridian Tower", "Bandra Kurla Complex", "Mumbai, Maharashtra 400051", "India"],
};

export function companyAddressOneLine(): string {
  return company.addressLines.join(", ");
}
