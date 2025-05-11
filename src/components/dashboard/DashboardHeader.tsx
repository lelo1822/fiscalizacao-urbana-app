
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Camera, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  isLoading: boolean;
  weatherInfo: {
    temp: number;
    condition: string;
    icon: string;
  } | null;
}

const DashboardHeader = ({ isLoading, weatherInfo }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [todayDate, setTodayDate] = useState("");

  // Formatar data atual
  useEffect(() => {
    const today = new Date();
    setTodayDate(
      format(today, "EEEE, d 'de' MMMM", { locale: ptBR })
    );
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Olá, {user?.name}
        </h1>
        <p className="text-gray-500">
          {todayDate} • {weatherInfo?.temp}°C {weatherInfo?.icon} {weatherInfo?.condition}
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex gap-2">
        <Button 
          onClick={() => navigate('/report/new')}
          className="bg-success hover:bg-success/90"
          disabled={isLoading}
        >
          <Camera className="mr-2 h-4 w-4" />
          Nova Ocorrência
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/map')}
          className="border-primary text-primary hover:bg-primary/10"
          disabled={isLoading}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Ver Mapa
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
