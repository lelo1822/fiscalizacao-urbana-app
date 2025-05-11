
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  trend: "up" | "down";
  percent: number;
}

interface StatisticsSectionProps {
  stats: StatItem[];
}

const StatisticsSection = ({ stats }: StatisticsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
              <div className={`flex items-center ${
                stat.trend === 'up' ? 'text-success' : 'text-destructive'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-xs font-medium">{stat.percent}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsSection;
