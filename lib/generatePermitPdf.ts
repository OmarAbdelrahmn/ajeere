import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import type { NoticeRecord } from "@/lib/notices";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const RENDER_SCALE = 4;
const TEMPLATE_PATH = "/assets/ajeer-permit-template.pdf";

type Cell = {
  x: number;
  top: number;
  width: number;
  height: number;
};

const cells = {
  riderOccupation: { x: 57.068, top: 221.824, width: 123.829, height: 19.05 },
  riderName: { x: 304.726, top: 221.824, width: 123.83, height: 19.05 },
  riderNationality: { x: 57.068, top: 240.874, width: 123.829, height: 19.05 },
  riderIdentity: { x: 304.726, top: 240.874, width: 123.83, height: 19.05 },
  contractSummary: { x: 57.068, top: 392.974, width: 371.488, height: 19.05 },
  permitEndDate: { x: 57.068, top: 412.024, width: 123.829, height: 19.05 },
  permitStartDate: { x: 304.726, top: 412.024, width: 123.83, height: 19.05 },
  workLocations: { x: 57.068, top: 431.074, width: 371.488, height: 19.05 },
} satisfies Record<string, Cell>;

function coverCell(context: CanvasRenderingContext2D, cell: Cell) {
  context.fillStyle = "#ffffff";
  context.fillRect(
    cell.x + 0.7,
    cell.top + 0.7,
    cell.width - 1.4,
    cell.height - 1.4,
  );
}

function drawCellValue(
  context: CanvasRenderingContext2D,
  value: string,
  cell: Cell,
) {
  const text = value || "";
  const maxWidth = cell.width - 8.25;
  let fontSize = 9;

  context.direction = "rtl";
  context.textAlign = "right";
  context.textBaseline = "alphabetic";
  context.fillStyle = "#000000";
  context.font = `${fontSize}px "FrutigerArabic", sans-serif`;

  while (fontSize > 6.5 && context.measureText(text).width > maxWidth) {
    fontSize -= 0.25;
    context.font = `${fontSize}px "FrutigerArabic", sans-serif`;
  }

  context.fillText(
    text,
    cell.x + cell.width - 4.125,
    cell.top + cell.height - 3.15,
    maxWidth,
  );
}

export async function createDynamicOverlay(notice: NoticeRecord) {
  await document.fonts.load('9px "FrutigerArabic"');

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PAGE_WIDTH * RENDER_SCALE);
  canvas.height = Math.round(PAGE_HEIGHT * RENDER_SCALE);

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("تعذر إنشاء طبقة بيانات التصريح.");
  }

  context.scale(RENDER_SCALE, RENDER_SCALE);

  // Replace the full interior of the QR cell. Extending the white backing to the
  // original cell edges prevents a faint PNG transparency seam around the QR block.
  context.fillStyle = "#ffffff";
  context.fillRect(58.86, 30.51, 76.3, 83.33);

  const verificationUrl = `https://ajeere.com/notice-verification/${encodeURIComponent(
    notice.code,
  )}`;
  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, verificationUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: Math.round(57.666 * RENDER_SCALE),
    color: { dark: "#000000", light: "#ffffff" },
  });

  context.imageSmoothingEnabled = false;
  context.drawImage(qrCanvas, 68.536, 34.113, 57.666, 57.666);
  context.imageSmoothingEnabled = true;
  context.direction = "ltr";
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillStyle = "#000000";
  context.font = '8.65px "FrutigerArabic", sans-serif';
  context.fillText(notice.permit.number, 97.369, 103.42);
  context.direction = "rtl";
  context.font = '6.73px "FrutigerArabic", sans-serif';
  context.fillText("امسح للتحقق", 97.369, 111.2);

  Object.values(cells).forEach((cell) => coverCell(context, cell));

  drawCellValue(context, notice.worker.occupation, cells.riderOccupation);
  drawCellValue(context, notice.worker.name, cells.riderName);
  drawCellValue(context, notice.worker.nationality, cells.riderNationality);
  drawCellValue(context, notice.worker.identityNumber, cells.riderIdentity);
  drawCellValue(
    context,
    notice.permit.contractSummary ?? "",
    cells.contractSummary,
  );
  drawCellValue(context, notice.permit.endDate, cells.permitEndDate);
  drawCellValue(context, notice.permit.startDate, cells.permitStartDate);
  drawCellValue(
    context,
    notice.permit.workLocations ?? "",
    cells.workLocations,
  );

  return canvas.toDataURL("image/png");
}

export async function generatePermitPdf(
  notice: NoticeRecord,
  preparedOverlay?: string,
) {
  const response = await fetch(TEMPLATE_PATH);
  if (!response.ok) {
    throw new Error("تعذر تحميل قالب التصريح.");
  }

  const sourcePdf = await response.arrayBuffer();
  const pdfDocument = await PDFDocument.load(sourcePdf);
  const [page] = pdfDocument.getPages();

  // Keep the original A4 media box and all fixed PDF content untouched.
  page.setSize(PAGE_WIDTH, PAGE_HEIGHT);
  const overlayDataUrl = preparedOverlay ?? (await createDynamicOverlay(notice));
  const overlay = await pdfDocument.embedPng(overlayDataUrl);
  page.drawImage(overlay, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    opacity: 1,
  });

  // A transparent point makes explicit that the page remains full-color RGB.
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 0.01,
    height: 0.01,
    color: rgb(1, 1, 1),
    opacity: 0,
  });

  return pdfDocument.save({ useObjectStreams: false });
}
