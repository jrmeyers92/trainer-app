"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface WeighIn {
  id: number;
  weight: number;
  weigh_in_date: string;
  notes: string | null;
  created_at: string;
}

interface WeighInChartProps {
  weighIns: WeighIn[];
}

const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type TimeRange = "1W" | "1M" | "3M" | "6M" | "1Y" | "ALL";

export default function WeighInChart({ weighIns }: WeighInChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");

  if (weighIns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight Progress</CardTitle>
          <CardDescription>Track your weight over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
            No weigh-ins recorded yet. Add your first weigh-in to see your
            progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter data based on time range
  const getFilteredWeighIns = () => {
    if (timeRange === "ALL") return weighIns;

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case "1W":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return weighIns.filter(
      (weighIn) => new Date(weighIn.weigh_in_date) >= cutoffDate
    );
  };

  const filteredWeighIns = getFilteredWeighIns();

  // Format data for the chart
  const chartData = filteredWeighIns.map((weighIn) => ({
    date: new Date(weighIn.weigh_in_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weight: Number(weighIn.weight),
    fullDate: weighIn.weigh_in_date,
  }));

  // Calculate stats
  const currentWeight = weighIns[weighIns.length - 1].weight;
  const startWeight = filteredWeighIns[0]?.weight || currentWeight;
  const weightChange = currentWeight - startWeight;
  const minWeight = Math.min(...filteredWeighIns.map((w) => Number(w.weight)));
  const maxWeight = Math.max(...filteredWeighIns.map((w) => Number(w.weight)));
  const isWeightLoss = weightChange < 0;
  const changePercentage =
    startWeight !== 0
      ? ((Math.abs(weightChange) / startWeight) * 100).toFixed(1)
      : "0.0";

  // Calculate Y-axis domain with padding
  const yMin = Math.floor(minWeight - 2);
  const yMax = Math.ceil(maxWeight + 2);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "1W", label: "1W" },
    { value: "1M", label: "1M" },
    { value: "3M", label: "3M" },
    { value: "6M", label: "6M" },
    { value: "1Y", label: "1Y" },
    { value: "ALL", label: "ALL" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>
              {filteredWeighIns.length} weigh-in
              {filteredWeighIns.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex gap-1 rounded-lg border p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  timeRange === range.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[yMin, yMax]}
              tickFormatter={(value) => `${value} lbs`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="weight"
              type="natural"
              stroke="var(--color-weight)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-weight)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isWeightLoss ? (
            <>
              Down {Math.abs(weightChange).toFixed(1)} lbs ({changePercentage}%)
              <TrendingDown className="h-4 w-4 text-green-600" />
            </>
          ) : weightChange > 0 ? (
            <>
              Up {weightChange.toFixed(1)} lbs ({changePercentage}%)
              <TrendingUp className="h-4 w-4 text-red-600" />
            </>
          ) : (
            <>No change from start</>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Current: {currentWeight} lbs | Range: {minWeight} - {maxWeight} lbs
        </div>
      </CardFooter>
    </Card>
  );
}
