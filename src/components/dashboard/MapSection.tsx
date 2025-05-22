
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { MapMarker } from "@/types/map";

interface MapSectionProps {
  mapMarkers?: MapMarker[];
  userPosition?: [number, number] | null;
  onMarkerClick?: (marker: MapMarker) => void;
}

const MapSection = ({ mapMarkers = [], userPosition, onMarkerClick }: MapSectionProps) => {
  return (
    <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Mapa de Ocorrências</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-6 min-h-[320px] bg-muted/20">
        <p className="text-muted-foreground">Mapa não disponível</p>
      </CardContent>
    </Card>
  );
};

export default MapSection;
