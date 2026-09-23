import { redirect } from "next/navigation";
import { notices } from "@/lib/notices";

export default function LegacyDownloadRoute() {
  redirect(
    `/notice-verification/${encodeURIComponent(notices[0].permit.number)}/download`,
  );
}
