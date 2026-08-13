import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { addressUpdateSchema, serializeAddress } from "@/lib/server/address-schemas";
import { fieldErrors } from "@/lib/server/auth-schemas";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/addresses/[id]">) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;

  const owned = await db.address.findUnique({ where: { id }, select: { userId: true } });
  if (!owned || owned.userId !== user.id) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = addressUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  const { country, addressLine2, isDefault, ...rest } = parsed.data;

  const address = await db.$transaction(async (tx) => {
    if (isDefault === true) {
      // Only one address per user may be flagged default at a time.
      await tx.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.address.update({
      where: { id },
      data: {
        ...rest,
        ...(country !== undefined ? { countryCode: country } : {}),
        ...(addressLine2 !== undefined ? { addressLine2: addressLine2 || null } : {}),
        ...(isDefault !== undefined ? { isDefault } : {}),
      },
    });
  });

  return NextResponse.json({ address: serializeAddress(address) });
}

export async function DELETE(_request: NextRequest, context: RouteContext<"/api/addresses/[id]">) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await context.params;

  const owned = await db.address.findUnique({ where: { id }, select: { userId: true, isDefault: true } });
  if (!owned || owned.userId !== user.id) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  await db.$transaction(async (tx) => {
    await tx.address.delete({ where: { id } });

    if (owned.isDefault) {
      // Never leave a customer with saved addresses but no default — promote
      // the most recently added remaining one.
      const next = await tx.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (next) {
        await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
