import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { uid } from "@/lib/path";
import { UPLOADS, blobToken } from "@/lib/storage";

const OK: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif",
};

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Arquivo ausente" }, { status: 400 });
  const ext = OK[file.type];
  if (!ext) return Response.json({ error: "Formato não suportado (use JPG, PNG, WebP, GIF, SVG ou AVIF)" }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return Response.json({ error: "Imagem maior que 4 MB" }, { status: 400 });
  const name = `${uid("img")}.${ext}`;

  try {
    // Na Vercel: Vercel Blob. No computador: pasta data/uploads.
    const token = blobToken();
    if (token) {
      const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type, token });
      return Response.json({ url: blob.url });
    }
    if (process.env.VERCEL) {
      return Response.json(
        { error: "Upload de imagens não configurado. Na Vercel, vá em Storage > Create > Blob, conecte ao projeto e faça Redeploy." },
        { status: 500 },
      );
    }
    await fs.mkdir(UPLOADS, { recursive: true });
    await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOADS, name),Buffer.from(await file.arrayBuffer()));
    return Response.json({ url: `/api/uploads/${name}` });
  } catch (e) {
    return Response.json({ error: `Falha no upload: ${(e as Error).message}` }, { status: 500 });
  }
}
