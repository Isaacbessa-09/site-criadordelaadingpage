import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { getPublished } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublished(slug).catch(() => null);
  if (!page) return { title: "Página não encontrada" };
  return { title: page.seo?.title || page.brand.name, description: page.seo?.description };
}

export default async function PublishedPage({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  const page = await getPublished(slug).catch(() => null);
  if (!page) notFound();
  return <PageView page={page} />;
}
