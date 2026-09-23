import Link from "next/link";
import { getNoticePath, notices } from "@/lib/notices";

export default function NoticeLinksPage() {
  return (
    <main className="records-index" dir="rtl">
      <div className="records-card">
        <h1>روابط التحقق من التصاريح</h1>
        <p>كل رابط ثابت ويمكن استخدامه مباشرة لإنشاء رمز QR.</p>
        <div className="records-list">
          {notices.map((notice) => {
            const path = getNoticePath(notice);
            return (
              <Link href={path} key={notice.code} className="record-link">
                <strong>{notice.permit.number}</strong>
                <span>{notice.worker.name}</span>
                <code>{path}</code>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
