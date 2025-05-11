
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { toast } from "@/hooks/use-toast";
import { createUserLocationIcon } from '@/utils/leaflet-utils';

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
  const userLocationMarker = useRef<L.Marker | null>(null);
  const accuracyCircle = useRef<L.Circle | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!showUserLocation || !isMapReady || !mapInstance.current) return;

    // Get user icon
    const userIcon = createUserLocationIcon();

    // Function to update user location on the map
    const updateUserLocation = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setUserLocation([latitude, longitude]);
      
      // Ensure map instance exists before trying to add markers
      if (!mapInstance.current) {
        console.warn("Map instance is not available when trying to add user location marker");
        return;
      }
      
      try {
        if (userLocationMarker.current) {
          userLocationMarker.current.setLatLng([latitude, longitude]);
        } else {
          userLocationMarker.current = L.marker([latitude, longitude], { icon: userIcon });
          
          if (mapInstance.current) {
            userLocationMarker.current.addTo(mapInstance.current);
          
            // Center map on user location
            mapInstance.current.setView([latitude, longitude], 
              isMobile ? Math.min(16, mapInstance.current.getZoom()) : mapInstance.current.getZoom());
          }
        }
        
        // Update accuracy circle
        if (accuracyCircle.current) {
          accuracyCircle.current.setLatLng([latitude, longitude]);
          accuracyCircle.current.setRadius(accuracy);
        } else if (mapInstance.current) {
          accuracyCircle.current = L.circle([latitude, longitude], {
            radius: accuracy,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1
          });
          
          if (mapInstance.current) {
            accuracyCircle.current.addTo(mapInstance.current);
          }
        }
      } catch (error) {
        console.error("Error updating user location on map:", error);
      }
    };

    // Function to handle geolocation errors
    const handleLocationError = (error: GeolocationPositionError) => {
      console.error('Erro ao obter localização:', error);
      let errorMessage = 'Erro ao acessar sua localização atual';

      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permissão de localização negada pelo usuário';
          setPermissionDenied(true);
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Informação de localização indisponível';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tempo esgotado ao tentar obter localização';
          break;
        default:
          errorMessage = `Erro de geolocalização: ${error.message}`;
      }

      toast({
        title: "Erro de localização",
        description: errorMessage,
        variant: "destructive"
      });
    };

    // Set up geolocation watching only if not previously denied
    if (!permissionDenied && navigator.geolocation) {
      if ("permissions" in navigator) {
        // Check for permissions first if the API is available
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
              setupGeolocation();
            } else if (result.state === "denied") {
              setPermissionDenied(true);
              handleLocationError({
                code: 1,
                message: "Permissão de localização negada",
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3
              });
            }
          })
          .catch(() => {
            // If permissions API fails, try directly
            setupGeolocation();
          });
      } else {
        // Fallback for browsers without permissions API
        setupGeolocation();
      }
    }

    function setupGeolocation() {
      try {
        // Get initial location
        navigator.geolocation.getCurrentPosition(
          updateUserLocation,
          handleLocationError,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        // Set up watching
        watchId.current = navigator.geolocation.watchPosition(
          updateUserLocation,
          handleLocationError,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );
      } catch (error) {
        console.error("Error setting up geolocation:", error);
      }
    }

    // Cleanup function
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      
      if (userLocationMarker.current && mapInstance.current) {
        try {
          mapInstance.current.removeLayer(userLocationMarker.current);
        } catch (error) {
          console.error("Error removing user marker:", error);
        }
        userLocationMarker.current = null;
      }
      
      if (accuracyCircle.current && mapInstance.current) {
        try {
          mapInstance.current.removeLayer(accuracyCircle.current);
        } catch (error) {
          console.error("Error removing accuracy circle:", error);
        }
        accuracyCircle.current = null;
      }
    };
  }, [showUserLocation, isMapReady, isMobile, mapInstance, permissionDenied]);

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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
