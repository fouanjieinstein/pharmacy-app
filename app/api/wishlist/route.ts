import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";

function serialize(items: { productId: string; addedAt: Date }[]) {
  return items.map((i) => ({ productId: i.productId, addedAt: i.addedAt.toISOString() }));
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const items = await db.wishlistItem.findMany({
    where: { userId: user.id },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json({ items: serialize(items) });
}

const toggleSchema = z.object({ productId: z.string().min(1).max(64) });

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A productId is required." }, { status: 400 });
  }

  const { productId } = parsed.data;

  const existing = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  let wishlisted: boolean;
  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    wishlisted = false;
  } else {
    await db.wishlistItem.create({ data: { userId: user.id, productId } });
    wishlisted = true;
  }

  const items = await db.wishlistItem.findMany({ where: { userId: user.id }, orderBy: { addedAt: "desc" } });
  return NextResponse.json({ wishlisted, items: serialize(items) });
}
