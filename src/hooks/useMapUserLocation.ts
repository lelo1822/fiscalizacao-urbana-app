
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { toast } from "sonner";
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
  const userLocationMarker = useRef<L.Marker | null>(null);
  const accuracyCircle = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!showUserLocation || !mapInstance.current || !isMapReady) return;

    // Get user icon
    const userIcon = createUserLocationIcon();

    // Function to update user location on the map
    const updateUserLocation = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setUserLocation([latitude, longitude]);
      
      if (userLocationMarker.current) {
        userLocationMarker.current.setLatLng([latitude, longitude]);
      } else {
        userLocationMarker.current = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(mapInstance.current!);
        
        // Center map on user location
        mapInstance.current?.setView([latitude, longitude], 
          isMobile ? Math.min(16, mapInstance.current.getZoom()) : mapInstance.current.getZoom());
      }
      
      // Update accuracy circle
      if (accuracyCircle.current) {
        accuracyCircle.current.setLatLng([latitude, longitude]);
        accuracyCircle.current.setRadius(accuracy);
      } else {
        accuracyCircle.current = L.circle([latitude, longitude], {
          radius: accuracy,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 1
        }).addTo(mapInstance.current!);
      }
    };

    // Set up geolocation watching
    const watchId = navigator.geolocation.watchPosition(
      updateUserLocation,
      (error) => {
        console.error('Erro ao obter localização:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    // Get initial location
    navigator.geolocation.getCurrentPosition(
      updateUserLocation,
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização atual');
      }
    );

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      
      if (userLocationMarker.current && mapInstance.current) {
        mapInstance.current.removeLayer(userLocationMarker.current);
        userLocationMarker.current = null;
      }
      
      if (accuracyCircle.current && mapInstance.current) {
        mapInstance.current.removeLayer(accuracyCircle.current);
        accuracyCircle.current = null;
      }
    };
  }, [showUserLocation, isMapReady, isMobile, mapInstance]);

  // Function to center map on user location
  const centerOnUser = () => {
    if (mapInstance.current && userLocation) {
      mapInstance.current.setView(userLocation, 16);
    }
  };

  return {
    userLocation,
    centerOnUser
  };
};
