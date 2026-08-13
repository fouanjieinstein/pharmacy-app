import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { fieldErrors } from "@/lib/server/auth-schemas";
import { clientIp } from "@/lib/server/rate-limit";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
});

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", fields: fieldErrors(parsed.error) }, { status: 400 });
  }

  // Email is intentionally not editable here — changing it needs a
  // verification flow so an account can't be silently moved to an address the
  // owner doesn't control.
  const updated = await db.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone || null },
    select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true },
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "profile.update",
      entityType: "User",
      entityId: user.id,
      ipAddress: clientIp(request),
    },
  });

  return NextResponse.json({ user: updated });
}
