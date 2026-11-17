import { storageStatus } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await storageStatus());
}
