
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from '@/components/ui/use-toast';

interface UseMapTrafficProps {
  mapInstance: React.MutableRefObject<L.Map | null>;
  showTraffic: boolean;
  isMapReady: boolean;
}

export const useMapTraffic = ({
  mapInstance,
  showTraffic,
  isMapReady
}: UseMapTrafficProps) => {
  const trafficLayer = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return;

    if (showTraffic) {
      if (!trafficLayer.current) {
        // This is a simulated traffic layer - in a real scenario, we would use a traffic API
        trafficLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          opacity: 0.7
        }).addTo(mapInstance.current);
        
        toast({
          title: "Camada de tráfego",
          description: "Camada de tráfego adicionada ao mapa",
          duration: 2000
        });
      }
    } else if (trafficLayer.current) {
      mapInstance.current.removeLayer(trafficLayer.current);
      trafficLayer.current = null;
    }
  }, [showTraffic, isMapReady, mapInstance]);
};
