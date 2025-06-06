
export interface StatItem {
  label: string;
  value: number;
  trend: "up" | "down" | "neutral";
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

export interface Resolution {
  description: string;
  date: string;
  responsible: string;
}

export interface Report {
  id: number;
  type: string;
  description: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  status: string;
  createdAt: string;
  agent?: {
    id: string;
    name: string;
    gabineteId: string;
  };
  complainant?: {
    fullName: string;
    phone: string;
    whatsapp?: string;
    address: string;
  };
  photos?: string[]; // Adicionando campo para fotos
  updatedAt?: string; // Adding updatedAt field
  resolution?: Resolution; // Adicionando interface de resolução
}

// Adding missing interface to fix build errors
export interface DashboardStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
}

// Adding WeatherInfo interface to fix build errors
export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  city: string;
}
