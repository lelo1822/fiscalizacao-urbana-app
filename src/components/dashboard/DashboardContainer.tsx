
import StatisticsSection from "./StatisticsSection";
import { DashboardStats, StatItem } from "@/types/dashboard";
import StatisticsCharts from "./StatisticsCharts";
import NearbyIssuesSection from "./NearbyIssuesSection";
import RecentReportsSection from "./RecentReportsSection";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardContainerProps {
  isLoading: boolean;
  categoriesData: { categories: any[] };
  recentReportsData: any[];
  tasksData: any[] | null;
  dashboardStats: DashboardStats;
  stats: StatItem[];
  nearbyReports: any[] | null;
}

const DashboardContainer = ({
  isLoading,
  categoriesData,
  recentReportsData,
  tasksData,
  dashboardStats,
  stats,
  nearbyReports
}: DashboardContainerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Handle view details for reports
  const handleViewDetails = (reportId: number) => {
    navigate(`/report/${reportId}`);
  };

  return (
    <div className="container mx-auto px-2 md:px-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatisticsSection stats={stats} />
        
        <StatisticsCharts stats={stats} />
        
        <NearbyIssuesSection 
          isLoading={isLoading}
          issues={nearbyReports || []}
        />
        
        <div className={`${isMobile ? "" : "lg:col-span-2"}`}>
          <RecentReportsSection 
            isLoading={isLoading}
            reports={recentReportsData || []}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
