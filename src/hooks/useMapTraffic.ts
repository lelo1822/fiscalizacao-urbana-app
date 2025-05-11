
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { toast } from '@/hooks/use-toast';

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
    if (!isMapReady) return;
    
    // Check if map instance is available
    if (!mapInstance.current) {
      console.warn("Map instance is not available when trying to add traffic layer");
      return;
    }

    if (showTraffic) {
      if (!trafficLayer.current) {
        try {
          // This is a simulated traffic layer - in a real scenario, we would use a traffic API
          trafficLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            opacity: 0.7
          });
          
          // Check if mapInstance is still valid before adding layer
          if (mapInstance.current) {
            trafficLayer.current.addTo(mapInstance.current);
            
            toast({
              title: "Camada de tráfego",
              description: "Camada de tráfego adicionada ao mapa",
              duration: 2000,
              variant: "default"
            });
          }
        } catch (error) {
          console.error("Error adding traffic layer:", error);
          toast({
            title: "Erro",
            description: "Não foi possível adicionar a camada de tráfego",
            variant: "destructive"
          });
        }
      }
    } else if (trafficLayer.current && mapInstance.current) {
      try {
        mapInstance.current.removeLayer(trafficLayer.current);
        trafficLayer.current = null;
      } catch (error) {
        console.error("Error removing traffic layer:", error);
      }
    }
  }, [showTraffic, isMapReady, mapInstance]);
};
