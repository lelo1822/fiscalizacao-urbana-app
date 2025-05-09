
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const LocationTracker = () => {
  const { user } = useAuth();
  const [tracking, setTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Start tracking when component mounts
  useEffect(() => {
    startTracking();
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
          };
          
          setLocationHistory((prevHistory) => [...prevHistory, newPoint]);
          
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

  return (
    <div className="fixed bottom-4 right-4 z-10">
      <div className={`h-3 w-3 rounded-full ${tracking ? 'bg-success animate-pulse-beacon' : 'bg-destructive'}`}>
        <span className="sr-only">{tracking ? 'Rastreando localização' : 'Rastreamento inativo'}</span>
      </div>
    </div>
  );
};

export default LocationTracker;
