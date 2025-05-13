
import { useEffect, useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Battery, BatteryLow, BatteryMedium, BatteryFull } from "lucide-react";
import { checkLocationPermission, handleLocationError, createPermissionDeniedError } from "@/utils/location-utils";

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
  const watchIdRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const isInitialized = useRef(false);

  // Monitor if secure context is available
  const [isSecureContext, setIsSecureContext] = useState<boolean>(
    typeof window !== 'undefined' && window.isSecureContext
  );

  // Start tracking when component mounts
  useEffect(() => {
    // Prevent duplicate initialization
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    console.log("LocationTracker mounted, secure context:", isSecureContext);
    
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

    // Check if we're in a secure context - geolocation often requires HTTPS
    if (!isSecureContext) {
      console.warn("Not running in secure context, geolocation may be blocked");
      setError("Localização pode estar bloqueada (não HTTPS)");
      // No toast here, as we don't want to disturb the user unnecessarily
    }

    // Check geolocation permissions
    if ("permissions" in navigator) {
      checkLocationPermission()
        .then((state) => {
          console.log("Initial permission state:", state);
          if (state === "granted" || state === "prompt") {
            startTracking();
          } else if (state === "denied") {
            setPermissionDenied(true);
            setError("Permissão de localização negada");
            setTracking(false);
          }
          
          // Listen for permission changes
          if ("permissions" in navigator) {
            navigator.permissions
              .query({ name: "geolocation" as PermissionName })
              .then((result) => {
                result.addEventListener("change", () => {
                  console.log("Permission state changed to:", result.state);
                  if (result.state === "granted") {
                    setPermissionDenied(false);
                    startTracking();
                  } else if (result.state === "denied") {
                    setPermissionDenied(true);
                    stopTracking();
                    setError("Permissão de localização negada");
                  }
                });
              });
          }
        })
        .catch(() => {
          // If permissions API fails, try directly
          startTracking();
        });
    } else {
      // Fallback for browsers without permissions API
      startTracking();
    }
    
    return () => {
      // Clean up by stopping tracking when component unmounts
      stopTracking();
      isInitialized.current = false;
    };
  }, [isSecureContext]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador");
      toast({
        title: "Erro",
        description: "Geolocalização não é suportada pelo seu navegador",
        variant: "destructive"
      });
      return;
    }

    try {
      // Function to handle geolocation success
      const handleLocationSuccess = (position: GeolocationPosition) => {
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
        if (user?.id) { // Make sure user exists before using localStorage
          const storageKey = `locationHistory_${user.id}`;
          try {
            const storedHistoryStr = localStorage.getItem(storageKey);
            const storedHistory = storedHistoryStr ? JSON.parse(storedHistoryStr) : [];
            localStorage.setItem(storageKey, JSON.stringify([...storedHistory, newPoint]));
          } catch (e) {
            console.error("Error storing location history:", e);
          }
        }
        
        setError(null);
        setTracking(true);
        console.log("Location tracked successfully:", newPoint);
      };

      console.log("Starting geolocation tracking");
      
      // Function to handle geolocation errors
      const handleLocationError = (error: GeolocationPositionError) => {
        console.error("Erro de geolocalização:", error);
        
        let errorMessage = "Erro de geolocalização desconhecido";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada";
            setPermissionDenied(true);
            // Just set state but don't show intrusive toast for permission denial
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informações de localização indisponíveis";
            // Only show toast if tracking was previously successful
            if (tracking) {
              toast({
                title: "Erro",
                description: errorMessage,
                variant: "destructive"
              });
            }
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo esgotado ao obter localização";
            // Only show toast if tracking was previously successful
            if (tracking) {
              toast({
                title: "Erro",
                description: errorMessage,
                variant: "destructive"
              });
            }
            break;
        }
        
        setError(errorMessage);
        setTracking(false);
      };

      // Start watching position with appropriate error handling
      if (navigator.geolocation) {
        // First try to get current position
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          handleLocationError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
        
        // Then start watching position
        const id = navigator.geolocation.watchPosition(
          handleLocationSuccess,
          handleLocationError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000,
          }
        );
        
        watchIdRef.current = id;
        console.log("Watch position started with ID:", id);
      }
    } catch (err) {
      console.error("Erro ao iniciar rastreamento:", err);
      setError("Erro ao iniciar rastreamento");
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      console.log("Watch position cleared with ID:", watchIdRef.current);
      watchIdRef.current = null;
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
          <div className="fixed bottom-4 right-4 z-40">
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
        <TooltipContent side="top" className="max-w-[280px] z-50">
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
          {permissionDenied && (
            <p className="text-xs text-destructive mt-1">
              Para habilitar o rastreamento, permita o acesso à sua localização nas configurações do navegador.
            </p>
          )}
          {!isSecureContext && (
            <p className="text-xs text-amber-500 mt-1">
              Para melhor funcionamento da localização, acesse via HTTPS.
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LocationTracker;
