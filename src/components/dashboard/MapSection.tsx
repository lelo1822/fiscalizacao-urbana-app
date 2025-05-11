
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LeafletMap from "@/components/LeafletMap";
import { useNavigate } from "react-router-dom";

interface MapMarker {
  id: number;
  position: [number, number];
  title: string;
  type: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
}

interface MapSectionProps {
  mapMarkers: MapMarker[];
  userPosition: [number, number] | null;
  onMarkerClick: (marker: MapMarker) => void;
}

const MapSection = ({ mapMarkers, userPosition, onMarkerClick }: MapSectionProps) => {
  return (
    <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Mapa de Ocorrências</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <LeafletMap 
          height="320px"
          markers={mapMarkers}
          showUserLocation={true}
          onMarkerClick={(marker) => onMarkerClick(marker)}
          center={userPosition || [-23.55052, -46.633308]}
        />
      </CardContent>
    </Card>
  );
};

export default MapSection;
