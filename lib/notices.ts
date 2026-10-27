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
    contractSummary?: string;
    workLocations?: string;
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
  beneficiary?: {
    number: string;
    name: string;
  };
};

export const notices = noticeData as NoticeRecord[];

function decodePermitIdFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) {
        b64 += "=";
      }
      const json =
        typeof atob === "function"
          ? atob(b64)
          : Buffer.from(parts[1], "base64url").toString("utf8");
      const payload = JSON.parse(json);
      if (typeof payload?.id === "string") {
        return payload.id;
      }
    }
  } catch {}
  return null;
}

export function getNoticeByCode(code: string) {
  const direct = notices.find(
    (notice) => notice.code === code || notice.permit.number === code,
  );
  if (direct) return direct;

  const permitId = decodePermitIdFromToken(code);
  if (permitId) {
    return notices.find((notice) => notice.permit.number.endsWith(permitId));
  }

  return undefined;
}

export function getNoticePath(notice: NoticeRecord) {
  return `/notice-verification/${encodeURIComponent(notice.code)}`;
}
