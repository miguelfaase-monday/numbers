import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { type GradeResult, type GradingConfig, getMethodDisplayName } from "./grading";

function fileSafeDateTime(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toExportRows(results: GradeResult[], config: GradingConfig): Array<Record<string, string | number>> {
  return results.map((r) => ({
    Punten: r.punten % 1 === 0 ? r.punten : Number(r.punten.toFixed(1)),
    Fouten: r.fouten % 1 === 0 ? r.fouten : Number(r.fouten.toFixed(1)),
    Cijfer: r.cijferRounded.toFixed(config.rounding < 1 ? (config.rounding === 0.01 ? 2 : 1) : 0),
  }));
}

export function exportGradeTableCsv(results: GradeResult[], config: GradingConfig): void {
  const rows = toExportRows(results, config);
  const header = ["Punten", "Fouten", "Cijfer"];
  const lines = [
    header.join(","),
    ...rows.map((r) => `${r.Punten},${r.Fouten},${r.Cijfer}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `nummers-cijferoverzicht-${fileSafeDateTime()}.csv`);
}

export function exportGradeTableXlsx(results: GradeResult[], config: GradingConfig): void {
  const rows = toExportRows(results, config);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cijferoverzicht");
  const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([xlsxData], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `nummers-cijferoverzicht-${fileSafeDateTime()}.xlsx`);
}

export function exportGradeTablePdf(results: GradeResult[], config: GradingConfig): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.text("Nummers - Cijferoverzicht", 40, 44);
  doc.setFontSize(10);
  doc.setTextColor(110, 120, 140);
  doc.text(
    `Methode: ${getMethodDisplayName(config.method)}  |  Totaal punten: ${config.totalPoints}  |  Voldoende: ${config.voldoende}`,
    40,
    64
  );
  doc.text(`Gegenereerd: ${new Date().toLocaleString()}`, pageWidth - 40, 64, {
    align: "right",
  });

  autoTable(doc, {
    startY: 80,
    head: [["Punten", "Fouten", "Cijfer"]],
    body: results.map((r) => [
      r.punten % 1 === 0 ? r.punten : r.punten.toFixed(1),
      r.fouten % 1 === 0 ? r.fouten : r.fouten.toFixed(1),
      r.cijferRounded.toFixed(config.rounding < 1 ? (config.rounding === 0.01 ? 2 : 1) : 0),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [32, 48, 96],
      textColor: [255, 255, 255],
    },
  });

  doc.save(`nummers-cijferoverzicht-${fileSafeDateTime()}.pdf`);
}
