
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStats, mockDailyTasks, getRecentReports, mockReportCategories } from "@/data/dashboardMockData";
import { Report, WeatherInfo, Task, Category, StatItem, DashboardStats } from "@/types/dashboard";
import useWeather from "./useWeather";

export const useDashboardData = () => {
  const { user } = useAuth();
  const { weatherData, loading: weatherLoading } = useWeather();
  
  const [stats, setStats] = useState<StatItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [nearbyReports, setNearbyReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    inProgressReports: 0
  });

  // Get current date for the greeting
  const date = new Date();
  const hours = date.getHours();

  // Set greeting based on time of day
  let greeting = "Bom dia";
  if (hours >= 12 && hours < 18) {
    greeting = "Boa tarde";
  } else if (hours >= 18 || hours < 6) {
    greeting = "Boa noite";
  }

  useEffect(() => {
    // Simulate fetching data from API
    const fetchDashboardData = () => {
      try {
        // Get stats data
        const statsData = getStats();
        setStats(statsData);

        // Get tasks data
        setTasks(mockDailyTasks || []);

        // Get recent reports
        const recentReportsData = getRecentReports();
        setRecentReports(recentReportsData || []);
        
        // Get nearby reports (using a subset of recent reports for now)
        setNearbyReports(recentReportsData?.slice(0, 3) || []);

        // Get categories
        setCategories(mockReportCategories || []);
        
        // Calculate dashboard stats
        const totalReports = recentReportsData?.length || 0;
        const resolvedReports = recentReportsData?.filter(r => r.status === 'Resolvido').length || 0;
        const pendingReports = recentReportsData?.filter(r => r.status === 'Pendente').length || 0;
        const inProgressReports = recentReportsData?.filter(r => r.status === 'Em andamento').length || 0;
        
        setDashboardStats({
          totalReports,
          resolvedReports,
          pendingReports,
          inProgressReports
        });

        setLoading(false);
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
        setError("Ocorreu um erro ao carregar os dados do dashboard");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    greeting,
    user,
    stats,
    dashboardStats,
    tasks,
    recentReports,
    nearbyReports,
    categories,
    weatherData,
    loading: loading || weatherLoading,
    error,
  };
};

export default useDashboardData;
