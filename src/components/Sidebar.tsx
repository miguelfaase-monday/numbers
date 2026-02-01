import React from "react";
import {
  Calculator,
  Percent,
  MinusCircle,
  PlusCircle,
  Target,
  Settings2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  GradingConfig,
  GradingMethod,
  getMethodDescription,
} from "@/lib/grading";

interface SidebarProps {
  config: GradingConfig;
  onConfigChange: (updates: Partial<GradingConfig>) => void;
}

const methodIcons: Record<GradingMethod, React.ReactNode> = {
  "n-term": <Calculator className="w-4 h-4" />,
  percentage: <Percent className="w-4 h-4" />,
  fouten: <MinusCircle className="w-4 h-4" />,
  goed: <PlusCircle className="w-4 h-4" />,
  "fixed-cutoff": <Target className="w-4 h-4" />,
};

export function Sidebar({ config, onConfigChange }: SidebarProps) {
  const handleNumberInput = (
    field: keyof GradingConfig,
    value: string,
    min?: number,
    max?: number
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      let clampedValue = num;
      if (min !== undefined) clampedValue = Math.max(min, clampedValue);
      if (max !== undefined) clampedValue = Math.min(max, clampedValue);
      onConfigChange({ [field]: clampedValue });
    }
  };

  return (
    <aside className="w-80 flex-shrink-0 bg-card border-r border-border h-full overflow-y-auto no-print">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Instellingen</h2>
            <p className="text-xs text-muted-foreground">Configureer de berekening</p>
          </div>
        </div>

        {/* Basic Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalPoints" className="text-xs uppercase tracking-wide text-muted-foreground">
              Totaal punten
            </Label>
            <Input
              id="totalPoints"
              type="number"
              min={1}
              step={0.5}
              value={config.totalPoints}
              onChange={(e) => handleNumberInput("totalPoints", e.target.value, 1)}
              className="font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voldoende" className="text-xs uppercase tracking-wide text-muted-foreground">
              Voldoende (ondergrens)
            </Label>
            <Input
              id="voldoende"
              type="number"
              min={1}
              max={10}
              step={0.1}
              value={config.voldoende}
              onChange={(e) => handleNumberInput("voldoende", e.target.value, 1, 10)}
              className="font-medium"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Method Picker */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Berekeningsmethode
          </Label>

          <Tabs
            value={config.method}
            onValueChange={(value) => onConfigChange({ method: value as GradingMethod })}
          >
            <TabsList className="grid grid-cols-2 gap-1 h-auto">
              <TabsTrigger value="n-term" className="flex items-center gap-1.5 text-xs py-2">
                {methodIcons["n-term"]}
                <span>N-term</span>
              </TabsTrigger>
              <TabsTrigger value="percentage" className="flex items-center gap-1.5 text-xs py-2">
                {methodIcons.percentage}
                <span>Cesuur %</span>
              </TabsTrigger>
              <TabsTrigger value="fouten" className="flex items-center gap-1.5 text-xs py-2">
                {methodIcons.fouten}
                <span>Fouten/pt</span>
              </TabsTrigger>
              <TabsTrigger value="goed" className="flex items-center gap-1.5 text-xs py-2">
                {methodIcons.goed}
                <span>Goed/pt</span>
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-1 gap-1 h-auto mt-1">
              <TabsTrigger value="fixed-cutoff" className="flex items-center gap-1.5 text-xs py-2">
                {methodIcons["fixed-cutoff"]}
                <span>Punten Cesuur</span>
              </TabsTrigger>
            </TabsList>

            {/* Method-specific controls */}
            <TabsContent value="n-term">
              <MethodControl
                label="N-waarde"
                description={getMethodDescription("n-term")}
                value={config.nTerm}
                onChange={(v) => onConfigChange({ nTerm: v })}
                min={0}
                max={3}
                step={0.1}
                unit=""
              />
            </TabsContent>

            <TabsContent value="percentage">
              <MethodControl
                label="Cesuur percentage"
                description={getMethodDescription("percentage")}
                value={config.passPercentage}
                onChange={(v) => onConfigChange({ passPercentage: v })}
                min={0}
                max={100}
                step={1}
                unit="%"
              />
            </TabsContent>

            <TabsContent value="fouten">
              <MethodControl
                label="K-factor (fouten)"
                description={getMethodDescription("fouten")}
                value={config.foutenKFactor}
                onChange={(v) => onConfigChange({ foutenKFactor: v })}
                min={0.1}
                max={20}
                step={0.1}
                unit=""
              />
            </TabsContent>

            <TabsContent value="goed">
              <MethodControl
                label="K-factor (goed)"
                description={getMethodDescription("goed")}
                value={config.goedKFactor}
                onChange={(v) => onConfigChange({ goedKFactor: v })}
                min={0.1}
                max={20}
                step={0.1}
                unit=""
              />
            </TabsContent>

            <TabsContent value="fixed-cutoff">
              <MethodControl
                label="Cesuur punten"
                description={getMethodDescription("fixed-cutoff")}
                value={config.fixedCutoff}
                onChange={(v) => onConfigChange({ fixedCutoff: v })}
                min={0}
                max={config.totalPoints}
                step={0.5}
                unit="pt"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Rounding */}
        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Afronding
          </Label>
          <ToggleGroup
            type="single"
            value={config.rounding.toString()}
            onValueChange={(value) => {
              if (value) onConfigChange({ rounding: parseFloat(value) });
            }}
          >
            <ToggleGroupItem value="1" className="text-xs">
              1
            </ToggleGroupItem>
            <ToggleGroupItem value="0.5" className="text-xs">
              0.5
            </ToggleGroupItem>
            <ToggleGroupItem value="0.1" className="text-xs">
              0.1
            </ToggleGroupItem>
            <ToggleGroupItem value="0.01" className="text-xs">
              0.01
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </aside>
  );
}

interface MethodControlProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

function MethodControl({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: MethodControlProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
      <p className="text-xs text-muted-foreground font-mono">{description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm">{label}</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) {
                  onChange(Math.min(max, Math.max(min, num)));
                }
              }}
              className="w-20 h-8 text-sm text-center"
            />
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>

        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
