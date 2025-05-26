
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getStats, mockDailyTasks, mockReportCategories } from "@/data/dashboardMockData";
import { Report, WeatherInfo, Task, Category, StatItem, DashboardStats } from "@/types/dashboard";
import { SupabaseReportService } from "@/services/supabaseReportService";
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
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Buscar relatórios do Supabase
        const allReports = await SupabaseReportService.getAllReports();
        
        // Filtrar relatórios por gabinete se o usuário não for admin
        const userReports = user?.gabineteId && user.role !== 'admin'
          ? allReports.filter(report => report.agent?.gabineteId === user.gabineteId)
          : allReports;

        setRecentReports(userReports);
        setNearbyReports(userReports.slice(0, 3));

        // Calcular estatísticas baseadas nos dados reais
        const totalReports = userReports.length;
        const resolvedReports = userReports.filter(r => r.status === 'Resolvido').length;
        const pendingReports = userReports.filter(r => r.status === 'Pendente').length;
        const inProgressReports = userReports.filter(r => r.status === 'Em andamento').length;
        
        setDashboardStats({
          totalReports,
          resolvedReports,
          pendingReports,
          inProgressReports
        });

        // Atualizar stats com dados reais
        const statsData = [
          {
            label: "Total de Relatórios",
            value: totalReports,
            trend: "up" as const,
            percent: 12
          },
          {
            label: "Resolvidos",
            value: resolvedReports,
            trend: "up" as const,
            percent: 8
          },
          {
            label: "Pendentes",
            value: pendingReports,
            trend: "neutral" as const,
            percent: 0
          },
          {
            label: "Em Andamento",
            value: inProgressReports,
            trend: "up" as const,
            percent: 5
          }
        ];
        
        setStats(statsData);

        // Manter dados mock para outras funcionalidades
        setTasks(mockDailyTasks || []);
        setCategories(mockReportCategories || []);
        
        setLoading(false);
      } catch (e) {
        console.error("Erro ao carregar dados do dashboard:", e);
        setError("Ocorreu um erro ao carregar os dados do dashboard");
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

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
