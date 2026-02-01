import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { GradingConfig, generateChartData } from "@/lib/grading";

interface GradeChartProps {
  config: GradingConfig;
}

export function GradeChart({ config }: GradeChartProps) {
  const chartData = useMemo(() => generateChartData(config), [config]);

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 no-print animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Cijfercurve</h3>
          <p className="text-xs text-muted-foreground">
            Visuele weergave van de punten-cijfer relatie
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="punten"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Punten",
                position: "bottom",
                offset: 0,
                style: {
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                },
              }}
            />
            <YAxis
              domain={[1, 10]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Cijfer",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: {
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "13px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              formatter={(value: number) => [value.toFixed(2), "Cijfer"]}
              labelFormatter={(label) => `${label} punten`}
            />
            {/* Voldoende line */}
            <ReferenceLine
              y={config.voldoende}
              stroke="hsl(var(--passing-foreground))"
              strokeDasharray="8 4"
              strokeWidth={2}
              label={{
                value: `Voldoende (${config.voldoende})`,
                position: "right",
                fill: "hsl(var(--passing-foreground))",
                fontSize: 11,
              }}
            />
            {/* Grade curve */}
            <Line
              type="monotone"
              dataKey="cijfer"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
