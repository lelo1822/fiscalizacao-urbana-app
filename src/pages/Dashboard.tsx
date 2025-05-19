
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import Layout from "@/components/Layout";
import LocationTracker from "@/components/LocationTracker";

const Dashboard = () => {
  return (
    <Layout>
      <DashboardContainer />
      <LocationTracker />
    </Layout>
  );
};

export default Dashboard;
