import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { useDashboardData } from "@/hooks/useDashboardData";

// Import refactored components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatisticsSection from "@/components/dashboard/StatisticsSection";
import TasksSection from "@/components/dashboard/TasksSection";
import QuickReportSection from "@/components/dashboard/QuickReportSection";
import RecentReportsSection from "@/components/dashboard/RecentReportsSection";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardContainer = () => {
  const navigate = useNavigate();
  const {
    stats,
    dailyTasks,
    reportCategories,
    recentReports,
    weatherInfo,
    isLoading,
    handleQuickReport,
    handleViewReport,
    setIsLoading
  } = useDashboardData();

  const handleQuickReportClick = async (categoryName: string) => {
    await handleQuickReport(categoryName);
    navigate('/report/new', { state: { category: categoryName } });
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
          {/* Substituindo o MapSection por um card de acesso rápido aos relatórios */}
          <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle>Gerenciamento de Ocorrências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center space-y-4">
                <p className="text-muted-foreground">
                  Acesse a lista completa de ocorrências do seu gabinete e exporte relatórios em Excel
                </p>
                <div className="flex justify-center mt-4">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/reports')}
                    className="gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    Ver Todas as Ocorrências
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <TasksSection initialTasks={dailyTasks} />
        </div>

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
    </Layout>
  );
};

export default DashboardContainer;
