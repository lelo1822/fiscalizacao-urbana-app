
import { useState } from "react";
import { Report, StatItem, Task, Category, WeatherInfo } from "@/types/dashboard";
import { mockStats, mockDailyTasks, mockReportCategories, mockRecentReports } from "@/data/dashboardMockData";
import { useWeather } from "./useWeather";
import { useUserLocation } from "./useUserLocation";
import { reportToMapMarkers, simulateLoading } from "@/utils/dashboard-utils";
import type { MapMarker } from "@/types/map";

export type { Report, Task, Category, StatItem, WeatherInfo };

// Hook to handle all dashboard data
export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const weatherInfo = useWeather();
  const { userPosition, nearbyIssues } = useUserLocation(mockRecentReports);
  
  // Function to handle quick report
  const handleQuickReport = async (categoryName: string) => {
    setIsLoading(true);
    await simulateLoading();
    setIsLoading(false);
    return;
  };

  // Function to view report details with feedback
  const handleViewReport = async (reportId: number) => {
    setIsLoading(true);
    await simulateLoading(200);
    setIsLoading(false);
    return;
  };

  // Prepare map markers
  const mapMarkers = reportToMapMarkers(mockRecentReports);

  return {
    stats: mockStats,
    dailyTasks: mockDailyTasks,
    reportCategories: mockReportCategories,
    recentReports: mockRecentReports,
    nearbyIssues,
    userPosition,
    weatherInfo,
    isLoading,
    mapMarkers,
    handleQuickReport,
    handleViewReport,
    setIsLoading,
  };
};
