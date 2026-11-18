import { NextResponse } from "next/server";
import { z } from "zod";
import { applySchema } from "@/lib/apply";

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }
  // ponytail: no storage yet. Wire this to a sheet, DB or email when the organisers pick one (TBA).
  console.info("[apply]", parsed.data.email, parsed.data.role);
  return NextResponse.json({ ok: true });
}
