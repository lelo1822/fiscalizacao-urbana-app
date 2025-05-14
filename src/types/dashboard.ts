
import { Complainant } from './complainant';

export interface Report {
  id: number;
  type: string;
  description: string;
  address: string;
  coordinates?: { lat: number, lng: number };
  status: 'Pendente' | 'Em andamento' | 'Resolvido';
  createdAt: string;
  updatedAt?: string;
  photos?: string[];
  agent?: {
    id: string;
    name: string;
    gabineteId: string;
  };
  complainant?: Complainant;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  resolvedReports: number;
}

export interface DailyTask {
  id: number;
  description: string;
  completed: boolean;
}

export interface StatItem {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  percent: number;
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

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  location?: string;
}
