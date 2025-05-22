
import StatisticsSection from "./StatisticsSection";
import { DashboardStats } from "@/types/dashboard";
import StatisticsCharts from "./StatisticsCharts";
import NearbyIssuesSection from "./NearbyIssuesSection";
import MapSection from "./MapSection";
import CategoriesSection from "./CategoriesSection";
import QuickReportSection from "./QuickReportSection";
import RecentReportsSection from "./RecentReportsSection";
import TasksSection from "./TasksSection";

interface DashboardContainerProps {
  isLoading: boolean;
  categoriesData: any;
  recentReportsData: any[];
  tasksData: any[] | null;
  dashboardStats: DashboardStats;
  userLocation: [number, number] | null;
  nearbyReports: any[] | null;
}

const DashboardContainer = ({
  isLoading,
  categoriesData,
  recentReportsData,
  tasksData,
  dashboardStats,
  userLocation,
  nearbyReports
}: DashboardContainerProps) => {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatisticsSection stats={dashboardStats} isLoading={isLoading} />
        
        {/* Pass the dashboardStats to StatisticsCharts using the correct prop name */}
        <StatisticsCharts dashboardStats={dashboardStats} />
        
        <NearbyIssuesSection 
          isLoading={isLoading}
          nearbyReports={nearbyReports || []}
        />
        
        <MapSection />
        
        <CategoriesSection 
          categoriesData={categoriesData} 
        />
        
        <QuickReportSection 
          categories={categoriesData?.categories || []} 
          onCategorySelect={() => {}} 
          isLoading={isLoading}
        />
        
        <RecentReportsSection 
          isLoading={isLoading}
          reports={recentReportsData}
        />
        
        <TasksSection 
          tasks={tasksData || []}
        />
      </div>
    </div>
  );
};

export default DashboardContainer;
