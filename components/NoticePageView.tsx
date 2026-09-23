"use client";

import { useState } from "react";
import {
  FaEllipsisH,
  FaHome,
  FaMinus,
  FaPaperPlane,
  FaPaperclip,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import { notices, type NoticeRecord } from "@/lib/notices";

const sourceBase = "https://ajeer.qiwa.sa";

type Row = [string, string, string, string];

function Header() {
  return (
    <header className="main-header">
      <div className="header-inner">
        <a href={`${sourceBase}/`} aria-label="Qiwa Ajeer">
          <img src="/assets/ajeer-logo.png" alt="Qiwa Ajeer" width={39} height={32} />
        </a>
        <a href="https://mlsd.gov.sa/" aria-label="MLSD">
          <img src="/assets/mlsd-logo.png" alt="MLSD" width={104} height={32} />
        </a>
      </div>
    </header>
  );
}

function VerificationTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <table className="details-table">
      <thead>
        <tr>
          <th colSpan={4}>{title}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("-")}>
            <th scope="row">{row[0]}</th>
            <td>{row[1]}</td>
            <th scope="row">{row[2]}</th>
            <td>{row[3]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VerificationContent({ notice }: { notice: NoticeRecord }) {
  const permitRows: Row[] = [
    ["رقم التصريح", notice.permit.number, "نوع التصريح", notice.permit.type],
    ["تاريخ بداية التصريح", notice.permit.startDate, "تاريخ نهاية التصريح", notice.permit.endDate],
  ];

  const workerRows: Row[] = [
    ["اسم العامل", notice.worker.name, "رقم الهوية / الإقامة", notice.worker.identityNumber],
    ["الجنسية", notice.worker.nationality, "المهنة", notice.worker.occupation],
    ["الجنس", notice.worker.gender, "تاريخ الميلاد", notice.worker.birthDate],
  ];

  const establishmentRows: Row[] = [
    ["رقم المنشأة", notice.establishment.number, "اسم المنشأة", notice.establishment.name],
  ];

  return (
    <section className="content-shell">
      <main className="verification-page">
        <div className="verification-document">
          <table className="verification-header" aria-label="حالة تصريح أجير">
            <tbody>
              <tr>
                <td className="brand-cell">
                  <div className="verification-logos">
                    <img src="/assets/ajeer-logo.png" alt="أجير" width={74} height={61} />
                    <img
                      src="/assets/mlsd-logo.png"
                      alt="وزارة الموارد البشرية والتنمية الاجتماعية"
                      width={172}
                      height={53}
                    />
                  </div>
                </td>
                <td className="title-cell"><h1>التحقق من تصريح أجير</h1></td>
                <td className="status-cell"><strong>{notice.status}</strong></td>
              </tr>
            </tbody>
          </table>

          <p className="success-message">{notice.verificationMessage}</p>

          <div className="tables-wrap">
            <VerificationTable title="بيانات التصريح" rows={permitRows} />
            <VerificationTable title="بيانات العامل" rows={workerRows} />
            <VerificationTable title="بيانات المنشأة" rows={establishmentRows} />
          </div>
        </div>
      </main>
    </section>
  );
}

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-links">
          <section className="footer-column">
            <h2>أجير</h2>
            <a href={`${sourceBase}/about`}>عن أجير</a>
            <a href={`${sourceBase}/about_notices`}>خدمات أجير</a>
          </section>
          <section className="footer-column">
            <h2>الدعم</h2>
            <a href={`${sourceBase}/support`}>الدعم و المساعدة</a>
            <a href={`${sourceBase}/faq`}>الأسئلة الشائعة</a>
          </section>
          <section className="footer-column footer-terms">
            <h2>الشروط و الخصوصية</h2>
            <a href={`${sourceBase}/terms`}>الشروط والأحكام</a>
            <a href={`${sourceBase}/privacy_policy`}>سياسة الخصوصية</a>
          </section>
          <section className="footer-column footer-contact">
            <h2>تواصل معنا</h2>
            <div className="social-links">
              <a href="https://twitter.com/AjeerSA" aria-label="X">
                <img src="/assets/x-twitter.svg" alt="X" width={15} height={15} />
              </a>
              <a href="mailto:support@ajeer.com.sa" aria-label="تواصل معنا عبر البريد الإلكتروني support@ajeer.com.sa">
                <FaPaperPlane aria-hidden="true" />
              </a>
              <a href="tel:920011040" aria-label="تواصل معنا عبر الهاتف 920011040">
                <FaPhone aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        <div className="partner-logos">
          <a href="https://mlsd.gov.sa/" aria-label="MLSD">
            <img src="/assets/mlsd-logo.png" alt="MLSD" width={150} height={50} />
          </a>
          <a href="https://takamolholding.com/" aria-label="Takamol">
            <img src="/assets/takamol-logo.png" alt="Takamol" width={96} height={50} />
          </a>
          <a href="https://tamkeentech.sa/" aria-label="Tamkeen">
            <img src="/assets/tamkeen-logo.svg" alt="Tamkeen" width={150} height={50} />
          </a>
          <a href="https://raqmi.dga.gov.sa/platforms/DigitalStamp/ShowCertificate/441" aria-label="Digital Government Authority">
            <img src="/assets/digital-govt-auth-logo.svg" alt="Digital Government Authority" width={300} height={85} />
          </a>
        </div>
      </div>
    </footer>
  );
}

function VirtualAssistant() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button className="assistant-launcher" type="button" onClick={() => setOpen(true)} aria-label="مساعدك الافتراضي من اجير">
        <img src="/assets/assistant-launcher.png" alt="" width={90} height={90} />
      </button>
    );
  }

  return (
    <aside className="assistant-panel" aria-label="مساعدك الافتراضي من اجير">
      <header className="assistant-titlebar">
        <div className="assistant-identity">
          <img src="/assets/assistant-launcher.png" alt="" width={43} height={43} />
          <p>مساعدك الافتراضي من اجير</p>
        </div>
        <div className="assistant-controls">
          <button type="button" onClick={() => setOpen(false)} aria-label="إغلاق"><FaTimes /></button>
          <button type="button" aria-label="تصغير"><FaMinus /></button>
          <button type="button" aria-label="الرئيسية"><FaHome /></button>
        </div>
      </header>

      <div className="assistant-body">
        <div className="assistant-error" role="status">
          <span className="error-dots" aria-hidden="true"><i /><i /><i /><i /></span>
          <p>Failed to fetch</p>
        </div>
      </div>

      <footer className="assistant-composer">
        <input type="text" aria-label="chatInput" placeholder="اكتب رسالتك هنا" disabled />
        <button type="button" disabled aria-label="المزيد"><FaEllipsisH /></button>
        <button type="button" disabled aria-label="إرفاق"><FaPaperclip /></button>
        <button type="button" disabled aria-label="إرسال"><FaPaperPlane /></button>
      </footer>
    </aside>
  );
}

export function NoticePageView({ notice }: { notice: NoticeRecord }) {
  return (
    <>
      <Header />
      <VerificationContent notice={notice} />
      <Footer />
      <VirtualAssistant />
    </>
  );
}

export default function Home() {
  return <NoticePageView notice={notices[0]} />;
}
