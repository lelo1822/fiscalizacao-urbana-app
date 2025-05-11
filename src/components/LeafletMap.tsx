
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

// Corrigir o problema dos ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Definir os ícones padrão do leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Tipos para os marcadores no mapa
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
  center = [-23.55052, -46.633308], // São Paulo como padrão
  zoom = 13,
  height = '500px',
  onMarkerClick,
  showTraffic = false,
  showHeatmap = false,
  interactive = true,
  showControls = true
}: LeafletMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userLocationMarker = useRef<L.Marker | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const heatmapLayer = useRef<any>(null);
  const trafficLayer = useRef<L.TileLayer | null>(null);
  const accuracyCircle = useRef<L.Circle | null>(null);
  const isMobile = useIsMobile();
  const [isMapReady, setIsMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Inicializar o mapa
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Criar o mapa com opções apropriadas para dispositivos móveis
    const mapOptions: L.MapOptions = {
      zoomControl: showControls,
      attributionControl: false,
      dragging: interactive,
      tap: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      scrollWheelZoom: interactive
    };

    const map = L.map(mapContainer.current, mapOptions).setView(center, zoom);
    mapInstance.current = map;

    // Adicionar camada de mapa do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Criar uma camada para os marcadores
    markersLayer.current = L.layerGroup().addTo(map);

    // Adicionar controles de zoom se solicitado
    if (showControls) {
      map.addControl(L.control.zoom({ position: 'topright' }));
    }

    // Corrigir problema do Leaflet em dispositivos móveis
    setTimeout(() => {
      map.invalidateSize();
      setIsMapReady(true);
    }, 300);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, showControls, interactive]);

  // Atualizar marcadores no mapa
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current || !isMapReady) return;

    // Limpar marcadores existentes
    markersLayer.current.clearLayers();

    // Adicionar novos marcadores
    markers.forEach((marker) => {
      const { position, title, status, id, type, priority, date } = marker;

      // Definir cor do marcador baseado no status
      const markerColor = status === 'resolved' ? '#10b981' : 
                          status === 'in_progress' ? '#f59e0b' : 
                          priority === 'high' ? '#ef4444' :
                          priority === 'medium' ? '#f59e0b' : '#3b82f6';

      const markerSize = priority === 'high' ? 14 : priority === 'medium' ? 12 : 10;
      
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${markerColor}; width: ${markerSize}px; height: ${markerSize}px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize/2, markerSize/2]
      });

      const mapMarker = L.marker(position, { icon: customIcon })
        .addTo(markersLayer.current!);

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

      if (onMarkerClick) {
        mapMarker.on('click', () => {
          onMarkerClick(marker);
        });
      }
    });

    // Adicionar heatmap se solicitado e existirem marcadores suficientes
    if (showHeatmap && markers.length > 0 && (window as any).L.heatLayer) {
      if (heatmapLayer.current) {
        mapInstance.current.removeLayer(heatmapLayer.current);
      }

      const heatData = markers.map(m => [...m.position, 0.5]); // Latitude, Longitude, Intensidade
      heatmapLayer.current = (window as any).L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
      }).addTo(mapInstance.current);
    }

  }, [markers, onMarkerClick, isMapReady, showHeatmap]);

  // Adicionar ou remover a camada de tráfego
  useEffect(() => {
    if (!mapInstance.current || !isMapReady) return;

    if (showTraffic) {
      if (!trafficLayer.current) {
        // Esta é uma camada simulada de tráfego - num cenário real usaríamos uma API de tráfego
        trafficLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          opacity: 0.7
        }).addTo(mapInstance.current);
        
        toast.info("Camada de tráfego adicionada", { duration: 2000 });
      }
    } else if (trafficLayer.current) {
      mapInstance.current.removeLayer(trafficLayer.current);
      trafficLayer.current = null;
    }
  }, [showTraffic, isMapReady]);

  // Rastrear localização do usuário
  useEffect(() => {
    if (!showUserLocation || !mapInstance.current || !isMapReady) return;

    // Definir um ícone para a localização do usuário
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    // Função para atualizar a posição do usuário
    const updateUserLocation = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setUserLocation([latitude, longitude]);
      
      if (userLocationMarker.current) {
        userLocationMarker.current.setLatLng([latitude, longitude]);
      } else {
        userLocationMarker.current = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(mapInstance.current!);
        
        // Centralizar o mapa na localização do usuário
        mapInstance.current?.setView([latitude, longitude], 
          isMobile ? Math.min(16, mapInstance.current.getZoom()) : mapInstance.current.getZoom());
      }
      
      // Atualizar o círculo de precisão
      if (accuracyCircle.current) {
        accuracyCircle.current.setLatLng([latitude, longitude]);
        accuracyCircle.current.setRadius(accuracy);
      } else {
        accuracyCircle.current = L.circle([latitude, longitude], {
          radius: accuracy,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 1
        }).addTo(mapInstance.current!);
      }
    };

    // Observar alterações na posição
    const watchId = navigator.geolocation.watchPosition(
      updateUserLocation,
      (error) => {
        console.error('Erro ao obter localização:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    // Obter a localização inicial
    navigator.geolocation.getCurrentPosition(
      updateUserLocation,
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização atual');
      }
    );

    // Cleanup 
    return () => {
      navigator.geolocation.clearWatch(watchId);
      
      if (userLocationMarker.current && mapInstance.current) {
        mapInstance.current.removeLayer(userLocationMarker.current);
        userLocationMarker.current = null;
      }
      
      if (accuracyCircle.current && mapInstance.current) {
        mapInstance.current.removeLayer(accuracyCircle.current);
        accuracyCircle.current = null;
      }
    };
  }, [showUserLocation, isMapReady, isMobile]);

  // Função para recentralizar no usuário
  const centerOnUser = () => {
    if (mapInstance.current && userLocation) {
      mapInstance.current.setView(userLocation, 16);
    }
  };

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
