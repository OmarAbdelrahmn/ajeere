import { NoticePageView } from "@/components/NoticePageView";
import { notices } from "@/lib/notices";

export default function Home() {
  return <NoticePageView notice={notices[0]} />;
}
