
// Dashboard data types
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

export interface MapMarker {
  id: number | string;
  position: [number, number];
  title: string;
  type: string;
  status: "pending" | "in_progress" | "resolved";
  priority: "high" | "medium" | "low";
}
