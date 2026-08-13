import type { Address } from "@/types";

export interface AddressServiceError extends Error {
  fields?: Record<string, string>;
}

async function parseErrorAndThrow(res: Response): Promise<never> {
  const data = await res.json().catch(() => ({}));
  const err = new Error(data.error ?? "Something went wrong. Please try again.") as AddressServiceError;
  err.fields = data.fields;
  throw err;
}

export async function listAddresses(): Promise<Address[]> {
  const res = await fetch("/api/addresses", { cache: "no-store" });
  if (!res.ok) await parseErrorAndThrow(res);
  const data = await res.json();
  return data.addresses;
}

export async function addAddress(address: Omit<Address, "id">): Promise<Address> {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(address),
  });
  if (!res.ok) await parseErrorAndThrow(res);
  const data = await res.json();
  return data.address;
}

export async function removeAddress(id: string): Promise<void> {
  const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
  if (!res.ok) await parseErrorAndThrow(res);
}

export async function setDefaultAddress(id: string): Promise<void> {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDefault: true }),
  });
  if (!res.ok) await parseErrorAndThrow(res);
}
