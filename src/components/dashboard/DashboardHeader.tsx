
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
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

  // Format current date
  useEffect(() => {
    const today = new Date();
    setTodayDate(
      format(today, "EEEE, d 'de' MMMM", { locale: ptBR })
    );
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Olá, {user?.name?.split(' ')[0] || 'Agente'}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          {todayDate} • {weatherInfo?.temp && `${weatherInfo.temp}°C`} {weatherInfo?.icon} {weatherInfo?.condition}
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <Button 
          onClick={() => navigate('/report/new')}
          className="bg-success hover:bg-success/90 w-full sm:w-auto"
          disabled={isLoading}
        >
          <Camera className="mr-2 h-4 w-4" />
          Nova Ocorrência
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
