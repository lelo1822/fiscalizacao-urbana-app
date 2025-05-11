
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
    if (!isMapReady || !mapInstance.current) return;
    
    const addTrafficLayer = () => {
      try {
        if (!mapInstance.current) return;

        // This is a simulated traffic layer - in a real scenario, we would use a traffic API
        trafficLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          opacity: 0.7
        });
        
        trafficLayer.current.addTo(mapInstance.current);
        
        toast({
          title: "Camada de tráfego",
          description: "Camada de tráfego adicionada ao mapa",
          duration: 2000,
          variant: "default"
        });
      } catch (error) {
        console.error("Error adding traffic layer:", error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar a camada de tráfego",
          variant: "destructive"
        });
      }
    };

    const removeTrafficLayer = () => {
      try {
        if (!mapInstance.current || !trafficLayer.current) return;
        
        mapInstance.current.removeLayer(trafficLayer.current);
        trafficLayer.current = null;
      } catch (error) {
        console.error("Error removing traffic layer:", error);
      }
    };

    if (showTraffic) {
      if (!trafficLayer.current) {
        addTrafficLayer();
      }
    } else if (trafficLayer.current) {
      removeTrafficLayer();
    }
  }, [showTraffic, isMapReady, mapInstance]);
};
