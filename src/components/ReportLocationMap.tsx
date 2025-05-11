
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface ReportLocationMapProps {
  latitude: number;
  longitude: number;
  height?: string;
  className?: string;
}

const ReportLocationMap = ({ latitude, longitude, height = '200px', className = '' }: ReportLocationMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Inicializar o mapa
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      tap: false
    });
    
    mapRef.current = map;
    
    // Adicionar camada de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // Adicionar marcador
    const marker = L.marker([latitude, longitude]).addTo(map);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height }} 
      className={`rounded-md overflow-hidden border border-gray-200 ${className}`}
    />
  );
};

export default ReportLocationMap;
