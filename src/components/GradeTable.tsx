import { useMemo, useState } from "react";
import { Table, Check, FileSpreadsheet, FileText, FileType2, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradingConfig, generateGradeTable, tableToTSV, getMethodDisplayName } from "@/lib/grading";
import { formatGrade, cn } from "@/lib/utils";
import {
  exportGradeTableCsv,
  exportGradeTablePdf,
  exportGradeTableXlsx,
} from "@/lib/export";

interface GradeTableProps {
  config: GradingConfig;
}

export function GradeTable({ config }: GradeTableProps) {
  const [copied, setCopied] = useState(false);
  const [lastExport, setLastExport] = useState<"csv" | "xlsx" | "pdf" | null>(null);
  const gradeResults = useMemo(() => generateGradeTable(config), [config]);

  const handleCopy = async () => {
    const tsv = tableToTSV(gradeResults, config);
    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCsv = () => {
    exportGradeTableCsv(gradeResults, config);
    setLastExport("csv");
  };

  const handleXlsx = () => {
    exportGradeTableXlsx(gradeResults, config);
    setLastExport("xlsx");
  };

  const handlePdf = () => {
    exportGradeTablePdf(gradeResults, config);
    setLastExport("pdf");
  };

  const passingCount = gradeResults.filter((r) => r.isPassing).length;
  const failingCount = gradeResults.length - passingCount;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-card overflow-hidden animate-slide-up transition-all duration-300 hover:shadow-elevated hover:border-primary/35">
      <div className="p-6 border-b border-border no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/70 flex items-center justify-center">
              <Table className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Cijferoverzicht</h3>
              <p className="text-xs text-muted-foreground">
                {gradeResults.length} puntenwaarden • {passingCount} voldoende • {failingCount} onvoldoende
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCsv}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleXlsx}
              className="gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel (.xlsx)
            </Button>
            <Button variant="outline" size="sm" onClick={handlePdf} className="gap-2">
              <FileType2 className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Exporteer dit overzicht als bestand voor delen of archiveren.
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Gekopieerd
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5" />
                Kopieer (fallback)
              </>
            )}
          </button>
        </div>
        {lastExport && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Laatste export: {lastExport.toUpperCase()}
          </p>
        )}
      </div>

      <div className="print-header hidden p-4">
        <h1 className="text-xl font-bold">Cijferoverzicht</h1>
        <p className="text-sm text-gray-600">
          Methode: {getMethodDisplayName(config.method)} • Totaal: {config.totalPoints} punten • Voldoende: {config.voldoende}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full grade-table">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Punten
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fouten
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Cijfer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {gradeResults.map((result, index) => (
              <tr
                key={index}
                className={cn(
                  "transition-colors duration-150",
                  result.isPassing
                    ? "bg-card hover:bg-passing/10"
                    : "bg-card hover:bg-failing/10"
                )}
              >
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-foreground">
                    {result.punten % 1 === 0 ? result.punten : result.punten.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="text-sm text-muted-foreground">
                    {result.fouten % 1 === 0 ? result.fouten : result.fouten.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold",
                      result.isPassing
                        ? "bg-passing/15 text-passing-foreground"
                        : "bg-failing/15 text-failing-foreground"
                    )}
                  >
                    {formatGrade(result.cijferRounded, config.rounding)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
