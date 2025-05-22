
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { MapMarker } from "@/types/map";

interface MapContainerProps {
  markers: MapMarker[];
  userLocation: [number, number] | null;
  enableClustering: boolean;
}

const MapContainer = ({ markers, userLocation, enableClustering }: MapContainerProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-8 h-[70vh]">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Mapa não disponível</h2>
        <p className="text-muted-foreground text-center max-w-md">
          O recurso de mapa foi desativado nesta versão do aplicativo. 
          Por favor, utilize as outras funcionalidades disponíveis.
        </p>
      </CardContent>
    </Card>
  );
};

export default MapContainer;
