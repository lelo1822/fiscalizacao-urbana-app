
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { createCustomMarkerIcon, getMarkerColor, getMarkerSize, createPinMarkerIcon } from '@/utils/leaflet-utils';

export interface MapMarker {
  id: string | number;
  position: [number, number];
  title?: string;
  status?: 'pending' | 'in_progress' | 'resolved';
  type?: string;
  priority?: 'high' | 'medium' | 'low';
  date?: string;
  iconUrl?: string;
  iconType?: 'default' | 'circle' | 'pin';
  cluster?: boolean;
}

interface UseMapMarkersProps {
  mapInstance: React.MutableRefObject<L.Map | null>;
  markersLayer: React.MutableRefObject<L.LayerGroup | null>;
  markers: MapMarker[];
  isMapReady: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  showHeatmap: boolean;
  enableClustering?: boolean;
}

export const useMapMarkers = ({
  mapInstance,
  markersLayer,
  markers,
  isMapReady,
  onMarkerClick,
  showHeatmap,
  enableClustering = true
}: UseMapMarkersProps) => {
  // Ref para o cluster group
  const markerClusterGroup = useRef<L.MarkerClusterGroup | null>(null);
  
  useEffect(() => {
    if (!isMapReady) return;
    
    // Check if map and layer are available
    if (!mapInstance.current || !markersLayer.current) {
      console.warn("Map instance or markers layer is not available when trying to add markers");
      return;
    }

    try {
      // Clear existing markers
      markersLayer.current.clearLayers();
      
      // Remove existing cluster group if it exists
      if (markerClusterGroup.current && mapInstance.current) {
        mapInstance.current.removeLayer(markerClusterGroup.current);
      }
      
      // Create a new marker cluster group if clustering is enabled
      if (enableClustering) {
        markerClusterGroup.current = L.markerClusterGroup({
          maxClusterRadius: 40,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          iconCreateFunction: (cluster) => {
            const childCount = cluster.getChildCount();
            
            // Count markers by status
            let pendingCount = 0;
            let inProgressCount = 0;
            let resolvedCount = 0;
            
            cluster.getAllChildMarkers().forEach((marker: any) => {
              if (marker.options.status === 'pending') pendingCount++;
              else if (marker.options.status === 'in_progress') inProgressCount++;
              else if (marker.options.status === 'resolved') resolvedCount++;
            });
            
            // Determine the primary color of the cluster based on majority status
            let clusterColor = '#3b82f6'; // Default blue (pending)
            if (resolvedCount > pendingCount && resolvedCount > inProgressCount) {
              clusterColor = '#10b981'; // Green for mostly resolved
            } else if (inProgressCount > pendingCount && inProgressCount > resolvedCount) {
              clusterColor = '#f59e0b'; // Orange for mostly in progress
            }
            
            // Create custom cluster icon
            return L.divIcon({
              html: `<div class="cluster-icon" style="background-color: ${clusterColor}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; border: 2px solid white;">${childCount}</div>`,
              className: 'custom-cluster-icon',
              iconSize: L.point(30, 30)
            });
          }
        });
        
        if (mapInstance.current) {
          mapInstance.current.addLayer(markerClusterGroup.current);
        }
      }

      // Add new markers
      markers.forEach((marker) => {
        const { position, title, status, id, type, priority, date, iconType, cluster = true } = marker;

        // Get marker color based on status/priority
        const markerColor = getMarkerColor(status, priority);
        const markerSize = getMarkerSize(priority);
        
        // Create icon based on iconType
        let customIcon;
        if (iconType === 'pin') {
          customIcon = createPinMarkerIcon(markerColor);
        } else {
          // Default to circle icon
          customIcon = createCustomMarkerIcon(markerColor, markerSize);
        }

        // Create the marker with status in options for cluster reference
        const mapMarker = L.marker(position, { 
          icon: customIcon,
          // @ts-ignore - Adding status for cluster reference
          status: status 
        });

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

        // Add marker either to cluster or directly to map based on config
        if (enableClustering && cluster && markerClusterGroup.current) {
          markerClusterGroup.current.addLayer(mapMarker);
        } else {
          markersLayer.current!.addLayer(mapMarker);
        }
      });

      // Add heatmap if requested and markers are available
      if (showHeatmap && markers.length > 0 && mapInstance.current && (window as any).L.heatLayer) {
        try {
          // Find and remove existing heatmaps before adding a new one
          if (mapInstance.current) {
            // Use proper Leaflet API to manage layers
            const existingLayers = mapInstance.current.eachLayer;
            
            if (existingLayers) {
              mapInstance.current.eachLayer((layer: any) => {
                if (layer && layer._heat && typeof layer.remove === 'function') {
                  layer.remove();
                }
              });
            }
          }
          
          // Create heatmap data
          const heatData = markers.map(m => [...m.position, 0.5]); // Latitude, Longitude, Intensity
          
          // Add new heatmap layer
          (window as any).L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
          }).addTo(mapInstance.current);
        } catch (heatError) {
          console.error("Error handling heatmap:", heatError);
        }
      }
    } catch (error) {
      console.error("Error handling map markers:", error);
    }
  }, [markers, onMarkerClick, isMapReady, showHeatmap, mapInstance, markersLayer, enableClustering]);
};
