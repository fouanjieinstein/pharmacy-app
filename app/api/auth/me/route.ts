import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";

export async function GET() {
  const user = await getSessionUser();
  // 200 with user:null rather than 401 — this endpoint answers "who am I?",
  // and "nobody" is a valid answer the client uses to render signed-out UI.
  return NextResponse.json({ user });
}
