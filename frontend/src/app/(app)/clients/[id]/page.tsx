import { notFound } from "next/navigation";
import { ClientDetailClient } from "@/components/clients/ClientDetailClient";
import { getClient, getClientDetail } from "@/lib/clients-data";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();
  const detail = getClientDetail(client);

  return <ClientDetailClient client={client} detail={detail} />;
}
