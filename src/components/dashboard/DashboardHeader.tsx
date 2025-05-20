
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import BaseHeader from "@/components/shared/BaseHeader";

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
  const isMobile = useIsMobile();

  // Format current date
  useEffect(() => {
    const today = new Date();
    const dateFormat = isMobile ? "EEEE, d MMM" : "EEEE, d 'de' MMMM";
    setTodayDate(
      format(today, dateFormat, { locale: ptBR })
    );
  }, [isMobile]);

  const weatherDescription = weatherInfo ? (
    <>
      {todayDate} • {weatherInfo?.temp && `${weatherInfo.temp}°C`} {weatherInfo?.icon} {weatherInfo?.condition}
    </>
  ) : todayDate;

  const headerActions = (
    <Button 
      onClick={() => navigate('/report/new')}
      className="bg-success hover:bg-success/90 w-full sm:w-auto"
      disabled={isLoading}
    >
      <Camera className="mr-2 h-4 w-4" />
      Nova Ocorrência
    </Button>
  );

  return (
    <BaseHeader
      title={`Olá, ${user?.name?.split(' ')[0] || 'Agente'}`}
      description={weatherDescription}
      actions={headerActions}
    />
  );
};

export default DashboardHeader;
