
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { StatItem } from "@/types/dashboard";

interface StatisticsChartsProps {
  stats: StatItem[];
}

const StatisticsCharts = ({ stats }: StatisticsChartsProps) => {
  // Convert stats to format suitable for charts
  const chartData = stats.map(stat => ({
    name: stat.label,
    value: stat.value
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Estatísticas em Gráficos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill="var(--primary)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StatisticsCharts;
