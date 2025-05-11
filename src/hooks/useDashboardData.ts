
import { useState, useEffect } from "react";

// Tipos de dados
export interface Report {
  id: number;
  type: string;
  address: string;
  date: string;
  status: string;
  priority: string;
  position: [number, number];
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  time: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface StatItem {
  label: string;
  value: number;
  trend: "up" | "down";
  percent: number;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  icon: string;
}

// Hook para lidar com todos os dados do dashboard
export const useDashboardData = () => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [nearbyIssues, setNearbyIssues] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);

  // Mock data para estatísticas
  const stats: StatItem[] = [
    { label: "Ocorrências Total", value: 128, trend: "up", percent: 12 },
    { label: "Resolvidas", value: 87, trend: "up", percent: 8 },
    { label: "Em andamento", value: 41, trend: "down", percent: 5 },
    { label: "Últimas 24h", value: 12, trend: "up", percent: 50 },
  ];

  // Mock data para tarefas diárias
  const dailyTasks: Task[] = [
    { id: 1, title: "Inspecionar obras na Av. Brasil", completed: false, time: "09:00" },
    { id: 2, title: "Verificar reclamações de ruído", completed: true, time: "11:30" },
    { id: 3, title: "Reunião com secretaria", completed: false, time: "14:00" },
    { id: 4, title: "Enviar relatório diário", completed: false, time: "17:00" },
  ];

  // Mock data para categorias de relatório rápido
  const reportCategories: Category[] = [
    { id: 1, name: "Buraco na via", icon: "🚧" },
    { id: 2, name: "Poda de árvore", icon: "🌳" },
    { id: 3, name: "Lâmpada queimada", icon: "💡" },
    { id: 4, name: "Lixo/Entulho", icon: "🗑️" },
    { id: 5, name: "Esgoto/Vazamento", icon: "💧" },
    { id: 6, name: "Sinalização", icon: "🚦" },
  ];

  // Mock data para relatórios recentes
  const recentReports: Report[] = [
    { 
      id: 1, 
      type: "Buraco na via", 
      address: "Rua das Flores, 123", 
      date: "2023-05-08", 
      status: "Pendente",
      priority: "high",
      position: [-23.55152, -46.633408] as [number, number],
    },
    { 
      id: 2, 
      type: "Árvore caída", 
      address: "Av. Principal, 456", 
      date: "2023-05-07", 
      status: "Em análise",
      priority: "medium",
      position: [-23.54550, -46.638100] as [number, number],
    },
    { 
      id: 3, 
      type: "Lâmpada queimada", 
      address: "Praça Central", 
      date: "2023-05-06", 
      status: "Resolvido",
      priority: "low",
      position: [-23.56052, -46.629708] as [number, number],
    },
    { 
      id: 4, 
      type: "Lixo acumulado", 
      address: "Rua Lateral, 789", 
      date: "2023-05-05", 
      status: "Resolvido",
      priority: "medium",
      position: [-23.55552, -46.641308] as [number, number],
    },
  ];
  
  // Efeito para obter posição do usuário e carregar dados
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          
          // Mock: Encontrar ocorrências próximas (simulação)
          const mockNearby = recentReports
            .filter(issue => Math.random() > 0.5) // Simulando distância
            .slice(0, 2);
          setNearbyIssues(mockNearby);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
    
    // Mock do clima (numa aplicação real, usaríamos uma API)
    setWeatherInfo({
      temp: 24,
      condition: "Parcialmente nublado",
      icon: "⛅"
    });
  }, []);

  // Função para lidar com novo relatório rápido
  const handleQuickReport = (categoryName: string) => {
    setIsLoading(true);
    
    // Simular carregamento para melhor experiência do usuário
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, 300);
    });
  };

  // Função para ver detalhes da ocorrência com feedback
  const handleViewReport = (reportId: number) => {
    setIsLoading(true);
    
    // Simular carregamento para melhor experiência do usuário
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, 200);
    });
  };

  // Preparar marcadores para o mapa com IDs que podem ser string ou number
  const mapMarkers = recentReports.map(report => ({
    id: report.id,
    position: report.position,
    title: report.address,
    type: report.type,
    status: report.status === "Pendente" ? "pending" : 
           report.status === "Em análise" ? "in_progress" : "resolved" as any,
    priority: report.priority as any
  }));

  return {
    stats,
    dailyTasks,
    reportCategories,
    recentReports,
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
