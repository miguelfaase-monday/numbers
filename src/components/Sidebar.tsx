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

const methodTypeLabel: Record<GradingMethod, string> = {
  "n-term": "Type: standaard",
  percentage: "Type: non-lineair",
  fouten: "Type: per punt",
  goed: "Type: per punt",
  "fixed-cutoff": "Type: non-lineair",
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
    <aside className="w-full lg:w-80 lg:flex-shrink-0 bg-card/75 border border-border/80 rounded-2xl no-print">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Normering</h2>
            <p className="text-xs text-muted-foreground">Stel in hoe punten worden omgerekend naar cijfers.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalPoints" className="text-xs uppercase tracking-wide text-muted-foreground">
              Maximaal aantal punten
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
              Grens voor voldoende
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

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Normeringsmethode
          </Label>

          <Tabs
            value={config.method}
            onValueChange={(value) => onConfigChange({ method: value as GradingMethod })}
          >
            <TabsList className="grid grid-cols-2 gap-1 h-auto">
              <TabsTrigger value="n-term" className="flex items-center gap-1.5 text-[13px] py-2.5">
                {methodIcons["n-term"]}
                <span>N-term</span>
              </TabsTrigger>
              <TabsTrigger value="percentage" className="flex items-center gap-1.5 text-[13px] py-2.5">
                {methodIcons.percentage}
                <span>Cesuur %</span>
              </TabsTrigger>
              <TabsTrigger value="fouten" className="flex items-center gap-1.5 text-[13px] py-2.5">
                {methodIcons.fouten}
                <span>Fouten per punt</span>
              </TabsTrigger>
              <TabsTrigger value="goed" className="flex items-center gap-1.5 text-[13px] py-2.5">
                {methodIcons.goed}
                <span>Goed per punt</span>
              </TabsTrigger>
              <TabsTrigger value="fixed-cutoff" className="flex items-center gap-1.5 text-[13px] py-2.5 col-span-2">
                {methodIcons["fixed-cutoff"]}
                <span>Cesuur in punten</span>
              </TabsTrigger>
            </TabsList>

            <p className="mt-2 text-[11px] text-muted-foreground">
              {methodTypeLabel[config.method]}
            </p>

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
                label="Cesuur (%)"
                description={getMethodDescription("percentage")}
                value={config.passPercentage}
                onChange={(v) => onConfigChange({ passPercentage: v })}
                min={0}
                max={100}
                step={0.1}
                unit="%"
              />
            </TabsContent>

            <TabsContent value="fouten">
              <MethodControl
                label="Fouten per punt (K)"
                description={getMethodDescription("fouten")}
                value={config.foutenKFactor}
                onChange={(v) => onConfigChange({ foutenKFactor: v })}
                min={1}
                max={20}
                step={1}
                unit=""
                integerOnly
              />
            </TabsContent>

            <TabsContent value="goed">
              <MethodControl
                label="Goede antwoorden per punt (K)"
                description={getMethodDescription("goed")}
                value={config.goedKFactor}
                onChange={(v) => onConfigChange({ goedKFactor: v })}
                min={1}
                max={20}
                step={1}
                unit=""
                integerOnly
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
                step={0.1}
                unit=" punten"
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Afronden op
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
  integerOnly?: boolean;
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
  integerOnly = false,
}: MethodControlProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/55 rounded-xl border border-border/60 transition-all duration-200 hover:border-primary/30">
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
                  const normalized = integerOnly ? Math.round(num) : num;
                  onChange(Math.min(max, Math.max(min, normalized)));
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
