
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin } from "lucide-react";
import RouteMap from "@/components/RouteMap";

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RouteMapVisualizationProps {
  date: Date | undefined;
  routePoints: LocationPoint[];
  isLoading: boolean;
}

const RouteMapVisualization = ({ date, routePoints, isLoading }: RouteMapVisualizationProps) => {
  // Format the date if it exists
  const formattedDate = date ? format(date, "EEEE, dd 'de' MMMM", { locale: ptBR }) : '';

  return (
    <Card className="mb-6 relative z-10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Visualização da Rota</CardTitle>
        <div className="text-sm text-muted-foreground">
          {formattedDate}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="w-full h-[400px] bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-500">Carregando rota...</p>
            </div>
          </div>
        ) : routePoints.length > 0 ? (
          <RouteMap 
            routePoints={routePoints} 
            height="400px"
            showMarkers={true}
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto" />
              <p className="mt-4 text-gray-600">
                Selecione uma data para visualizar a rota percorrida.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteMapVisualization;
