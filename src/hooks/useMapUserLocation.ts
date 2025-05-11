
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
  const isInitialized = useRef(false);

  // Gracefully handle location errors without crashing
  const handleLocationError = (error: GeolocationPositionError | Error) => {
    console.error('Erro ao obter localização:', error);
    
    // Check if it's a GeolocationPositionError
    if ('code' in error) {
      let errorMessage = 'Erro ao acessar sua localização atual';

      switch(error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = 'Permissão de localização negada pelo usuário';
          setPermissionDenied(true);
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = 'Informação de localização indisponível';
          break;
        case 3: // TIMEOUT
          errorMessage = 'Tempo esgotado ao tentar obter localização';
          break;
        default:
          errorMessage = `Erro de geolocalização: ${error.message}`;
      }

      // Only show toast for genuine errors, not just permission denials
      if (error.code !== 1) {
        toast({
          title: "Erro de localização",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        // For permission denials, just log it to console
        console.log(errorMessage);
      }
    } else {
      // Generic error handling
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização atual",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!showUserLocation || !isMapReady || !mapInstance.current) return;

    // Prevent duplicate initialization
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Get user icon
    const userIcon = createUserLocationIcon();

    // Function to update user location on the map
    const updateUserLocation = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setUserLocation([latitude, longitude]);
      
      // Only proceed if map instance exists
      if (!mapInstance.current) return;
      
      try {
        if (userLocationMarker.current) {
          userLocationMarker.current.setLatLng([latitude, longitude]);
        } else {
          userLocationMarker.current = L.marker([latitude, longitude], { icon: userIcon });
          
          if (mapInstance.current) {
            try {
              userLocationMarker.current.addTo(mapInstance.current);
            
              // Center map on user location
              mapInstance.current.setView([latitude, longitude], 
                isMobile ? Math.min(16, mapInstance.current.getZoom()) : mapInstance.current.getZoom());
            } catch (addError) {
              console.error("Error adding user marker to map:", addError);
            }
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
            try {
              accuracyCircle.current.addTo(mapInstance.current);
            } catch (circleError) {
              console.error("Error adding accuracy circle to map:", circleError);
            }
          }
        }
      } catch (error) {
        console.error("Error updating user location on map:", error);
      }
    };

    const setupGeolocation = () => {
      try {
        // Get initial location
        if (navigator.geolocation) {
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
        } else {
          throw new Error('Geolocation is not supported by this browser');
        }
      } catch (error) {
        console.error("Error setting up geolocation:", error);
        handleLocationError(error as Error);
      }
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
              // Create a mock error to handle the denied permission
              const mockError = {
                code: 1, // PERMISSION_DENIED
                message: "Permissão de localização negada",
                PERMISSION_DENIED: 1,
                POSITION_UNAVAILABLE: 2,
                TIMEOUT: 3
              };
              handleLocationError(mockError as GeolocationPositionError);
            }
            
            // Listen for permission changes
            result.addEventListener("change", () => {
              if (result.state === "granted") {
                setPermissionDenied(false);
                setupGeolocation();
              } else if (result.state === "denied") {
                setPermissionDenied(true);
                const mockError = {
                  code: 1, // PERMISSION_DENIED
                  message: "Permissão de localização negada",
                  PERMISSION_DENIED: 1,
                  POSITION_UNAVAILABLE: 2,
                  TIMEOUT: 3
                };
                handleLocationError(mockError as GeolocationPositionError);
              }
            });
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

      isInitialized.current = false;
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
