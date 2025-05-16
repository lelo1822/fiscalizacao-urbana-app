
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
}
