
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import MapSection from './MapSection';
import StatisticsSection from './StatisticsSection';
import RecentReportsSection from './RecentReportsSection';
import TasksSection from './TasksSection';
import CategoriesSection from '@/components/dashboard/CategoriesSection';
import { useAuth } from '@/context/AuthContext';
import { DashboardStats, Report, StatItem, Task, Category, WeatherInfo } from '@/types/dashboard';
import { useWeather } from '@/hooks/useWeather';
import { MapMarker } from '@/types/map';
import { toast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: 1,
    type: 'Buraco na via',
    description: 'Buraco grande na avenida principal',
    address: 'Av. Brasil, 1500',
    status: 'Pendente',
    createdAt: '2023-06-15T10:30:00',
    photos: ['/images/pothole.jpg'],
    coordinates: { lat: -23.55152, lng: -46.633408 }
  },
  {
    id: 2,
    type: 'Lâmpada queimada',
    description: 'Poste com lâmpada queimada há 3 dias',
    address: 'Rua das Flores, 123',
    status: 'Em andamento',
    createdAt: '2023-06-14T08:15:00',
    photos: ['/images/streetlight.jpg'],
    coordinates: { lat: -23.54550, lng: -46.638100 }
  },
  {
    id: 3,
    type: 'Lixo/Entulho',
    description: 'Acúmulo de lixo na calçada',
    address: 'Rua dos Pinheiros, 456',
    status: 'Resolvido',
    createdAt: '2023-06-10T14:45:00',
    updatedAt: '2023-06-12T09:20:00',
    photos: ['/images/trash.jpg'],
    coordinates: { lat: -23.56052, lng: -46.629708 }
  }
];

const mockStats: DashboardStats = {
  totalReports: 48,
  pendingReports: 15,
  inProgressReports: 10,
  resolvedReports: 23
};

const mockStatItems: StatItem[] = [
  { label: 'Novas ocorrências', value: 12, trend: 'up', percent: 8 },
  { label: 'Resolvidas', value: 23, trend: 'up', percent: 12 },
  { label: 'Tempo médio', value: 36, trend: 'down', percent: 5 }
];

const mockTasks: Task[] = [
  { id: 1, title: 'Verificar ocorrência #1234', completed: false, time: '10:00' },
  { id: 2, title: 'Atualizar status da ocorrência #1230', completed: true, time: '11:30' },
  { id: 3, title: 'Responder ao cidadão sobre #1228', completed: false, time: '14:00' },
  { id: 4, title: 'Reunião com equipe de manutenção', completed: false, time: '15:30' }
];

const mockCategories: Category[] = [
  { id: 1, name: 'Buraco na via', icon: '🚧' },
  { id: 2, name: 'Lâmpada queimada', icon: '💡' },
  { id: 3, name: 'Lixo/Entulho', icon: '🗑️' },
  { id: 4, name: 'Poda de árvore', icon: '🌳' }
];

// Convert reports to map markers
const reportsToMapMarkers = (reports: Report[]): MapMarker[] => {
  return reports
    .filter(report => report.coordinates) // Only include reports with coordinates
    .map(report => ({
      id: report.id,
      position: [report.coordinates!.lat, report.coordinates!.lng] as [number, number],
      title: report.type,
      status: report.status === 'Pendente' ? 'pending' : 
              report.status === 'Em andamento' ? 'in_progress' : 'resolved',
      type: report.type,
      iconType: 'circle'
    }));
};

const DashboardContainer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [statItems, setStatItems] = useState<StatItem[]>(mockStatItems);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isLoading, setIsLoading] = useState(false);
  const weatherInfo = useWeather();
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>([-23.55052, -46.633308]);

  // Initialize map markers
  useEffect(() => {
    if (reports && reports.length > 0) {
      setMapMarkers(reportsToMapMarkers(reports));
    }
  }, [reports]);

  const handleCategoryClick = (categoryName: string) => {
    navigate('/report/new', { state: { category: categoryName } });
  };

  const handleTaskToggle = (taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleViewReportDetails = (reportId: number) => {
    navigate(`/report/${reportId}`);
  };

  const handleMarkerClick = (marker: MapMarker) => {
    // Since description is not in MapMarker, we'll just show the title
    toast({
      title: marker.title || "Ocorrência",
      description: `Tipo: ${marker.type || "Não especificado"}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader 
        isLoading={isLoading} 
        weatherInfo={{
          temp: weatherInfo?.temperature || 0,
          condition: weatherInfo?.condition || "",
          icon: weatherInfo?.icon || ""
        }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <MapSection 
            mapMarkers={mapMarkers}
            userPosition={userPosition}
            onMarkerClick={handleMarkerClick}
          />
          <StatisticsSection stats={statItems} />
          <RecentReportsSection 
            reports={reports} 
            onViewDetails={handleViewReportDetails}
            isLoading={isLoading}
          />
        </div>
        
        <div className="space-y-6">
          <TasksSection 
            taskList={tasks} 
            onTaskToggle={handleTaskToggle} 
          />
          <CategoriesSection 
            categories={categories} 
            onCategoryClick={handleCategoryClick} 
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
