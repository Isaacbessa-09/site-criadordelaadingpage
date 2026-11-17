import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { TEMPLATES } from "./templates";
import { uid } from "./path";
import type { PageDoc } from "./types";

/**
 * Armazenamento das páginas:
 * - Na Vercel (ou sempre que houver as variáveis do Upstash/KV): Redis.
 * - No computador: arquivos JSON na pasta /data.
 */
const DATA = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
export const UPLOADS = path.join(DATA, "uploads");

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

interface Backend {
  get(kind: "page" | "pub", key: string): Promise<PageDoc | null>;
  put(kind: "page" | "pub", key: string, value: PageDoc): Promise<void>;
  del(kind: "page" | "pub", key: string): Promise<void>;
  listPages(): Promise<PageDoc[]>;
}

const redisBackend = (r: Redis): Backend => ({
  async get(kind, key) {
    return (await r.get<PageDoc>(`${kind}:${key}`)) ?? null;
  },
  async put(kind, key, value) {
    await r.set(`${kind}:${key}`, value);
    if (kind === "page") await r.sadd("pages", key);
  },
  async del(kind, key) {
    await r.del(`${kind}:${key}`);
    if (kind === "page") await r.srem("pages", key);
  },
  async listPages() {
    const ids = await r.smembers("pages");
    if (!ids.length) return [];
    const pages = await r.mget<(PageDoc | null)[]>(...ids.map((id) => `page:${id}`));
    return pages.filter((p): p is PageDoc => !!p);
  },
});

const dir = (kind: "page" | "pub") => path.join(DATA, kind === "page" ? "pages" : "published");
const fileBackend: Backend = {
  async get(kind, key) {
    try {
      return JSON.parse(await fs.readFile(path.join(dir(kind), `${key}.json`), "utf8"));
    } catch {
      return null;
    }
  },
  async put(kind, key, value) {
    await fs.mkdir(dir(kind), { recursive: true });
    await fs.writeFile(path.join(dir(kind), `${key}.json`), JSON.stringify(value, null, 2));
  },
  async del(kind, key) {
    await fs.rm(path.join(dir(kind), `${key}.json`), { force: true });
  },
  async listPages() {
    await fs.mkdir(dir("page"), { recursive: true });
    const files = (await fs.readdir(dir("page"))).filter((f) => f.endsWith(".json"));
    return Promise.all(files.map(async (f) => JSON.parse(await fs.readFile(path.join(dir("page"), f), "utf8")) as PageDoc));
  },
};

const db: Backend = redis ? redisBackend(redis) : fileBackend;
export const usingCloud = !!redis;

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");
export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export async function listPages(): Promise<PageDoc[]> {
  return (await db.listPages()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export const getPage = (id: string) => db.get("page", safeId(id));

export async function savePage(page: PageDoc): Promise<PageDoc> {
  const p = { ...page, id: safeId(page.id), updatedAt: new Date().toISOString() };
  await db.put("page", p.id, p);
  return p;
}

export async function deletePage(id: string) {
  const p = await getPage(id);
  if (p?.slug) await db.del("pub", p.slug);
  await db.del("page", safeId(id));
}

export async function createFromTemplate(templateId: string, name?: string): Promise<PageDoc> {
  const t = TEMPLATES.find((x) => x.id === templateId);
  if (!t) throw new Error("Template não encontrado");
  const base = t.build();
  const page: PageDoc = {
    ...base,
    id: uid("p"),
    name: name || `${t.name} — nova página`,
    updatedAt: new Date().toISOString(),
    sections: base.sections.map((s) => ({ ...s, id: uid(s.type) })),
  };
  return savePage(page);
}

export const getPublished = (slug: string) => db.get("pub", slugify(slug));

export async function publishPage(id: string, wanted: string): Promise<PageDoc> {
  const page = await getPage(id);
  if (!page) throw new Error("Página não encontrada");
  const slug = slugify(wanted || page.brand.name || page.name);
  if (!slug) throw new Error("Slug inválido");
  const existing = await getPublished(slug);
  if (existing && existing.id !== page.id) throw new Error(`O endereço "/${slug}" já está em uso por outra página.`);
  if (page.slug && page.slug !== slug) await db.del("pub", page.slug);
  const saved = await savePage({ ...page, slug, published: true, publishedAt: new Date().toISOString() });
  await db.put("pub", slug, saved);
  return saved;
}

export async function unpublishPage(id: string): Promise<PageDoc> {
  const page = await getPage(id);
  if (!page) throw new Error("Página não encontrada");
  if (page.slug) await db.del("pub", page.slug);
  return savePage({ ...page, published: false });
}
