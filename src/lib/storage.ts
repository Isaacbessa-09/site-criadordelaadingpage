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

/** Acha a variável mesmo com prefixo (ex: STORAGE_KV_REST_API_URL, que a Vercel às vezes cria). */
function findEnv(suffixes: string[]): string | undefined {
  for (const s of suffixes) if (process.env[s]) return process.env[s];
  const key = Object.keys(process.env).find((k) => suffixes.some((s) => k.endsWith(s)) && !k.includes("READ_ONLY"));
  return key ? process.env[key] : undefined;
}
const redisUrl = findEnv(["KV_REST_API_URL", "UPSTASH_REDIS_REST_URL"]);
const redisToken = findEnv(["KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN"]);
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const onVercel = !!process.env.VERCEL;

export const STORAGE_MISSING =
  "Banco de dados não configurado na Vercel. No projeto, vá em Storage > Create > Upstash for Redis, conecte ao projeto e faça Redeploy.";

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

// Na Vercel o disco é somente leitura: sem Redis, avisa com uma mensagem clara.
const missingBackend: Backend = {
  async get() {
    throw new Error(STORAGE_MISSING);
  },
  async put() {
    throw new Error(STORAGE_MISSING);
  },
  async del() {
    throw new Error(STORAGE_MISSING);
  },
  async listPages() {
    throw new Error(STORAGE_MISSING);
  },
};

const db: Backend = redis ? redisBackend(redis) : onVercel ? missingBackend : fileBackend;

export function storageStatus() {
  return {
    storage: redis ? "redis" : onVercel ? "ausente" : "arquivos",
    images: findEnv(["BLOB_READ_WRITE_TOKEN"]) ? "blob" : onVercel ? "ausente" : "arquivos",
    ai: !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN),
    password: !!process.env.APP_PASSWORD,
    onVercel,
  };
}
export const blobToken = () => findEnv(["BLOB_READ_WRITE_TOKEN"]);

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
