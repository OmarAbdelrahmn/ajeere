"use client";

import { useEffect, useState } from "react";
import { FaArrowRight, FaDownload, FaFilePdf } from "react-icons/fa";
import type { NoticeRecord } from "@/lib/notices";
import {
  createDynamicOverlay,
  generatePermitPdf,
} from "@/lib/generatePermitPdf";

export function DownloadPage({ notice }: { notice: NoticeRecord }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    async function preparePdf() {
      try {
        const overlay = await createDynamicOverlay(notice);
        const bytes = await generatePermitPdf(notice, overlay);
        if (!active) return;

        setOverlayUrl(overlay);
        objectUrl = URL.createObjectURL(
          new Blob([bytes as BlobPart], { type: "application/pdf" }),
        );
        setPreviewUrl(objectUrl);
      } catch (cause) {
        if (!active) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "حدث خطأ أثناء تجهيز التصريح.",
        );
      }
    }

    void preparePdf();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [notice]);

  return (
    <main className="download-page" dir="rtl">
      <header className="download-toolbar">
        <div className="download-heading">
          <span className="download-file-icon" aria-hidden="true">
            <FaFilePdf />
          </span>
          <div>
            <p>تصريح أجير</p>
            <h1>{notice.permit.number}</h1>
          </div>
        </div>

        <div className="download-actions">
          <a
            className="download-back-link"
            href={`/notice-verification/${encodeURIComponent(notice.permit.number)}`}
          >
            <FaArrowRight aria-hidden="true" />
            <span>العودة للتحقق</span>
          </a>
          {previewUrl && !error ? (
            <a
              className="download-button"
              href={previewUrl}
              download={`ajeer-permit-${notice.permit.number}.pdf`}
            >
              <FaDownload aria-hidden="true" />
              <span>تحميل التصريح</span>
            </a>
          ) : (
            <button className="download-button" type="button" disabled>
              <FaDownload aria-hidden="true" />
              <span>جاري تجهيز التصريح</span>
            </button>
          )}
        </div>
      </header>

      <section className="download-preview" aria-label="معاينة تصريح أجير">
        {error ? (
          <div className="download-error" role="alert">
            <h2>تعذر تجهيز التصريح</h2>
            <p>{error}</p>
          </div>
        ) : previewUrl && overlayUrl ? (
          <div
            className="download-permit-sheet"
            role="img"
            aria-label={`معاينة تصريح ${notice.permit.number}`}
          >
            <img
              className="download-permit-base"
              src="/assets/ajeer-permit-preview.png"
              alt=""
              width={1191}
              height={1684}
            />
            <img
              className="download-permit-overlay"
              src={overlayUrl}
              alt=""
              width={2381}
              height={3368}
            />
          </div>
        ) : (
          <div className="download-loading" role="status" aria-live="polite">
            <span aria-hidden="true" />
            <p>جاري تجهيز نسخة PDF المطابقة للتصريح…</p>
          </div>
        )}
      </section>
    </main>
  );
}
