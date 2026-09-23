import { notFound } from "next/navigation";
import { NoticePageView } from "@/components/NoticePageView";
import { getNoticeByCode, notices } from "@/lib/notices";

export const dynamicParams = false;

export function generateStaticParams() {
  return notices.map((notice) => ({ code: notice.code }));
}

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
