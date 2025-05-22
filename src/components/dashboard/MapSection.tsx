
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
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
      <CardContent className="flex flex-col items-center justify-center p-6 min-h-[320px]">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-center">
          O recurso de mapa foi desativado nesta versão do aplicativo.
        </p>
      </CardContent>
    </Card>
  );
};

export default MapSection;
