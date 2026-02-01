import { useMemo, useState } from "react";
import { Table, Copy, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradingConfig, generateGradeTable, tableToTSV, getMethodDisplayName } from "@/lib/grading";
import { formatGrade, cn } from "@/lib/utils";

interface GradeTableProps {
  config: GradingConfig;
}

export function GradeTable({ config }: GradeTableProps) {
  const [copied, setCopied] = useState(false);
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

  const handlePrint = () => {
    window.print();
  };

  const passingCount = gradeResults.filter((r) => r.isPassing).length;
  const failingCount = gradeResults.length - passingCount;

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-6 border-b border-border no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Table className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Cijfertabel</h3>
              <p className="text-xs text-muted-foreground">
                {gradeResults.length} scores • {passingCount} voldoende • {failingCount} onvoldoende
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Gekopieerd!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopieer naar Excel
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Afdrukken
            </Button>
          </div>
        </div>
      </div>

      {/* Print Header */}
      <div className="print-header hidden p-4">
        <h1 className="text-xl font-bold">Cijfertabel</h1>
        <p className="text-sm text-gray-600">
          Methode: {getMethodDisplayName(config.method)} • Totaal: {config.totalPoints} punten • Voldoende: {config.voldoende}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
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
                    ? "bg-passing/50 hover:bg-passing"
                    : "bg-failing/50 hover:bg-failing"
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
                      "text-sm font-semibold",
                      result.isPassing
                        ? "text-passing-foreground"
                        : "text-failing-foreground"
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
