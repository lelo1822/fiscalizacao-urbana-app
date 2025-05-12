
import { Report, Task, Category, StatItem } from "@/types/dashboard";

// Mock data for statistics
export const mockStats: StatItem[] = [
  { label: "Ocorrências Total", value: 128, trend: "up", percent: 12 },
  { label: "Resolvidas", value: 87, trend: "up", percent: 8 },
  { label: "Em andamento", value: 41, trend: "down", percent: 5 },
  { label: "Últimas 24h", value: 12, trend: "up", percent: 50 },
];

// Mock data for daily tasks
export const mockDailyTasks: Task[] = [
  { id: 1, title: "Inspecionar obras na Av. Brasil", completed: false, time: "09:00" },
  { id: 2, title: "Verificar reclamações de ruído", completed: true, time: "11:30" },
  { id: 3, title: "Reunião com secretaria", completed: false, time: "14:00" },
  { id: 4, title: "Enviar relatório diário", completed: false, time: "17:00" },
];

// Mock data for report categories
export const mockReportCategories: Category[] = [
  { id: 1, name: "Buraco na via", icon: "🚧" },
  { id: 2, name: "Poda de árvore", icon: "🌳" },
  { id: 3, name: "Lâmpada queimada", icon: "💡" },
  { id: 4, name: "Lixo/Entulho", icon: "🗑️" },
  { id: 5, name: "Esgoto/Vazamento", icon: "💧" },
  { id: 6, name: "Sinalização", icon: "🚦" },
];

// Mock data for recent reports
export const mockRecentReports: Report[] = [
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
