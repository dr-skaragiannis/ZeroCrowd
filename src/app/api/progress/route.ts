import { getPlatformState, toProgressSnapshot } from "@/lib/platform";

export const dynamic = "force-dynamic";

export async function GET() {
  const progress = toProgressSnapshot(await getPlatformState());
  return Response.json(progress, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
