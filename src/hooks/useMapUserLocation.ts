
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { toast } from "@/hooks/use-toast";
import { handleLocationError, checkLocationPermission, createPermissionDeniedError } from '@/utils/location-utils';
import { useUserLocationMarker } from '@/hooks/useUserLocationMarker';

interface UseMapUserLocationProps {
  mapInstance: React.MutableRefObject<L.Map | null>;
  isMapReady: boolean;
  showUserLocation: boolean;
  isMobile: boolean;
}

export const useMapUserLocation = ({
  mapInstance,
  isMapReady,
  showUserLocation,
  isMobile
}: UseMapUserLocationProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const watchId = useRef<number | null>(null);
  const isInitialized = useRef(false);

  // Use the marker management hook
  const { updateMarkerPosition, cleanupMarkers } = useUserLocationMarker({
    mapInstance,
    isMobile
  });

  useEffect(() => {
    if (!showUserLocation || !isMapReady || !mapInstance.current) return;

    // Prevent duplicate initialization
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Function to update user location
    const handlePositionUpdate = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
      updateMarkerPosition(position);
    };

    const setupGeolocation = async () => {
      try {
        // Get initial location
        if (navigator.geolocation) {
          // Check if we're in a secure context
          if (window.isSecureContext) {
            console.log("Running in secure context, geolocation should work");
          } else {
            console.warn("Not running in secure context, geolocation may be blocked");
            toast({
              title: "Alerta de localização",
              description: "Para usar a localização, acesse o site via HTTPS",
              variant: "default" // Alterado de "warning" para "default"
            });
            return;
          }
          
          navigator.geolocation.getCurrentPosition(
            handlePositionUpdate,
            (error) => {
              console.log("Erro na obtenção da posição inicial:", error);
              handleLocationError(error, setPermissionDenied);
            },
            { 
              enableHighAccuracy: true, 
              timeout: 15000, 
              maximumAge: 0 
            }
          );

          // Set up watching
          watchId.current = navigator.geolocation.watchPosition(
            handlePositionUpdate,
            (error) => {
              console.log("Erro no watchPosition:", error);
              handleLocationError(error, setPermissionDenied);
            },
            { 
              enableHighAccuracy: true, 
              timeout: 15000, 
              maximumAge: 5000 
            }
          );
        } else {
          throw new Error('Geolocation is not supported by this browser');
        }
      } catch (error) {
        console.error("Error setting up geolocation:", error);
        handleLocationError(error as Error, setPermissionDenied);
      }
    };

    // Set up geolocation watching only if not previously denied
    if (!permissionDenied && navigator.geolocation) {
      checkLocationPermission().then(permissionState => {
        console.log("Current location permission state:", permissionState);
        if (permissionState === "granted" || permissionState === "prompt") {
          setupGeolocation();
        } else if (permissionState === "denied") {
          setPermissionDenied(true);
          handleLocationError(createPermissionDeniedError(), setPermissionDenied);
        }
      });
    }

    // Cleanup function
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      
      cleanupMarkers();
      isInitialized.current = false;
    };
  }, [showUserLocation, isMapReady, isMobile, mapInstance, permissionDenied, updateMarkerPosition, cleanupMarkers]);

  // Function to center map on user location
  const centerOnUser = () => {
    if (mapInstance.current && userLocation) {
      mapInstance.current.setView(userLocation, 16);
    } else if (!userLocation && !permissionDenied && navigator.geolocation) {
      // Try to get location again if not available
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          if (mapInstance.current) {
            mapInstance.current.setView([latitude, longitude], 16);
          }
        },
        (error) => {
          console.error('Erro ao centralizar no usuário:', error);
          toast({
            title: "Localização indisponível",
            description: "Não foi possível obter sua localização atual",
            variant: "destructive"
          });
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 0 
        }
      );
    } else if (permissionDenied) {
      toast({
        title: "Permissão negada",
        description: "Habilite a localização no seu navegador para usar este recurso",
        variant: "destructive"
      });
    }
  };

  return {
    userLocation,
    centerOnUser,
    permissionDenied
  };
};
