import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LocationTracker from "@/components/LocationTracker";
import { useDashboardData } from "@/hooks/useDashboardData";

// Import refactored components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatisticsSection from "@/components/dashboard/StatisticsSection";
import MapSection from "@/components/dashboard/MapSection";
import TasksSection from "@/components/dashboard/TasksSection";
import NearbyIssuesSection from "@/components/dashboard/NearbyIssuesSection";
import QuickReportSection from "@/components/dashboard/QuickReportSection";
import RecentReportsSection from "@/components/dashboard/RecentReportsSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    stats,
    dailyTasks,
    reportCategories,
    recentReports,
    nearbyIssues,
    userPosition,
    weatherInfo,
    isLoading,
    mapMarkers,
    handleQuickReport,
    handleViewReport,
    setIsLoading
  } = useDashboardData();

  const handleQuickReportClick = async (categoryName: string) => {
    await handleQuickReport(categoryName);
    navigate('/report/new', { state: { category: categoryName } });
  };

  // Update the marker click handler to match the expected type
  const handleMapMarkerClick = (marker: any) => {
    // Extract the ID from the marker and pass it to handleViewReport
    handleViewReport(Number(marker.id))
      .then(() => {
        navigate(`/report/${marker.id}`);
      });
  };

  // Keep the handleViewReportClick function for other components
  const handleViewReportClick = async (reportId: number) => {
    await handleViewReport(reportId);
    navigate(`/report/${reportId}`);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <DashboardHeader 
          isLoading={isLoading} 
          weatherInfo={weatherInfo} 
        />

        <StatisticsSection stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <MapSection 
            mapMarkers={mapMarkers} 
            userPosition={userPosition} 
            onMarkerClick={handleMapMarkerClick} 
          />
          
          <TasksSection initialTasks={dailyTasks} />
        </div>

        <NearbyIssuesSection 
          issues={nearbyIssues} 
          onViewDetails={handleViewReportClick} 
          isLoading={isLoading} 
        />

        <QuickReportSection 
          categories={reportCategories} 
          onCategorySelect={handleQuickReportClick} 
          isLoading={isLoading} 
        />

        <RecentReportsSection 
          reports={recentReports} 
          onViewDetails={handleViewReportClick} 
          isLoading={isLoading} 
        />
      </div>
      <LocationTracker />
    </Layout>
  );
};

export default Dashboard;
