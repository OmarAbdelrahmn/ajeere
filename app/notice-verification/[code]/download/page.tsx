import { notFound } from "next/navigation";
import { DownloadPage } from "@/components/DownloadPage";
import { getNoticeByCode, notices } from "@/lib/notices";

export const metadata = {
  title: "تحميل تصريح أجير",
  description: "معاينة وتحميل تصريح أجير بصيغة PDF",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return notices.flatMap((notice) => [
    { code: notice.code },
    { code: notice.permit.number },
  ]);
}

export default async function RiderDownloadRoute({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const notice = getNoticeByCode(decodeURIComponent(code));

  if (!notice) {
    notFound();
  }

  return <DownloadPage notice={notice} />;
}
