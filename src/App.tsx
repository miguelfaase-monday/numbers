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
    "cijfer-calculator-config",
    DEFAULT_CONFIG
  );

  const handleConfigChange = useCallback(
    (updates: Partial<GradingConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }));
    },
    [setConfig]
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="flex-shrink-0 h-14 bg-card border-b border-border flex items-center px-6 gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
            <Calculator className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-tight">
              Cijfers
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Bereken cijfers voor een toets.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar config={config} onConfigChange={handleConfigChange} />

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Quick Lookup */}
            <QuickLookup config={config} />

            {/* Chart & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GradeChart config={config} />
              <div className="lg:col-span-2">
                <GradeTable config={config} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 h-10 bg-card border-t border-border flex items-center justify-center text-xs text-muted-foreground no-print">
        <span> </span>
      </footer>
    </div>
  );
}

export default App;
