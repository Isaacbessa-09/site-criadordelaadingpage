import { createFromTemplate, listPages } from "@/lib/storage";

const fail = (e: unknown) => Response.json({ error: (e as Error).message }, { status: 500 });

export async function GET() {
  try {
    return Response.json(await listPages());
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  const { templateId, name } = await req.json();
  try {
    return Response.json(await createFromTemplate(templateId, name));
  } catch (e) {
    return fail(e);
  }
}
