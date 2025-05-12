
import { useRef, useEffect } from 'react';
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
  enableClustering?: boolean;
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
  showControls = true,
  enableClustering = true
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

  // Use the hooks unconditionally
  const userLocationHook = useMapUserLocation({
    mapInstance,
    isMapReady,
    showUserLocation,
    isMobile
  });

  // Always call hooks in the same order
  useMapMarkers({
    mapInstance,
    markersLayer,
    markers,
    isMapReady,
    onMarkerClick,
    showHeatmap,
    enableClustering
  });

  useMapTraffic({
    mapInstance,
    showTraffic,
    isMapReady
  });

  // Extract values from userLocationHook
  const userLocation = userLocationHook.userLocation;
  const centerOnUser = userLocationHook.centerOnUser;

  return (
    <div className="relative">
      <div ref={mapContainer} style={{ height, width: '100%' }} />
      
      {showUserLocation && userLocation && isMapReady && (
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
