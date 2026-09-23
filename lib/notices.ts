import noticeData from "@/data/notices.json";

export type NoticeRecord = {
  code: string;
  status: string;
  verificationMessage: string;
  permit: {
    number: string;
    type: string;
    startDate: string;
    endDate: string;
  };
  worker: {
    name: string;
    identityNumber: string;
    nationality: string;
    occupation: string;
    gender: string;
    birthDate: string;
  };
  establishment: {
    number: string;
    name: string;
  };
};

export const notices = noticeData as NoticeRecord[];

export function getNoticeByCode(code: string) {
  return notices.find((notice) => notice.code === code);
}

export function getNoticePath(notice: NoticeRecord) {
  return `/notice-verification/${encodeURIComponent(notice.code)}`;
}
