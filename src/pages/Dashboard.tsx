
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import Layout from "@/components/Layout";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  // Use our dashboard data hook
  const { 
    stats, 
    dashboardStats, 
    recentReports, 
    categories,
    loading, 
    error,
    nearbyReports = []
  } = useDashboardData();

  return (
    <Layout>
      <DashboardContainer 
        stats={stats || []} 
        dashboardStats={dashboardStats || { totalReports: 0, resolvedReports: 0, pendingReports: 0, inProgressReports: 0 }}
        tasksData={[]} // We're passing an empty array but the component doesn't use it anymore
        recentReportsData={recentReports || []}
        nearbyReports={nearbyReports || []}
        categoriesData={{ categories: categories || [] }}
        isLoading={loading}
      />
    </Layout>
  );
};

export default Dashboard;
