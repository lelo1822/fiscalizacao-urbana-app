
import { useRef } from 'react';
import L from 'leaflet';
import { createUserLocationIcon } from '@/utils/leaflet-utils';

interface UseUserLocationMarkerProps {
  mapInstance: React.MutableRefObject<L.Map | null>;
  isMobile: boolean;
}

export const useUserLocationMarker = ({
  mapInstance,
  isMobile
}: UseUserLocationMarkerProps) => {
  const userLocationMarker = useRef<L.Marker | null>(null);
  const accuracyCircle = useRef<L.Circle | null>(null);

  // Function to update user location on the map
  const updateMarkerPosition = (position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    // Only proceed if map instance exists
    if (!mapInstance.current) return;
    
    try {
      // Get user icon
      const userIcon = createUserLocationIcon();

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

  // Function to clean up markers
  const cleanupMarkers = () => {
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

  return {
    updateMarkerPosition,
    cleanupMarkers
  };
};
