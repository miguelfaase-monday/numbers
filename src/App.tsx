import { useCallback } from "react";
import { Calculator } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { QuickLookup } from "@/components/QuickLookup";
import { GradeChart } from "@/components/GradeChart";
import { GradeTable } from "@/components/GradeTable";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GradingConfig, DEFAULT_CONFIG } from "@/lib/grading";

function App() {
  const [config, setConfig] = useLocalStorage<GradingConfig>(
    "nummers-config",
    DEFAULT_CONFIG
  );

  const handleConfigChange = useCallback(
    (updates: Partial<GradingConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }));
    },
    [setConfig]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-card/95 border-b border-border/80 px-4 lg:px-6 py-3 no-print backdrop-blur">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/60 flex items-center justify-center shadow-soft">
              <Calculator className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground leading-tight tracking-wide">
                Nummers
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Toetsnormering
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
        <Sidebar config={config} onConfigChange={handleConfigChange} />

          <main className="flex-1 w-full space-y-6">
            <QuickLookup config={config} />

            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Inzicht</h2>
                <p className="text-xs text-muted-foreground">
                  Zie direct hoe de normering verloopt en waar de voldoendegrens ligt.
                </p>
              </div>
              <GradeChart config={config} />
            </section>

            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Volledige referentie</h2>
                <p className="text-xs text-muted-foreground">
                  Controleer alle punten, fouten en cijfers in een volledig overzicht.
                </p>
              </div>
              <GradeTable config={config} />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
