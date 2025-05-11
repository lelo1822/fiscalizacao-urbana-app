
import { useRef, useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useMapUserLocation } from '@/hooks/useMapUserLocation';
import { useMapMarkers, MapMarker } from '@/hooks/useMapMarkers';
import { useMapTraffic } from '@/hooks/useMapTraffic';

export type { MapMarker };

interface LeafletMapProps {
  markers?: MapMarker[];
  showUserLocation?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  showTraffic?: boolean;
  showHeatmap?: boolean;
  interactive?: boolean;
  showControls?: boolean;
}

const LeafletMap = ({
  markers = [],
  showUserLocation = true,
  center = [-23.55052, -46.633308], // São Paulo as default
  zoom = 13,
  height = '500px',
  onMarkerClick,
  showTraffic = false,
  showHeatmap = false,
  interactive = true,
  showControls = true
}: LeafletMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Initialize map
  const { mapInstance, markersLayer, isMapReady } = useMapInitialization({
    container: mapContainer,
    center,
    zoom,
    showControls,
    interactive
  });

  // State to track when it's safe to use map-dependent hooks
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  // Only enable dependent hooks after map is confirmed to be ready
  useEffect(() => {
    if (isMapReady && mapInstance.current) {
      setIsMapInitialized(true);
    }
  }, [isMapReady]);

  // Declare hook variables outside conditionals to maintain hook order
  const userLocationHook = useMapUserLocation({
    mapInstance,
    isMapReady: isMapInitialized,
    showUserLocation,
    isMobile
  });
  
  // Use the hooks unconditionally but control their effects with isMapInitialized flag
  useMapMarkers({
    mapInstance,
    markersLayer,
    markers,
    isMapReady: isMapInitialized,
    onMarkerClick,
    showHeatmap
  });

  useMapTraffic({
    mapInstance,
    showTraffic,
    isMapReady: isMapInitialized
  });

  // Extract values from userLocationHook
  const userLocation = userLocationHook.userLocation;
  const centerOnUser = userLocationHook.centerOnUser;

  return (
    <div className="relative">
      <div ref={mapContainer} style={{ height, width: '100%' }} />
      
      {showUserLocation && userLocation && isMapInitialized && (
        <button
          onClick={centerOnUser}
          className="absolute bottom-4 left-4 bg-primary text-white rounded-full p-2 shadow-lg z-[400]"
          aria-label="Centralizar no usuário"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default LeafletMap;
