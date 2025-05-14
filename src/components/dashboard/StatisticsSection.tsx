
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { StatItem } from "@/types/dashboard";

interface StatisticsSectionProps {
  stats: StatItem[];
}

const StatisticsSection = ({ stats }: StatisticsSectionProps) => {
  const renderTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return <ArrowUpIcon className="h-4 w-4 text-emerald-500" />;
    } else if (trend === 'down') {
      return <ArrowDownIcon className="h-4 w-4 text-rose-500" />;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-background rounded-lg p-4 border border-border shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                {stat.trend && (
                  <div className="flex items-center gap-1">
                    {renderTrendIcon(stat.trend)}
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-emerald-500' : 
                      stat.trend === 'down' ? 'text-rose-500' : ''
                    }`}>
                      {stat.percent}%
                    </span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsSection;
