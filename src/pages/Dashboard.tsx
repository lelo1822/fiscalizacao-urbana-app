
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import Layout from "@/components/Layout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMapMarkers } from "@/hooks/useMapMarkers";
import { useUserLocation } from "@/hooks/useUserLocation";

const Dashboard = () => {
  // Use our dashboard data hook
  const { 
    stats, 
    dashboardStats, 
    tasks, 
    recentReports, 
    categories,
    weatherData, 
    loading, 
    error,
    nearbyReports = []
  } = useDashboardData();

  // Get user location
  const { userPosition } = useUserLocation();
  
  // Get map markers from reports with proper error handling
  const { markers } = useMapMarkers();

  return (
    <Layout>
      <DashboardContainer 
        stats={stats || []} 
        dashboardStats={dashboardStats || { totalReports: 0, resolvedReports: 0, pendingReports: 0, inProgressReports: 0 }}
        tasks={tasks || []}
        reports={recentReports || []}
        nearbyReports={nearbyReports || []}
        categories={categories || []}
        isLoading={loading}
        error={error}
        weatherInfo={weatherData}
        mapMarkers={markers || []}
        userPosition={userPosition}
      />
    </Layout>
  );
};

export default Dashboard;
