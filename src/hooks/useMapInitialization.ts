
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { initializeLeafletIcons } from '@/utils/leaflet-utils';

interface UseMapInitializationProps {
  container: React.RefObject<HTMLDivElement>;
  center: [number, number];
  zoom: number;
  showControls: boolean;
  interactive: boolean;
}

export const useMapInitialization = ({
  container,
  center,
  zoom,
  showControls,
  interactive
}: UseMapInitializationProps) => {
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!container.current || mapInstance.current) return;

    // Initialize Leaflet icons
    initializeLeafletIcons();

    // Create map with appropriate options
    const mapOptions: L.MapOptions = {
      zoomControl: showControls,
      attributionControl: false,
      dragging: interactive,
      tap: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      scrollWheelZoom: interactive
    };

    const map = L.map(container.current, mapOptions).setView(center, zoom);
    mapInstance.current = map;

    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers layer
    markersLayer.current = L.layerGroup().addTo(map);

    // Add zoom controls if needed
    if (showControls) {
      map.addControl(L.control.zoom({ position: 'topright' }));
    }

    // Fix Leaflet mobile issue
    setTimeout(() => {
      map.invalidateSize();
      setIsMapReady(true);
    }, 300);

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [container, center, zoom, showControls, interactive]);

  return {
    mapInstance,
    markersLayer,
    isMapReady
  };
};
