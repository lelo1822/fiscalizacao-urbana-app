
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { ArrowUpRight, TrendingUp, TrendingDown, Activity } from "lucide-react";

const reportData = [
  { month: "Jan", reports: 20, resolved: 15 },
  { month: "Feb", reports: 25, resolved: 20 },
  { month: "Mar", reports: 30, resolved: 25 },
  { month: "Apr", reports: 28, resolved: 26 },
  { month: "May", reports: 35, resolved: 30 },
  { month: "Jun", reports: 40, resolved: 34 }
];

const categoryData = [
  { name: "Buracos", count: 45 },
  { name: "Iluminação", count: 30 },
  { name: "Lixo", count: 25 },
  { name: "Árvores", count: 15 },
  { name: "Outros", count: 10 }
];

interface StatisticsChartsProps {
  className?: string;
}

const StatisticsCharts: React.FC<StatisticsChartsProps> = ({ className }) => {
  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Ocorrências por Mês
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={reportData}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="reports" 
                  stroke="#0284c7" 
                  fillOpacity={1} 
                  fill="url(#colorReports)" 
                  name="Ocorrências"
                />
                <Area 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorResolved)" 
                  name="Resolvidas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Ocorrências por Categoria
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-2 pb-0">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  name="Quantidade" 
                  fill="var(--primary-color, #2563eb)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <div 
            key={index} 
            className="flex items-center gap-2 text-xs"
            style={{ color: item.color }}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color }} 
            />
            <span>{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default StatisticsCharts;
