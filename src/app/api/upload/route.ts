import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { uid } from "@/lib/path";
import { UPLOADS, blobToken, kvSet, usingRedis } from "@/lib/storage";

const OK: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif",
};

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Arquivo ausente" }, { status: 400 });
  const ext = OK[file.type];
  if (!ext) return Response.json({ error: "Formato não suportado (use JPG, PNG, WebP, GIF, SVG ou AVIF)" }, { status: 400 });
  const name = `${uid("img")}.${ext}`;

  try {
    // 1) Vercel Blob, se estiver conectado
    const token = blobToken();
    if (token) {
      if (file.size > 4 * 1024 * 1024) return Response.json({ error: "Imagem maior que 4 MB" }, { status: 400 });
      const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type, token });
      return Response.json({ url: blob.url });
    }
    // 2) Banco Redis (a imagem já chega comprimida pelo navegador)
    if (usingRedis()) {
      if (file.size > 2.5 * 1024 * 1024) return Response.json({ error: "Imagem grande demais (máx. 2,5 MB). Use uma foto menor." }, { status: 400 });
      const data = Buffer.from(await file.arrayBuffer()).toString("base64");
      await kvSet(`img:${name}`, { type: file.type, data });
      return Response.json({ url: `/api/uploads/${name}` });
    }
    if (process.env.VERCEL) {
      return Response.json({ error: "Banco de dados não configurado na Vercel (Storage > Upstash for Redis)." }, { status: 500 });
    }
    // 3) No computador: pasta data/uploads
    await fs.mkdir(UPLOADS, { recursive: true });
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOADS, name), Buffer.from(await file.arrayBuffer()));
    return Response.json({ url: `/api/uploads/${name}` });
  } catch (e) {
    return Response.json({ error: `Falha no upload: ${(e as Error).message}` }, { status: 500 });
  }
}
