
import { StatItem, Task, Category } from "@/types/dashboard";
import { getFilteredReports } from "@/services/reportService";

// Dados estatísticos calculados dinamicamente
export const getStats = (): StatItem[] => {
  const allReports = getFilteredReports("all");
  const resolvedReports = getFilteredReports("resolved");
  const inProgressReports = getFilteredReports("in_progress");
  
  // Calcular relatórios das últimas 24 horas
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const recentReports = allReports.filter(
    report => new Date(report.createdAt) > oneDayAgo
  ).length;
  
  return [
    { 
      label: "Ocorrências Total", 
      value: allReports.length, 
      trend: "up", 
      percent: allReports.length > 0 ? 100 : 0 
    },
    { 
      label: "Resolvidas", 
      value: resolvedReports.length, 
      trend: "up", 
      percent: allReports.length > 0 ? Math.round((resolvedReports.length / allReports.length) * 100) : 0 
    },
    { 
      label: "Em andamento", 
      value: inProgressReports.length, 
      trend: "up", 
      percent: allReports.length > 0 ? Math.round((inProgressReports.length / allReports.length) * 100) : 0 
    },
    { 
      label: "Últimas 24h", 
      value: recentReports, 
      trend: "up", 
      percent: allReports.length > 0 ? Math.round((recentReports / allReports.length) * 100) : 0 
    },
  ];
};

// Mock de tarefas diárias (ainda fictício, mas poderia ser dinâmico em uma versão real)
export const mockDailyTasks: Task[] = [
  { id: 1, title: "Inspecionar ocorrências pendentes", completed: false, time: "09:00" },
  { id: 2, title: "Verificar novas reclamações", completed: false, time: "11:30" },
  { id: 3, title: "Atualizar status de ocorrências", completed: false, time: "14:00" },
  { id: 4, title: "Enviado relatório diário", completed: false, time: "17:00" },
];

// Categorias de ocorrências 
export const mockReportCategories: Category[] = [
  { id: 1, name: "Buraco na via", icon: "🚧" },
  { id: 2, name: "Poda de árvore", icon: "🌳" },
  { id: 3, name: "Lâmpada queimada", icon: "💡" },
  { id: 4, name: "Lixo/Entulho", icon: "🗑️" },
  { id: 5, name: "Esgoto/Vazamento", icon: "💧" },
  { id: 6, name: "Sinalização", icon: "🚦" },
];

// Obter ocorrências recentes baseadas nos dados reais
export const getRecentReports = () => {
  const allReports = getFilteredReports("all");
  // Ordenar por data, começando com os mais recentes
  return [...allReports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5); // Pegar apenas os 5 mais recentes
};
