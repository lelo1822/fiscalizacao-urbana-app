
import { useState, useRef, useEffect } from "react";
import { checkLocationPermission, handleLocationError, createPermissionDeniedError } from "@/utils/location-utils";

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number | null;
}

interface UseLocationTrackingProps {
  userId?: string;
}

export const useLocationTracking = ({ userId }: UseLocationTrackingProps = {}) => {
  const [tracking, setTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const isInitialized = useRef(false);

  // Verificar se o contexto é seguro
  const [isSecureContext, setIsSecureContext] = useState<boolean>(
    typeof window !== 'undefined' && window.isSecureContext
  );

  // Iniciar rastreamento quando o componente for montado
  useEffect(() => {
    // Prevenir inicialização duplicada
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeTracking = async () => {
      try {
        const permission = await checkLocationPermission();
        
        if (permission === 'denied') {
          setPermissionDenied(true);
          setError("Permissão de localização negada. Por favor, habilite o acesso à localização.");
          return;
        }

        // Iniciar o rastreamento apenas se estiver habilitado no localStorage
        const shouldTrack = localStorage.getItem('locationTracking') === 'true';
        if (shouldTrack) {
          startTracking();
        }
      } catch (err) {
        // Fix: Correctly pass the setError function
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
      }
    };

    // Verificar se o navegador suporta geolocalização
    if ('geolocation' in navigator) {
      initializeTracking();
    } else {
      setError("Seu navegador não suporta geolocalização.");
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // Função para iniciar o rastreamento
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada neste navegador.");
      return;
    }

    if (watchIdRef.current !== null) {
      // Já está rastreando
      return;
    }

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = position.timestamp;
          const speed = position.coords.speed;

          const newPoint: LocationPoint = {
            latitude,
            longitude,
            timestamp,
            accuracy,
            speed
          };

          setLocationHistory(prev => [...prev, newPoint]);
          setLastUpdate(new Date());
          setError(null);

          // Persistir a localização atual no localStorage
          const currentLocation = { lat: latitude, lng: longitude };
          localStorage.setItem('currentLocation', JSON.stringify(currentLocation));
          
          // Salvar histórico no localStorage (limitado a últimos 50 pontos)
          const updatedHistory = [...locationHistory, newPoint].slice(-50);
          localStorage.setItem('locationHistory', JSON.stringify(updatedHistory));

        },
        (err) => {
          // Fix: Handle the error properly without using handleLocationError
          if (err.code === 1) {  // Permissão negada
            setPermissionDenied(true);
            stopTracking();
          }
          setError(err.message || "Erro ao obter localização");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );

      setTracking(true);
      localStorage.setItem('locationTracking', 'true');
    } catch (err) {
      // Fix: Handle the error properly without using handleLocationError
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
    }
  };

  // Função para parar o rastreamento
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setTracking(false);
      localStorage.setItem('locationTracking', 'false');
    }
  };

  // Alternar o rastreamento
  const toggleTracking = () => {
    if (tracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  return {
    tracking,
    toggleTracking,
    startTracking,
    stopTracking,
    locationHistory,
    lastUpdate,
    error,
    permissionDenied,
    isSecureContext
  };
};
