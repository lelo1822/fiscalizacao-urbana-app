
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStats, mockDailyTasks, getRecentReports, mockReportCategories } from "@/data/dashboardMockData";
import { Report, WeatherInfo, Task, Category, StatItem } from "@/types/dashboard";
import useWeather from "./useWeather";

export const useDashboardData = () => {
  const { user } = useAuth();
  const { weatherData, loading: weatherLoading } = useWeather();
  
  const [stats, setStats] = useState<StatItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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

        // Get tasks data (just using mock data for now)
        setTasks(mockDailyTasks);

        // Get recent reports
        const recentReportsData = getRecentReports();
        setRecentReports(recentReportsData);

        // Get categories
        setCategories(mockReportCategories);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    greeting,
    user,
    stats,
    tasks,
    recentReports,
    categories,
    weatherData,
    loading: loading || weatherLoading,
  };
};

export default useDashboardData;
