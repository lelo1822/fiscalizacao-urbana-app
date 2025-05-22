
import StatisticsSection from "./StatisticsSection";
import TasksSection from "./TasksSection";
import CategoriesSection from "./CategoriesSection";
import QuickReportSection from "./QuickReportSection";
import RecentReportsSection from "./RecentReportsSection";
import MapSection from "./MapSection";
import NearbyIssuesSection from "./NearbyIssuesSection";
import StatisticsCharts from "./StatisticsCharts";
import { useAuth } from "@/context/AuthContext";
import { Report, StatItem, Task, WeatherInfo, DashboardStats, Category } from "@/types/dashboard";
import { useState } from "react";
import type { MapMarker } from "@/types/map";

interface DashboardContainerProps {
  stats: StatItem[];
  dashboardStats: DashboardStats;
  tasks: Task[];
  reports: Report[];
  nearbyReports: Report[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  weatherInfo: WeatherInfo | null;
  mapMarkers?: MapMarker[];
  userPosition?: [number, number] | null;
}

const DashboardContainer = ({
  stats,
  dashboardStats,
  tasks,
  reports,
  nearbyReports,
  categories = [],
  isLoading,
  error,
  weatherInfo,
  mapMarkers = [],
  userPosition = null
}: DashboardContainerProps) => {
  const { user } = useAuth();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const handleTaskComplete = (taskId: number) => {
    const updatedTasks = localTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setLocalTasks(updatedTasks);
  };

  const handleViewReportDetails = (reportId: number) => {
    // Handle viewing report details
    console.log("Viewing report details for:", reportId);
  };

  // Convert nearbyReports to the expected Issue format for NearbyIssuesSection
  const nearbyIssues = nearbyReports.map(report => ({
    id: report.id,
    type: report.type,
    address: report.address,
    status: report.status
  }));

  if (error) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <h3 className="text-lg font-medium">Erro ao carregar dados</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="col-span-3 mb-2">
        <StatisticsSection stats={stats} />
      </div>
      
      <div className="md:col-span-2 space-y-4">
        <StatisticsCharts dashboardStats={dashboardStats} />
        <RecentReportsSection 
          reports={reports} 
          isLoading={isLoading} 
          onViewDetails={handleViewReportDetails} 
        />
      </div>
      
      <div className="space-y-4">
        <TasksSection 
          taskList={localTasks}
          onTaskToggle={handleTaskComplete}
        />
        <CategoriesSection 
          categories={categories}
          onCategoryClick={(categoryName) => {
            console.log("Category clicked:", categoryName);
          }} 
        />
        {user?.role === "agent" && (
          <QuickReportSection 
            categories={categories} 
            onCategorySelect={(categoryName) => {
              console.log("Category selected for quick report:", categoryName);
            }} 
            isLoading={isLoading} 
          />
        )}
      </div>
      
      <div className="col-span-3 md:col-span-2">
        <MapSection 
          mapMarkers={mapMarkers}
          userPosition={userPosition}
          onMarkerClick={(marker) => {
            console.log("Map marker clicked:", marker);
          }}
        />
      </div>
      
      <div className="col-span-3 md:col-span-1">
        <NearbyIssuesSection 
          issues={nearbyIssues} 
          isLoading={isLoading} 
          onViewDetails={(id) => {
            console.log("View details for nearby issue:", id);
          }}
        />
      </div>
    </div>
  );
};

export default DashboardContainer;
