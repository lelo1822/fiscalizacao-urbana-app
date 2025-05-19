
import React, { useState, useEffect } from "react";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useAuth } from "@/context/AuthContext";
import TrackingStatus from "@/components/location/TrackingStatus";
import TrackingControls from "@/components/location/TrackingControls";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';

const LocationTracker: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string | null>(null);
  
  const {
    tracking,
    toggleTracking,
    lastUpdate,
    error,
    permissionDenied,
    isSecureContext,
    locationHistory
  } = useLocationTracking({ userId: user?.id });
  
  // Atualizar o tempo desde a última atualização
  useEffect(() => {
    if (!lastUpdate) {
      setTimeSinceUpdate(null);
      return;
    }
    
    const updateTimeSince = () => {
      try {
        const formattedTime = formatDistanceToNow(new Date(lastUpdate), {
          addSuffix: true,
          locale: ptBR
        });
        setTimeSinceUpdate(formattedTime);
      } catch (err) {
        console.error("Erro ao formatar tempo:", err);
        setTimeSinceUpdate("recentemente");
      }
    };
    
    updateTimeSince();
    const interval = setInterval(updateTimeSince, 30000); // Atualizar a cada 30 segundos
    
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            className={`rounded-full w-12 h-12 shadow-lg p-0 ${
              tracking 
                ? 'bg-green-600 hover:bg-green-700' 
                : permissionDenied 
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-gray-500 hover:bg-gray-600'
            }`}
            size="lg"
            aria-label="Rastreamento de localização"
          >
            <MapPin className="h-5 w-5 text-white" />
            {tracking && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-400 animate-ping"></span>
            )}
            {permissionDenied && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-amber-400"></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="top">
          <div className="font-medium text-base mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <span>Rastreamento de localização</span>
            </div>
            
            {tracking && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-normal">
                Ativo
              </span>
            )}
            
            {!tracking && !permissionDenied && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-normal">
                Inativo
              </span>
            )}
            
            {permissionDenied && (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-normal">
                Bloqueado
              </span>
            )}
          </div>
          
          <TrackingStatus
            tracking={tracking}
            error={error}
            lastUpdate={lastUpdate}
            permissionDenied={permissionDenied}
            isSecureContext={isSecureContext}
          />
          
          {lastUpdate && timeSinceUpdate && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Última atualização: {timeSinceUpdate}</span>
            </div>
          )}
          
          {tracking && locationHistory.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {locationHistory.length} pontos registrados hoje
              </p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{width: `${Math.min(100, (locationHistory.length / 100) * 100)}%`}}
                ></div>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <TrackingControls
              tracking={tracking}
              toggleTracking={() => {
                toggleTracking();
                // Se estamos ativando o rastreamento, fechamos o popover após um curto atraso
                if (!tracking) {
                  setTimeout(() => setOpen(false), 500);
                }
              }}
              permissionDenied={permissionDenied}
            />
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            {tracking ? (
              <p>O rastreamento continuará funcionando em segundo plano para registrar sua rota de trabalho.</p>
            ) : (
              <p>Ative o rastreamento para registrar automaticamente sua rota durante o trabalho de campo.</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationTracker;
