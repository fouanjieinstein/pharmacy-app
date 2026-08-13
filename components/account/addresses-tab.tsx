"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { addAddress, listAddresses, removeAddress, setDefaultAddress } from "@/lib/services/address-service";
import { countries } from "@/lib/data/countries";
import type { Address, CountryCode } from "@/types";
import { useToast } from "@/lib/context/toast-context";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const EMPTY_FORM: Omit<Address, "id"> = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "IN",
};

export function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const { showToast } = useToast();

  const refresh = () =>
    listAddresses()
      .then(setAddresses)
      .catch(() => showToast("Couldn't load saved addresses.", "error"));

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addAddress(form);
      await refresh();
      setModalOpen(false);
      setForm(EMPTY_FORM);
      showToast("Address saved.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't save address.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      await refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't update default address.", "error");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeAddress(id);
      await refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Couldn't remove address.", "error");
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-brand-navy-900">Saved Addresses</h2>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Add Address
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-brand-gray-500">Loading addresses…</p>
        ) : addresses.length === 0 ? (
          <EmptyState icon={<MapPin className="size-10" />} title="No saved addresses" description="Add an address to speed up checkout." />
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start justify-between gap-3 rounded-md border border-brand-gray-200 p-4">
                <div className="text-sm">
                  <p className="font-medium text-brand-navy-900">
                    {addr.fullName} {addr.isDefault && <Badge variant="emerald" className="ml-1.5">Default</Badge>}
                  </p>
                  <p className="mt-1 text-brand-gray-500">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.stateProvince} {addr.postalCode}
                  </p>
                  <p className="text-brand-gray-500">{countries.find((c) => c.code === addr.country)?.name}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      aria-label="Set as default address"
                      className="text-brand-gray-400 hover:text-brand-gold-600"
                    >
                      <Star className="size-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(addr.id)}
                    aria-label="Remove address"
                    className="text-brand-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Address">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="addrFullName" label="Full Name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="addrPhone" label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input id="addrEmail" label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Input id="addrLine1" label="Address Line 1" required value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
          <Input id="addrLine2" label="Address Line 2 (optional)" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input id="addrCity" label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input id="addrState" label="State" required value={form.stateProvince} onChange={(e) => setForm({ ...form, stateProvince: e.target.value })} />
            <Input id="addrPostal" label="Postal Code" required value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </div>
          <Select id="addrCountry" label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value as CountryCode })}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </Select>
          <Button type="submit" fullWidth loading={saving}>Save Address</Button>
        </form>
      </Modal>
    </Card>
  );
}
