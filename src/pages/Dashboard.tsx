
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import Layout from "@/components/Layout";
import LocationTracker from "@/components/LocationTracker";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  // Use our dashboard data hook
  const dashboardData = useDashboardData();

  return (
    <Layout>
      <DashboardContainer dashboardData={dashboardData} />
      <LocationTracker />
    </Layout>
  );
};

export default Dashboard;
