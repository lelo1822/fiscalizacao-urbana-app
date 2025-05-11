
import { useRef } from 'react';
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

  // Handle user location
  const { userLocation, centerOnUser } = useMapUserLocation({
    mapInstance,
    isMapReady,
    showUserLocation,
    isMobile
  });

  // Handle map markers
  useMapMarkers({
    mapInstance,
    markersLayer,
    markers,
    isMapReady,
    onMarkerClick,
    showHeatmap
  });

  // Handle traffic layer
  useMapTraffic({
    mapInstance,
    showTraffic,
    isMapReady
  });

  return (
    <div className="relative">
      <div ref={mapContainer} style={{ height, width: '100%' }} />
      
      {showUserLocation && userLocation && (
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
