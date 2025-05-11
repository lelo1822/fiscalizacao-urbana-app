
import { useEffect } from 'react';
import L from 'leaflet';
import { createCustomMarkerIcon, getMarkerColor, getMarkerSize } from '@/utils/leaflet-utils';

export interface MapMarker {
  id: string | number;
  position: [number, number];
  title?: string;
  status?: 'pending' | 'in_progress' | 'resolved';
  type?: string;
  priority?: 'high' | 'medium' | 'low';
  date?: string;
  iconUrl?: string;
}

interface UseMapMarkersProps {
  mapInstance: React.MutableRefObject<L.Map | null>;
  markersLayer: React.MutableRefObject<L.LayerGroup | null>;
  markers: MapMarker[];
  isMapReady: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  showHeatmap: boolean;
}

export const useMapMarkers = ({
  mapInstance,
  markersLayer,
  markers,
  isMapReady,
  onMarkerClick,
  showHeatmap
}: UseMapMarkersProps) => {
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current || !isMapReady) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Add new markers
    markers.forEach((marker) => {
      const { position, title, status, id, type, priority, date } = marker;

      // Get marker color and size based on status/priority
      const markerColor = getMarkerColor(status, priority);
      const markerSize = getMarkerSize(priority);
      
      // Create custom icon
      const customIcon = createCustomMarkerIcon(markerColor, markerSize);

      // Add marker to map
      const mapMarker = L.marker(position, { icon: customIcon })
        .addTo(markersLayer.current!);

      // Add popup if title or type is available
      if (title || type) {
        const formattedDate = date ? new Date(date).toLocaleString('pt-BR') : '';
        
        const popupContent = `
          <div class="popup-content">
            <h3 class="font-bold">${title || type || 'Ocorrência'}</h3>
            ${type && title ? `<p>${type}</p>` : ''}
            ${date ? `<p class="text-xs mt-1">${formattedDate}</p>` : ''}
            <p class="text-xs mt-1">${status === 'resolved' ? 'Resolvido' : 
              status === 'in_progress' ? 'Em andamento' : 'Pendente'}</p>
          </div>
        `;
        mapMarker.bindPopup(popupContent);
      }

      // Add click handler if provided
      if (onMarkerClick) {
        mapMarker.on('click', () => {
          onMarkerClick(marker);
        });
      }
    });

    // Add heatmap if requested and markers are available
    if (showHeatmap && markers.length > 0 && (window as any).L.heatLayer) {
      if (mapInstance.current) {
        // Remove existing heatmap if any
        const existingHeatmapLayers = Object.values(mapInstance.current._layers || {})
          .filter((layer: any) => layer._heat);
          
        existingHeatmapLayers.forEach((layer: any) => {
          mapInstance.current?.removeLayer(layer);
        });
        
        // Create heatmap data
        const heatData = markers.map(m => [...m.position, 0.5]); // Latitude, Longitude, Intensity
        
        // Add new heatmap layer
        (window as any).L.heatLayer(heatData, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
        }).addTo(mapInstance.current);
      }
    }

  }, [markers, onMarkerClick, isMapReady, showHeatmap, mapInstance, markersLayer]);
};
