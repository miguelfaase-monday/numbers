import { useState, useMemo } from "react";
import { Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GradingConfig, calculateGrade, getMethodDisplayName } from "@/lib/grading";
import { roundToNearest, formatGrade } from "@/lib/utils";

interface QuickLookupProps {
  config: GradingConfig;
}

export function QuickLookup({ config }: QuickLookupProps) {
  const [inputValue, setInputValue] = useState("");
  const [lookupMode, setLookupMode] = useLocalStorage<"goed" | "fout">(
    "nummers-quick-lookup-mode",
    "goed"
  );

  const result = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0 || value > config.totalPoints) {
      return null;
    }

    const score = lookupMode === "fout" ? config.totalPoints - value : value;
    const rawGrade = calculateGrade(score, config);
    const roundedGrade = roundToNearest(rawGrade, config.rounding);
    const isPassing = roundedGrade >= config.voldoende;
    return { rawGrade, roundedGrade, isPassing, score };
  }, [inputValue, config, lookupMode]);

  const isValidInput = inputValue !== "" && result !== null;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-card p-6 no-print animate-fade-in transition-all duration-300 hover:shadow-elevated hover:border-primary/40">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">
              Snel berekenen
            </label>
            <ToggleGroup
              type="single"
              value={lookupMode}
              onValueChange={(value) => {
                if (value === "goed" || value === "fout") {
                  setLookupMode(value);
                }
              }}
              className="mb-2 w-full sm:max-w-[260px]"
            >
              <ToggleGroupItem value="goed" className="text-[13px] py-2.5">
                Goede antwoorden
              </ToggleGroupItem>
              <ToggleGroupItem value="fout" className="text-[13px] py-2.5">
                Fouten
              </ToggleGroupItem>
            </ToggleGroup>
            <Input
              type="number"
              placeholder={`${lookupMode === "goed" ? "Aantal goede antwoorden" : "Aantal fouten"} (0-${config.totalPoints})`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min={0}
              max={config.totalPoints}
              step={0.5}
              className="text-lg font-medium h-12 bg-background/70"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center w-12">
          <Zap className="w-6 h-6 text-muted-foreground" />
        </div>

        <div
          className={`flex-shrink-0 w-full md:w-auto min-w-[220px] p-4 rounded-xl border transition-all duration-300 ${
            isValidInput
              ? result?.isPassing
                ? "bg-passing/20 border-passing/40 shadow-soft"
                : "bg-failing/20 border-failing/40 shadow-soft"
              : "bg-muted/40 border-border"
          }`}
        >
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Cijfer
            </p>
            <p
              className={`text-4xl font-bold transition-all duration-300 ${
                isValidInput
                  ? result?.isPassing
                    ? "text-passing-foreground"
                    : "text-failing-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              {isValidInput && result
                ? formatGrade(result.roundedGrade, config.rounding)
                : "—"}
            </p>
            {isValidInput && result && (
              <p className="text-xs text-muted-foreground mt-1">
                {result.isPassing ? "Voldoende" : "Onvoldoende"} ·
                {" "}
                punten: {result.score % 1 === 0 ? result.score : result.score.toFixed(1)}
                {" "}
                · {getMethodDisplayName(config.method)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
