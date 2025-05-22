
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import Layout from "@/components/Layout";
import LocationTracker from "@/components/LocationTracker";
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
  const { location } = useUserLocation();
  
  // Get map markers from reports with proper error handling
  const { markers } = useMapMarkers(recentReports || []);

  // Convert location to the format expected by DashboardContainer
  const userPosition = location ? [location.latitude, location.longitude] as [number, number] : null;

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
      <LocationTracker />
    </Layout>
  );
};

export default Dashboard;
