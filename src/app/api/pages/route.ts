import { createFromTemplate, listPages } from "@/lib/storage";

export async function GET() {
  return Response.json(await listPages());
}

export async function POST(req: Request) {
  const { templateId, name } = await req.json();
  try {
    return Response.json(await createFromTemplate(templateId, name));
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
