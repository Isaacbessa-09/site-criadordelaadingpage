import { PageView } from "@/components/PageView";

export default async function DraftView({ params }: PageProps<"/view/[id]">) {
  const { id } = await params;
  return <PageView draftId={id} />;
}
