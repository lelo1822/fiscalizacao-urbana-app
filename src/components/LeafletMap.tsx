
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from "sonner";

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
}

interface LeafletMapProps {
  markers?: MapMarker[];
  showUserLocation?: boolean;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
}

const LeafletMap = ({
  markers = [],
  showUserLocation = true,
  center = [-23.55052, -46.633308], // São Paulo como padrão
  zoom = 13,
  height = '500px',
  onMarkerClick
}: LeafletMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userLocationMarker = useRef<L.Marker | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  // Inicializar o mapa
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Criar o mapa
    const map = L.map(mapContainer.current).setView(center, zoom);
    mapInstance.current = map;

    // Adicionar camada de mapa do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Criar uma camada para os marcadores
    markersLayer.current = L.layerGroup().addTo(map);

    // Adicionar controles de zoom
    map.addControl(L.control.zoom({ position: 'topright' }));

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom]);

  // Atualizar marcadores no mapa
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;

    // Limpar marcadores existentes
    markersLayer.current.clearLayers();

    // Adicionar novos marcadores
    markers.forEach((marker) => {
      const { position, title, status, id, type } = marker;

      // Definir cor do marcador baseado no status
      const markerColor = status === 'resolved' ? 'green' : 
                          status === 'in_progress' ? 'orange' : 'blue';

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const mapMarker = L.marker(position, { icon: customIcon })
        .addTo(markersLayer.current!);

      if (title || type) {
        const popupContent = `
          <div class="popup-content">
            <h3 class="font-bold">${title || type || 'Ocorrência'}</h3>
            ${type && title ? `<p>${type}</p>` : ''}
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

  }, [markers, onMarkerClick]);

  // Mostrar localização do usuário se solicitado
  useEffect(() => {
    if (!showUserLocation || !mapInstance.current) return;

    // Definir um ícone para a localização do usuário
    const userIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    // Obter a localização atual
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (userLocationMarker.current) {
          userLocationMarker.current.setLatLng([latitude, longitude]);
        } else {
          userLocationMarker.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstance.current!);
          
          // Adicionar círculo de precisão
          L.circle([latitude, longitude], {
            radius: 100,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1
          }).addTo(mapInstance.current!);

          // Centralizar o mapa na localização do usuário
          mapInstance.current?.setView([latitude, longitude], zoom);
        }
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização atual');
      }
    );

    // Cleanup 
    return () => {
      if (userLocationMarker.current && mapInstance.current) {
        mapInstance.current.removeLayer(userLocationMarker.current);
        userLocationMarker.current = null;
      }
    };
  }, [showUserLocation, zoom]);

  return <div ref={mapContainer} style={{ height, width: '100%' }} />;
};

export default LeafletMap;
