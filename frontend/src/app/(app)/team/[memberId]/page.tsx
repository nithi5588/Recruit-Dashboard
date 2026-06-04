import { notFound } from "next/navigation";
import { TeamMemberDetail } from "@/components/team/TeamMemberDetail";
import { getMemberDetail } from "@/lib/team-data";

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const member = getMemberDetail(memberId);
  if (!member) notFound();

  return <TeamMemberDetail member={member} />;
}
