
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Battery, BatteryLow, BatteryMedium, BatteryFull } from "lucide-react";

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number | null;
}

const LocationTracker = () => {
  const { user } = useAuth();
  const [tracking, setTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState<boolean>(false);

  // Start tracking when component mounts
  useEffect(() => {
    startTracking();
    // Monitor battery if available
    if ('getBattery' in navigator) {
      const getBatteryInfo = async () => {
        try {
          // @ts-ignore - getBattery is not in the standard navigator type
          const battery = await navigator.getBattery();
          
          // Update battery info initially
          setBatteryLevel(battery.level * 100);
          setBatteryCharging(battery.charging);
          
          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(battery.level * 100);
          });
          battery.addEventListener('chargingchange', () => {
            setBatteryCharging(battery.charging);
          });
        } catch (err) {
          console.log('Battery API not supported');
        }
      };
      getBatteryInfo();
    }
    
    return () => {
      // Clean up by stopping tracking when component unmounts
      stopTracking();
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador");
      toast.error("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    try {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newPoint: LocationPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy,
            speed: position.coords.speed,
          };
          
          setLocationHistory((prevHistory) => [...prevHistory, newPoint]);
          setLastUpdate(new Date());
          
          // Save to localStorage (in a real app, you'd send this to a server)
          const storageKey = `locationHistory_${user?.id}`;
          const storedHistory = JSON.parse(localStorage.getItem(storageKey) || "[]");
          localStorage.setItem(storageKey, JSON.stringify([...storedHistory, newPoint]));
          
          setError(null);
          setTracking(true);
        },
        (err) => {
          console.error("Erro de geolocalização:", err);
          setError(`Erro de geolocalização: ${err.message}`);
          toast.error(`Erro de geolocalização: ${err.message}`);
          setTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
      
      setWatchId(id);
    } catch (err) {
      console.error("Erro ao iniciar rastreamento:", err);
      setError("Erro ao iniciar rastreamento");
      toast.error("Erro ao iniciar rastreamento");
    }
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

  const getBatteryIcon = () => {
    if (batteryLevel === null) return <Battery className="h-4 w-4 text-muted-foreground" />;
    
    if (batteryLevel <= 20) {
      return <BatteryLow className="h-4 w-4 text-destructive" />;
    } else if (batteryLevel <= 60) {
      return <BatteryMedium className="h-4 w-4 text-warning" />;
    } else {
      return <BatteryFull className="h-4 w-4 text-success" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed bottom-4 right-4 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background shadow-md border">
              <div className="flex items-center gap-1.5">
                <div className={`h-3 w-3 rounded-full ${tracking ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
                <span className="text-xs font-medium">
                  {tracking ? 'Localização ativa' : 'Sem localização'}
                </span>
              </div>
              
              {batteryLevel !== null && (
                <div className="flex items-center gap-1 border-l pl-2 ml-1">
                  {getBatteryIcon()}
                  <span className="text-xs">{Math.round(batteryLevel)}%</span>
                  {batteryCharging && <span className="text-xs text-success">⚡</span>}
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px]">
          <p>{tracking ? 'Sua localização está sendo rastreada' : 'Não foi possível rastrear sua localização'}</p>
          {lastUpdate && tracking && (
            <p className="text-xs text-muted-foreground mt-1">
              Última atualização: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
          {tracking && locationHistory.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Pontos registrados: {locationHistory.length}
            </p>
          )}
          {error && !tracking && <p className="text-xs text-destructive">{error}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LocationTracker;
