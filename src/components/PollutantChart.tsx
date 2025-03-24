
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Label,
  ReferenceLine
} from "recharts";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pollutant } from "@/utils/airQualityUtils";

interface PollutantChartProps {
  pollutants: Pollutant[];
  isLoading?: boolean;
}

const PollutantChart: React.FC<PollutantChartProps> = ({ pollutants, isLoading = false }) => {
  // Reference values for "unhealthy" levels for each pollutant
  const referenceValues: Record<string, number> = {
    "PM2.5": 35,
    "PM10": 150,
    "O3": 70,
    "NO2": 100,
    "SO2": 75,
    "CO": 9,
  };

  // Prepare data for the chart
  const chartData = pollutants.map((pollutant) => {
    // Calculate percentage of unhealthy level
    const refValue = referenceValues[pollutant.name] || 100;
    const percentage = (pollutant.value / refValue) * 100;
    
    return {
      name: pollutant.name,
      value: pollutant.value,
      percentage: Math.min(percentage, 150), // Cap at 150% for visualization
      unit: pollutant.unit,
      description: pollutant.description,
      refValue,
    };
  });

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-border shadow-md">
          <p className="font-medium">{data.name} ({data.value} {data.unit})</p>
          <p className="text-sm text-muted-foreground">
            {(data.percentage).toFixed(0)}% of unhealthy level
          </p>
          <p className="text-xs mt-1 max-w-60">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse-slow shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pollutant Levels</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Chart shows pollutant levels as a percentage of the threshold where they become unhealthy.
                  Values over 100% are considered unhealthy.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
              barSize={36}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 150]}
                ticks={[0, 50, 100, 150]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <ReferenceLine y={100} stroke="#FF9800" strokeWidth={2} strokeDasharray="3 3">
                <Label
                  value="Unhealthy Level"
                  position="insideBottomRight"
                  fill="#FF9800"
                  fontSize={12}
                />
              </ReferenceLine>
              <Bar
                dataKey="percentage"
                radius={[4, 4, 0, 0]}
                fill="url(#colorGradient)"
                animationDuration={1000}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(76, 175, 80, 0.8)" />
                  <stop offset="50%" stopColor="rgba(255, 235, 59, 0.8)" />
                  <stop offset="100%" stopColor="rgba(244, 67, 54, 0.8)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollutantChart;
