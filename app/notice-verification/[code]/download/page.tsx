import { notFound } from "next/navigation";
import { DownloadPage } from "@/components/DownloadPage";
import { getNoticeByCode } from "@/lib/notices";

export const metadata = {
  title: "تحميل تصريح أجير",
  description: "معاينة وتحميل تصريح أجير بصيغة PDF",
};

export const dynamic = "force-dynamic";

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
