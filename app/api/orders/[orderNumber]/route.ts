import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { serializeOrder } from "@/lib/server/order-schemas";

export async function GET(_request: NextRequest, context: RouteContext<"/api/orders/[orderNumber]">) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { orderNumber } = await context.params;

  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true, payment: true },
  });

  // 404 (not 403) whether the order doesn't exist or belongs to someone
  // else — never confirm order-number existence to a non-owner.
  if (!order || order.userId !== user.id || !order.payment) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order: serializeOrder(order) });
}
