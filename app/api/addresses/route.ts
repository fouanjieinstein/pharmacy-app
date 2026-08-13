import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { addressSchema, serializeAddress } from "@/lib/server/address-schemas";
import { fieldErrors } from "@/lib/server/auth-schemas";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ addresses: addresses.map(serializeAddress) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const { country, addressLine2, isDefault, ...rest } = parsed.data;

  const address = await db.$transaction(async (tx) => {
    const existingCount = await tx.address.count({ where: { userId: user.id } });
    // The first address a customer saves is always the default, regardless of
    // what the client sent — there must never be zero default addresses once
    // one exists.
    const shouldBeDefault = isDefault === true || existingCount === 0;

    if (shouldBeDefault) {
      await tx.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.address.create({
      data: {
        ...rest,
        addressLine2: addressLine2 || null,
        countryCode: country,
        isDefault: shouldBeDefault,
        userId: user.id,
      },
    });
  });

  return NextResponse.json({ address: serializeAddress(address) }, { status: 201 });
}
