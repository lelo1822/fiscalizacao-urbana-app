
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RouteMapProps {
  routePoints: RoutePoint[];
  height?: string;
  className?: string;
  showMarkers?: boolean;
}

const RouteMap = ({ 
  routePoints, 
  height = '400px', 
  className = '',
  showMarkers = true 
}: RouteMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || routePoints.length === 0) return;
    
    // Inicializar o mapa
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    });
    
    mapRef.current = map;
    
    // Adicionar camada de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Preparar pontos para a polyline
    const points = routePoints.map(point => [point.latitude, point.longitude] as L.LatLngExpression);
    
    // Criar a polyline para representar a rota
    const routePath = L.polyline(points, {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.7,
    }).addTo(map);
    
    // Adicionar marcadores para início e fim da rota
    if (showMarkers && points.length > 0) {
      // Marcador de início (verde)
      const startIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      
      L.marker(points[0], { icon: startIcon }).addTo(map)
        .bindPopup('Início da rota');
      
      // Marcador de fim (vermelho)
      const endIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      
      L.marker(points[points.length - 1], { icon: endIcon }).addTo(map)
        .bindPopup('Fim da rota');
      
      // Adicionar marcadores para paradas (azul)
      if (points.length > 10) {
        const middlePoints = Math.floor(points.length / 10);
        for (let i = 1; i < 9; i++) {
          const stopIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #3b82f6; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [8, 8],
            iconAnchor: [4, 4]
          });
          
          const stopIndex = i * middlePoints;
          if (stopIndex < points.length - 1) {
            const timestamp = new Date(routePoints[stopIndex].timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            });
            
            L.marker(points[stopIndex], { icon: stopIcon }).addTo(map)
              .bindPopup(`Passagem: ${timestamp}`);
          }
        }
      }
    }
    
    // Ajustar o zoom para visualizar toda a rota
    map.fitBounds(routePath.getBounds(), {
      padding: [40, 40]
    });
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [routePoints, showMarkers]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height }} 
      className={`rounded-md overflow-hidden border border-gray-200 ${className}`}
    />
  );
};

export default RouteMap;
