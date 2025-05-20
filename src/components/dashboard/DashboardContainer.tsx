import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import StatisticsSection from './StatisticsSection';
import RecentReportsSection from './RecentReportsSection';
import TasksSection from './TasksSection';
import CategoriesSection from './CategoriesSection';
import StatisticsCharts from './StatisticsCharts';
import ReportsErrorState from '@/components/reports/ReportsErrorState';
import { useIsMobile } from '@/hooks/use-mobile';
import { Report, Task, Category } from '@/types/dashboard';

interface DashboardContainerProps {
  dashboardData: {
    stats: any[];
    tasks: Task[];
    recentReports: Report[];
    categories: Category[];
    weatherData: any;
    loading: boolean;
    error?: string | null;
  }
}

const DashboardContainer = ({ dashboardData }: DashboardContainerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [error, setError] = useState<string | null>(dashboardData.error || null);
  
  const handleCategoryClick = (categoryName: string) => {
    navigate('/report/new', { state: { category: categoryName } });
  };

  const handleTaskToggle = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleViewReportDetails = (reportId: number) => {
    navigate(`/report/${reportId}`);
  };
  
  const handleRetry = () => {
    setError(null);
    // Simular recarga de dados
    setTimeout(() => {
      setError(null);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <DashboardHeader 
        isLoading={dashboardData.loading} 
        weatherInfo={{
          temp: dashboardData.weatherData?.temperature || 0,
          condition: dashboardData.weatherData?.condition || "",
          icon: dashboardData.weatherData?.icon || ""
        }}
      />
      
      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Statistics Cards */}
        <StatisticsSection stats={dashboardData.stats} />
        
        {/* Charts */}
        <StatisticsCharts className={`mt-2 ${isMobile ? 'overflow-x-auto' : ''}`} />
        
        {/* Main content grid */}
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'lg:grid-cols-3'} gap-6`}>
          <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-6`}>
            {error ? (
              <ReportsErrorState 
                message={error} 
                onRetry={handleRetry}
              />
            ) : (
              <RecentReportsSection 
                reports={dashboardData.recentReports} 
                onViewDetails={handleViewReportDetails}
                isLoading={dashboardData.loading}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <TasksSection 
              taskList={dashboardData.tasks} 
              onTaskToggle={handleTaskToggle} 
            />
            <CategoriesSection 
              categories={dashboardData.categories} 
              onCategoryClick={handleCategoryClick} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
