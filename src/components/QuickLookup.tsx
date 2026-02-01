import { useState, useMemo } from "react";
import { Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GradingConfig, calculateGrade } from "@/lib/grading";
import { roundToNearest, formatGrade } from "@/lib/utils";

interface QuickLookupProps {
  config: GradingConfig;
}

export function QuickLookup({ config }: QuickLookupProps) {
  const [inputValue, setInputValue] = useState("");

  const result = useMemo(() => {
    const score = parseFloat(inputValue);
    if (isNaN(score) || score < 0 || score > config.totalPoints) {
      return null;
    }
    const rawGrade = calculateGrade(score, config);
    const roundedGrade = roundToNearest(rawGrade, config.rounding);
    const isPassing = roundedGrade >= config.voldoende;
    return { rawGrade, roundedGrade, isPassing };
  }, [inputValue, config]);

  const isValidInput = inputValue !== "" && result !== null;

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 no-print animate-fade-in">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Input Section */}
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide text-muted-foreground mb-1 block">
              Snel opzoeken
            </label>
            <Input
              type="number"
              placeholder={`Voer score in (0-${config.totalPoints})`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min={0}
              max={config.totalPoints}
              step={0.5}
              className="text-lg font-medium h-12"
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center w-12">
          <Zap className="w-6 h-6 text-muted-foreground" />
        </div>

        {/* Result Section */}
        <div
          className={`flex-shrink-0 w-full md:w-auto min-w-[200px] p-4 rounded-xl transition-all duration-300 ${
            isValidInput
              ? result?.isPassing
                ? "bg-passing"
                : "bg-failing"
              : "bg-muted"
          }`}
        >
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Resultaat
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
                {result.isPassing ? "Voldoende" : "Onvoldoende"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
