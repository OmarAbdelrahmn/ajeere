import { notFound } from "next/navigation";
import { NoticePageView } from "@/components/NoticePageView";
import { getNoticeByCode } from "@/lib/notices";

export const dynamic = "force-dynamic";

export default async function NoticeVerificationRoute({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const notice = getNoticeByCode(decodeURIComponent(code));

  if (!notice) {
    notFound();
  }

  return <NoticePageView notice={notice} />;
}
